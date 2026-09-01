import type { Room, RoomPlayer } from '../entities/GameSession';
import type { Question } from '../entities/Question';
import type { GameCategory, DifficultyLevel, SupportedLanguageCode } from '@core/constants';

export interface CreateRoomParams {
  hostId: string;
  hostName: string;
  category: GameCategory;
  difficulty: DifficultyLevel;
  language: SupportedLanguageCode;
  questionCount: number;
  maxPlayers: number;
}

export interface IRoomRepository {
  createRoom(params: CreateRoomParams): Promise<Room>;

  joinRoom(code: string, player: Omit<RoomPlayer, 'joinedAt' | 'isActive' | 'score'>): Promise<Room>;

  leaveRoom(roomId: string, playerId: string): Promise<void>;

  getRoomByCode(code: string): Promise<Room | null>;

  listenToRoom(roomId: string, callback: (room: Room | null) => void): () => void;

  listenToRoomPlayers(roomId: string, callback: (players: RoomPlayer[]) => void): () => void;

  updateRoomQuestion(roomId: string, questionIndex: number): Promise<void>;

  endRoom(roomId: string): Promise<void>;

  updatePlayerScore(roomId: string, playerId: string, score: number): Promise<void>;

  getRoomQuestions(roomId: string): Promise<Question[]>;
}
