import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Room, RoomPlayer } from '@domain/entities/GameSession';
import type { Question } from '@domain/entities/Question';

interface RoomState {
  room: Room | null;
  players: RoomPlayer[];
  questions: Question[];
  currentQuestionIndex: number;
  isLoading: boolean;
  error: string | null;
  localPlayerId: string | null;
}

interface RoomActions {
  setRoom: (room: Room | null) => void;
  setPlayers: (players: RoomPlayer[]) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setLocalPlayerId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState & RoomActions>()(
  immer((set) => ({
    room: null,
    players: [],
    questions: [],
    currentQuestionIndex: 0,
    isLoading: false,
    error: null,
    localPlayerId: null,

    setRoom: (room) => set((state) => { state.room = room; }),
    setPlayers: (players) => set((state) => { state.players = players; }),
    setQuestions: (questions) => set((state) => { state.questions = questions; }),
    setCurrentQuestionIndex: (index) => set((state) => { state.currentQuestionIndex = index; }),
    setLocalPlayerId: (id) => set((state) => { state.localPlayerId = id; }),
    setLoading: (loading) => set((state) => { state.isLoading = loading; }),
    setError: (error) => set((state) => { state.error = error; state.isLoading = false; }),
    reset: () => set((state) => {
      state.room = null;
      state.players = [];
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.isLoading = false;
      state.error = null;
      state.localPlayerId = null;
    }),
  }))
);

export const selectIsHost = (state: RoomState) => {
  const localPlayer = state.players.find((p) => p.id === state.localPlayerId);
  return localPlayer?.isHost ?? false;
};
export const selectCurrentRoomQuestion = (state: RoomState) =>
  state.questions[state.currentQuestionIndex] ?? null;
