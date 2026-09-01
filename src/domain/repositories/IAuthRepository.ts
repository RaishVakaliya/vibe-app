import type { User } from '../entities/User';

export interface SignInWithEmailParams {
  email: string;
  password: string;
}

export interface SignUpWithEmailParams {
  email: string;
  password: string;
  name: string;
}

export interface IAuthRepository {
  /** Returns current user or null if not authenticated */
  getCurrentUser(): Promise<User | null>;

  /** Emits user changes (including null when signed out) */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;

  signInWithEmail(params: SignInWithEmailParams): Promise<User>;

  signUpWithEmail(params: SignUpWithEmailParams): Promise<User>;

  signInWithGoogle(): Promise<User>;

  linkWithGoogle(): Promise<User>;

  signInWithApple(): Promise<User>;

  signInAsGuest(): Promise<User>;

  signOut(): Promise<void>;

  sendPasswordResetEmail(email: string): Promise<void>;

  updateProfile(updates: Partial<Pick<User, 'name' | 'photoUrl'>>): Promise<User>;

  deleteAccount(): Promise<void>;
}
