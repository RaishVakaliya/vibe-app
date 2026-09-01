import type { Question } from '../entities/Question';
import type { GameCategory, DifficultyLevel, SupportedLanguageCode } from '@core/constants';

export interface GetQuestionsParams {
  category: GameCategory;
  difficulty?: DifficultyLevel;
  language: SupportedLanguageCode;
  count: number;
  premiumAllowed: boolean;
}

export interface IQuestionRepository {
  getQuestions(params: GetQuestionsParams): Promise<Question[]>;

  getQuestionById(id: string): Promise<Question | null>;

  getDailyQuestion(date: string, language: SupportedLanguageCode): Promise<Question | null>;

  searchQuestions(query: string, language: SupportedLanguageCode): Promise<Question[]>;

  getFavorites(userId: string): Promise<Question[]>;

  addFavorite(userId: string, questionId: string): Promise<void>;

  removeFavorite(userId: string, questionId: string): Promise<void>;

  isFavorite(userId: string, questionId: string): Promise<boolean>;

  reportQuestion(questionId: string, reason: string, userId: string): Promise<void>;

  incrementShareCount(questionId: string): Promise<void>;
}
