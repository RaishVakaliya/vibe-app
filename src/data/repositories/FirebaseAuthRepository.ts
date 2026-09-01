import Constants, { AppOwnership, ExecutionEnvironment } from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  signInWithCredential,
  linkWithCredential,
  GoogleAuthProvider,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@core/firebase/firebaseApp';
import { getGoogleWebClientId } from '@core/firebase/firebaseConfig';
import type { IAuthRepository, SignInWithEmailParams, SignUpWithEmailParams } from '@domain/repositories/IAuthRepository';
import type { User } from '@domain/entities/User';
import { Storage, STORAGE_KEYS } from '@data/datasources/LocalStorageDataSource';

WebBrowser.maybeCompleteAuthSession();

const isExpoGo =
  Constants.appOwnership === AppOwnership.Expo ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

function getGoogleSigninModule(): any | null {
  if (isExpoGo) {
    return null;
  }
  try {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    return GoogleSignin;
  } catch {
    return null;
  }
}

export class FirebaseAuthRepository implements IAuthRepository {
  private isConfigured = false;

  constructor() {
    this.configureGoogleSignIn();
  }

  private configureGoogleSignIn() {
    if (this.isConfigured || isExpoGo) return;
    try {
      const GoogleSignin = getGoogleSigninModule();
      if (!GoogleSignin) return;

      const webClientId = getGoogleWebClientId();
      if (webClientId) {
        GoogleSignin.configure({
          webClientId,
          offlineAccess: false,
        });
        this.isConfigured = true;
      }
    } catch (e) {
      console.warn('GoogleSignin configuration note:', e);
    }
  }

  private mapFirebaseUser(fbUser: FirebaseUser, additionalData?: Partial<User>): User {
    const localCoins = Storage.getNumber(STORAGE_KEYS.COINS) ?? 0;
    const localStreak = Storage.getNumber(STORAGE_KEYS.STREAK) ?? 0;

    return {
      uid: fbUser.uid,
      name: fbUser.displayName || additionalData?.name || 'Player',
      email: fbUser.email || '',
      photoUrl: fbUser.photoURL || additionalData?.photoUrl || null,
      language: 'en',
      createdAt: new Date(fbUser.metadata.creationTime || Date.now()),
      lastActive: new Date(),
      isPremium: additionalData?.isPremium ?? false,
      coins: additionalData?.coins ?? localCoins,
      streak: additionalData?.streak ?? localStreak,
      gamesPlayed: additionalData?.gamesPlayed ?? 0,
      questionsAnswered: additionalData?.questionsAnswered ?? 0,
      fcmToken: null,
      isGuest: fbUser.isAnonymous,
      notificationPreferences: {
        dailyQuestion: true,
        streakReminder: true,
        newPack: true,
        friendJoined: true,
      },
    };
  }

  async getCurrentUser(): Promise<User | null> {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;

    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        return this.mapFirebaseUser(fbUser, data as Partial<User>);
      }
    } catch {
      // Offline fallback
    }
    return this.mapFirebaseUser(fbUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          callback(this.mapFirebaseUser(fbUser, snap.data() as Partial<User>));
          return;
        }
      } catch {
        // Offline fallback
      }
      callback(this.mapFirebaseUser(fbUser));
    });
  }

  private async getIdToken(): Promise<string> {
    const GoogleSignin = getGoogleSigninModule();

    if (GoogleSignin) {
      this.configureGoogleSignIn();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken ?? (signInResult as any).idToken;
      if (!idToken) throw new Error('Google Sign-In failed: missing ID token.');
      return idToken;
    }

    const webClientId = getGoogleWebClientId();
    if (!webClientId) {
      throw new Error('Missing GOOGLE_WEB_CLIENT_ID in environment.');
    }

    const redirectUri = Linking.createURL('oauth');
    const nonce = Math.random().toString(36).substring(2, 15);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      webClientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token%20token&scope=${encodeURIComponent(
      'openid email profile'
    )}&nonce=${nonce}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    if (result.type === 'success' && result.url) {
      const fragment = result.url.includes('#') ? result.url.split('#')[1] : result.url.split('?')[1];
      const params: Record<string, string> = {};
      (fragment || '').split('&').forEach((part) => {
        const [k, v] = part.split('=');
        if (k && v) params[decodeURIComponent(k)] = decodeURIComponent(v);
      });
      const idToken = params['id_token'];
      if (idToken) return idToken;
    }
    throw new Error('Google Sign-In was cancelled or incomplete.');
  }

  async signInWithGoogle(): Promise<User> {
    const idToken = await this.getIdToken();
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const fbUser = userCredential.user;

    return await this.syncUserData(fbUser);
  }

  async linkWithGoogle(): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return this.signInWithGoogle();
    }

    const idToken = await this.getIdToken();
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await linkWithCredential(currentUser, credential);
    const fbUser = userCredential.user;

    return await this.syncUserData(fbUser, true);
  }

  private async syncUserData(fbUser: FirebaseUser, _isLinking = false): Promise<User> {
    const userDocRef = doc(db, 'users', fbUser.uid);
    let userData: Partial<User> = {};

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        userData = snap.data() as Partial<User>;
      }
    } catch {
      // Offline fallback
    }

    const preservedCoins = Math.max(userData.coins ?? 0, Storage.getNumber(STORAGE_KEYS.COINS) ?? 0);
    const preservedStreak = Math.max(userData.streak ?? 0, Storage.getNumber(STORAGE_KEYS.STREAK) ?? 0);

    const fullUser = this.mapFirebaseUser(fbUser, {
      ...userData,
      coins: preservedCoins,
      streak: preservedStreak,
    });

    try {
      await setDoc(
        userDocRef,
        {
          uid: fullUser.uid,
          name: fullUser.name,
          email: fullUser.email,
          photoUrl: fullUser.photoUrl,
          coins: fullUser.coins,
          streak: fullUser.streak,
          isGuest: false,
          lastActive: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch {
      // Ignored if offline
    }

    Storage.setString(STORAGE_KEYS.USER_ID, fullUser.uid);
    Storage.setNumber(STORAGE_KEYS.COINS, fullUser.coins);
    Storage.setNumber(STORAGE_KEYS.STREAK, fullUser.streak);

    return fullUser;
  }

  async signInAsGuest(): Promise<User> {
    const userCredential = await signInAnonymously(auth);
    const fbUser = userCredential.user;
    return this.mapFirebaseUser(fbUser);
  }

  async signInWithEmail(_params: SignInWithEmailParams): Promise<User> {
    throw new Error('Email sign-in is disabled. Please use Google Sign-In.');
  }

  async signUpWithEmail(_params: SignUpWithEmailParams): Promise<User> {
    throw new Error('Email sign-up is disabled. Please use Google Sign-In.');
  }

  async signInWithApple(): Promise<User> {
    throw new Error('Apple Sign-In is only available on iOS physical devices.');
  }

  async signOut(): Promise<void> {
    const GoogleSignin = getGoogleSigninModule();
    if (GoogleSignin) {
      try {
        await GoogleSignin.signOut();
      } catch {
        // Ignore if not signed in to Google
      }
    }
    await firebaseSignOut(auth);
    Storage.delete(STORAGE_KEYS.USER_ID);
  }

  async sendPasswordResetEmail(_email: string): Promise<void> {}

  async updateProfile(updates: Partial<Pick<User, 'name' | 'photoUrl'>>): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No user is currently signed in.');
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, updates as any);
    return this.mapFirebaseUser(currentUser, updates);
  }

  async deleteAccount(): Promise<void> {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.delete();
      Storage.delete(STORAGE_KEYS.USER_ID);
    }
  }
}

export const authRepository = new FirebaseAuthRepository();
