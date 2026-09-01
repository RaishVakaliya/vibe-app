import type { Question } from '@domain/entities/Question';
import type { IQuestionRepository, GetQuestionsParams } from '@domain/repositories/IQuestionRepository';
import type { SupportedLanguageCode } from '@core/constants';
import { SAMPLE_QUESTIONS } from '@data/seeds/sampleQuestions';
import { Storage } from '@data/datasources/LocalStorageDataSource';
import { shuffleArray } from '@core/utils/shuffleUtils';

const FAVORITES_KEY = 'vibe_user_favorites';

export class QuestionRepository implements IQuestionRepository {
  async getQuestions(params: GetQuestionsParams): Promise<Question[]> {
    let pool = SAMPLE_QUESTIONS.filter((q) => {
      const matchCategory = params.category === 'random' || q.category === params.category;
      const matchDifficulty = !params.difficulty || q.difficulty === params.difficulty;
      const matchPremium = params.premiumAllowed || !q.isPremium;
      return matchCategory && matchDifficulty && matchPremium;
    });

    if (pool.length === 0) {
      // Fallback to any difficulty within category if tier exhausted
      pool = SAMPLE_QUESTIONS.filter((q) => params.category === 'random' || q.category === params.category);
    }

    const shuffled = shuffleArray(pool);
    return shuffled.slice(0, params.count);
  }

  async getQuestionById(id: string): Promise<Question | null> {
    return SAMPLE_QUESTIONS.find((q) => q.id === id) ?? null;
  }

  async getDailyQuestion(_date: string, _language: SupportedLanguageCode): Promise<Question | null> {
    const deepQuestions = SAMPLE_QUESTIONS.filter((q) => q.difficulty === 'medium');
    return deepQuestions[0] ?? SAMPLE_QUESTIONS[0] ?? null;
  }

  async searchQuestions(query: string, language: SupportedLanguageCode): Promise<Question[]> {
    const qLower = query.toLowerCase().trim();
    if (!qLower) return [];
    return SAMPLE_QUESTIONS.filter((q) => {
      const text = (q.translations[language] ?? q.translations['en'] ?? '').toLowerCase();
      return text.includes(qLower);
    });
  }

  async getFavorites(_userId: string): Promise<Question[]> {
    const favIds = Storage.getJSON<string[]>(FAVORITES_KEY) ?? [];
    return SAMPLE_QUESTIONS.filter((q) => favIds.includes(q.id));
  }

  async addFavorite(_userId: string, questionId: string): Promise<void> {
    const favIds = Storage.getJSON<string[]>(FAVORITES_KEY) ?? [];
    if (!favIds.includes(questionId)) {
      favIds.push(questionId);
      Storage.setJSON(FAVORITES_KEY, favIds);
    }
  }

  async removeFavorite(_userId: string, questionId: string): Promise<void> {
    const favIds = Storage.getJSON<string[]>(FAVORITES_KEY) ?? [];
    const updated = favIds.filter((id) => id !== questionId);
    Storage.setJSON(FAVORITES_KEY, updated);
  }

  async isFavorite(_userId: string, questionId: string): Promise<boolean> {
    const favIds = Storage.getJSON<string[]>(FAVORITES_KEY) ?? [];
    return favIds.includes(questionId);
  }

  async reportQuestion(_questionId: string, _reason: string, _userId: string): Promise<void> {
    // In production, write to Firestore 'reports' collection
  }

  async incrementShareCount(_questionId: string): Promise<void> {
    // In production, increment shareCount field in Firestore
  }
}

export const questionRepository = new QuestionRepository();
