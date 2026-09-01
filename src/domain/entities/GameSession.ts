import type {
  DifficultyLevel,
  GameCategory,
  SupportedLanguageCode,
} from "@core/constants";
import type { Question } from "./Question";

export interface GameSession {
  id: string;
  category: GameCategory;
  difficulty: DifficultyLevel;
  language: SupportedLanguageCode;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  startedAt: Date;
  completedAt: Date | null;
  totalRounds: number;
  isPremium: boolean;
  mode: GameMode;
  scores: Record<string, number>;
}

export type GameMode =
  | "solo"
  | "couples"
  | "party"
  | "would_you_rather"
  | "never_have_i_ever"
  | "truth_or_dare"
  | "who_knows_me_best"
  | "most_likely_to"
  | "multiplayer";

export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  isHost: boolean;
}

export function createLocalSession(
  category: GameCategory,
  difficulty: DifficultyLevel,
  language: SupportedLanguageCode,
  players: Player[],
  questions: Question[],
  mode: GameMode = "party",
): GameSession {
  return {
    id: `local_${Date.now()}`,
    category,
    difficulty,
    language,
    players,
    questions,
    currentQuestionIndex: 0,
    startedAt: new Date(),
    completedAt: null,
    totalRounds: questions.length,
    isPremium: false,
    mode,
    scores: Object.fromEntries(players.map((p) => [p.id, 0])),
  };
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  hostName: string;
  category: GameCategory;
  difficulty: DifficultyLevel;
  language: SupportedLanguageCode;
  status: RoomStatus;
  createdAt: Date;
  expiresAt: Date;
  maxPlayers: number;
  questionCount: number;
  currentQuestionIndex: number;
}

export type RoomStatus = "waiting" | "playing" | "completed" | "expired";

export interface RoomPlayer {
  id: string;
  name: string;
  avatarColor: string;
  isHost: boolean;
  joinedAt: Date;
  isActive: boolean;
  score: number;
}

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  iconName: string;
  requiredCount: number;
  coinReward: number;
  category: AchievementCategory;
}

export type AchievementCategory =
  | "games"
  | "questions"
  | "streak"
  | "social"
  | "custom"
  | "sharing";

export interface UserAchievement {
  achievementId: string;
  progress: number;
  unlockedAt: Date | null;
  isUnlocked: boolean;
}

export interface QuestionPack {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: GameCategory;
  isPremium: boolean;
  questionCount: number;
  price: number | null;
  coverGradient: [string, string];
  isNew: boolean;
  isFeatured: boolean;
  languages: SupportedLanguageCode[];
}

export interface DailyQuestion {
  id: string;
  questionId: string;
  date: string; // YYYY-MM-DD
  answeredBy: string[];
}

export interface FavoriteQuestion {
  questionId: string;
  savedAt: Date;
  question: Question;
}
