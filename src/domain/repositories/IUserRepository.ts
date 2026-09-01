import type { User } from '../entities/User';

export interface UpdateUserParams {
  name?: string;
  photoUrl?: string;
  language?: string;
  fcmToken?: string;
  notificationPreferences?: Partial<User['notificationPreferences']>;
}

export interface IUserRepository {
  getUser(uid: string): Promise<User | null>;

  createUser(user: User): Promise<void>;

  updateUser(uid: string, updates: UpdateUserParams): Promise<void>;

  addCoins(uid: string, amount: number): Promise<number>;

  deductCoins(uid: string, amount: number): Promise<number>;

  incrementGamesPlayed(uid: string): Promise<void>;

  incrementQuestionsAnswered(uid: string, count: number): Promise<void>;

  updateStreak(uid: string): Promise<number>;

  setPremiumStatus(uid: string, isPremium: boolean): Promise<void>;

  deleteUser(uid: string): Promise<void>;
}
