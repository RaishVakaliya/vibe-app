import {
  Storage,
  STORAGE_KEYS,
} from "@data/datasources/LocalStorageDataSource";
import type { User } from "@domain/entities/User";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  updateCoins: (coins: number) => void;
  updateStreak: (streak: number) => void;
  updatePremium: (isPremium: boolean) => void;
  upgradeGuestAccount: (googleUser: {
    uid: string;
    email: string;
    name: string;
    photoUrl?: string | null;
  }) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    user: null,
    isLoading: false,
    isInitialized: false,
    error: null,

    setUser: (user) =>
      set((state) => {
        state.user = user;
        if (user) {
          Storage.setString(STORAGE_KEYS.USER_ID, user.uid);
          Storage.setNumber(STORAGE_KEYS.COINS, user.coins);
          Storage.setNumber(STORAGE_KEYS.STREAK, user.streak);
        } else {
          Storage.delete(STORAGE_KEYS.USER_ID);
        }
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setInitialized: (initialized) =>
      set((state) => {
        state.isInitialized = initialized;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
        state.isLoading = false;
      }),

    updateCoins: (coins) =>
      set((state) => {
        if (state.user) {
          state.user.coins = coins;
          Storage.setNumber(STORAGE_KEYS.COINS, coins);
        }
      }),

    updateStreak: (streak) =>
      set((state) => {
        if (state.user) {
          state.user.streak = streak;
          Storage.setNumber(STORAGE_KEYS.STREAK, streak);
        }
      }),

    updatePremium: (isPremium) =>
      set((state) => {
        if (state.user) {
          state.user.isPremium = isPremium;
        }
      }),

    upgradeGuestAccount: (googleUser: {
      uid: string;
      email: string;
      name: string;
      photoUrl?: string | null;
    }) =>
      set((state) => {
        const previousCoins =
          state.user?.coins ?? Storage.getNumber(STORAGE_KEYS.COINS) ?? 0;
        const previousStreak =
          state.user?.streak ?? Storage.getNumber(STORAGE_KEYS.STREAK) ?? 0;
        const previousGamesPlayed = state.user?.gamesPlayed ?? 0;
        const previousQuestions = state.user?.questionsAnswered ?? 0;

        const upgradedUser: User = {
          uid: googleUser.uid,
          name: googleUser.name || "Player",
          email: googleUser.email,
          photoUrl: googleUser.photoUrl ?? null,
          language: state.user?.language ?? "en",
          createdAt: state.user?.createdAt ?? new Date(),
          lastActive: new Date(),
          isPremium: state.user?.isPremium ?? false,
          coins: previousCoins,
          streak: previousStreak,
          gamesPlayed: previousGamesPlayed,
          questionsAnswered: previousQuestions,
          fcmToken: state.user?.fcmToken ?? null,
          isGuest: false,
          notificationPreferences: state.user?.notificationPreferences ?? {
            dailyQuestion: true,
            streakReminder: true,
            newPack: true,
            friendJoined: true,
          },
        };

        state.user = upgradedUser;
        Storage.setString(STORAGE_KEYS.USER_ID, upgradedUser.uid);
        Storage.setNumber(STORAGE_KEYS.COINS, upgradedUser.coins);
        Storage.setNumber(STORAGE_KEYS.STREAK, upgradedUser.streak);
      }),

    clearError: () =>
      set((state) => {
        state.error = null;
      }),
  })),
);

export const selectUser = (state: AuthState) => state.user;
export const selectIsPremium = (state: AuthState) =>
  state.user?.isPremium ?? false;
export const selectIsGuest = (state: AuthState) => state.user?.isGuest ?? true;
export const selectCoins = (state: AuthState) => state.user?.coins ?? 0;
export const selectIsAuthenticated = (state: AuthState) => state.user !== null;
