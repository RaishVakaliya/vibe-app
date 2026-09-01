import type {
  DifficultyLevel,
  GameCategory,
  SupportedLanguageCode,
} from "@core/constants";
import type {
  GameMode,
  GameSession,
  Player,
} from "@domain/entities/GameSession";
import { createLocalSession } from "@domain/entities/GameSession";
import type { Question } from "@domain/entities/Question";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  session: GameSession | null;
  isLoading: boolean;
  error: string | null;
  selectedCategory: GameCategory | null;
  selectedDifficulty: DifficultyLevel;
  selectedLanguage: SupportedLanguageCode;
  questionCount: number;
  players: Player[];
  mode: GameMode;
}

interface GameActions {
  setCategory: (category: GameCategory) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setLanguage: (language: SupportedLanguageCode) => void;
  setQuestionCount: (count: number) => void;
  setPlayers: (players: Player[]) => void;
  setMode: (mode: GameMode) => void;

  startGame: (questions: Question[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
  completeGame: () => void;
  resetGame: () => void;

  addScore: (playerId: string, points: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DEFAULT_PLAYERS: Player[] = [
  { id: "player1", name: "Player 1", avatarColor: "#7C3AED", isHost: true },
];

export const useGameStore = create<GameState & GameActions>()(
  immer((set, get) => ({
    session: null,
    isLoading: false,
    error: null,
    selectedCategory: null,
    selectedDifficulty: "medium",
    selectedLanguage: "en",
    questionCount: 10,
    players: DEFAULT_PLAYERS,
    mode: "party",

    setCategory: (category) =>
      set((state) => {
        state.selectedCategory = category;
      }),

    setDifficulty: (difficulty) =>
      set((state) => {
        state.selectedDifficulty = difficulty;
      }),

    setLanguage: (language) =>
      set((state) => {
        state.selectedLanguage = language;
      }),

    setQuestionCount: (count) =>
      set((state) => {
        state.questionCount = count;
      }),

    setPlayers: (players) =>
      set((state) => {
        state.players = players;
      }),

    setMode: (mode) =>
      set((state) => {
        state.mode = mode;
      }),

    startGame: (questions) =>
      set((state) => {
        const {
          selectedCategory,
          selectedDifficulty,
          selectedLanguage,
          players,
          mode,
        } = state;
        if (!selectedCategory) return;
        state.session = createLocalSession(
          selectedCategory,
          selectedDifficulty,
          selectedLanguage,
          players,
          questions,
          mode,
        );
        state.error = null;
        state.isLoading = false;
      }),

    nextQuestion: () =>
      set((state) => {
        if (!state.session) return;
        const nextIndex = state.session.currentQuestionIndex + 1;
        if (nextIndex < state.session.questions.length) {
          state.session.currentQuestionIndex = nextIndex;
        }
      }),

    previousQuestion: () =>
      set((state) => {
        if (!state.session) return;
        const prevIndex = state.session.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          state.session.currentQuestionIndex = prevIndex;
        }
      }),

    skipQuestion: () => get().nextQuestion(),

    completeGame: () =>
      set((state) => {
        if (!state.session) return;
        state.session.completedAt = new Date();
      }),

    resetGame: () =>
      set((state) => {
        state.session = null;
        state.isLoading = false;
        state.error = null;
      }),

    addScore: (playerId, points) =>
      set((state) => {
        if (!state.session) return;
        const current = state.session.scores[playerId] ?? 0;
        state.session.scores[playerId] = current + points;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
        state.isLoading = false;
      }),
  })),
);

export const selectCurrentQuestion = (state: GameState) => {
  if (!state.session) return null;
  const idx = state.session.currentQuestionIndex;
  return state.session.questions[idx] ?? null;
};
export const selectIsLastQuestion = (state: GameState) =>
  state.session
    ? state.session.currentQuestionIndex >= state.session.questions.length - 1
    : false;
export const selectProgress = (state: GameState) =>
  state.session
    ? (state.session.currentQuestionIndex + 1) / state.session.totalRounds
    : 0;
