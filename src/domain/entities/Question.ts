import type {
  DifficultyLevel,
  GameCategory,
  SupportedLanguageCode,
} from "@core/constants";

export interface QuestionTranslations {
  en: string;
  hi: string;
  gu: string;
  es: string;
  fr: string;
  de: string;
  pt: string;
  ar: string;
  id: string;
  bn: string;
  mr: string;
  ta: string;
  te: string;
  kn: string;
  ml: string;
}

export interface Question {
  id: string;
  category: GameCategory;
  difficulty: DifficultyLevel;
  isPremium: boolean;
  isActive: boolean;
  translations: Partial<QuestionTranslations>;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  shareCount: number;
  type: QuestionType;
  optionA?: Partial<QuestionTranslations>;
  optionB?: Partial<QuestionTranslations>;
}

export type QuestionType =
  | "standard"
  | "would_you_rather"
  | "never_have_i_ever"
  | "truth"
  | "dare"
  | "most_likely_to";

export function getQuestionText(
  question: Question,
  language: SupportedLanguageCode,
): string {
  return question.translations[language] ?? question.translations.en ?? "";
}

export function getOptionAText(
  question: Question,
  language: SupportedLanguageCode,
): string {
  return question.optionA?.[language] ?? question.optionA?.en ?? "";
}

export function getOptionBText(
  question: Question,
  language: SupportedLanguageCode,
): string {
  return question.optionB?.[language] ?? question.optionB?.en ?? "";
}
