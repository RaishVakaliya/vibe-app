import type { SupportedLanguageCode } from "@core/constants";

export interface User {
  uid: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
  language: SupportedLanguageCode;
  createdAt: Date;
  lastActive: Date;
  isPremium: boolean;
  coins: number;
  streak: number;
  gamesPlayed: number;
  questionsAnswered: number;
  fcmToken: string | null;
  isGuest: boolean;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  dailyQuestion: boolean;
  streakReminder: boolean;
  newPack: boolean;
  friendJoined: boolean;
}

export function createGuestUser(uid: string): User {
  return {
    uid,
    name: "Player",
    email: null,
    photoUrl: null,
    language: "en",
    createdAt: new Date(),
    lastActive: new Date(),
    isPremium: false,
    coins: 0,
    streak: 0,
    gamesPlayed: 0,
    questionsAnswered: 0,
    fcmToken: null,
    isGuest: true,
    notificationPreferences: {
      dailyQuestion: true,
      streakReminder: true,
      newPack: true,
      friendJoined: true,
    },
  };
}
