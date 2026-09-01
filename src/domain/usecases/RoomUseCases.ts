import type { Room } from '../entities/GameSession';
import type { IRoomRepository, CreateRoomParams } from '../repositories/IRoomRepository';
import { AppError } from '@core/errors/AppError';
import { MIN_ROOM_PLAYERS, MAX_ROOM_PLAYERS } from '@core/constants';

export class CreateRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(params: CreateRoomParams): Promise<Room> {
    if (params.maxPlayers < MIN_ROOM_PLAYERS) {
      throw new AppError({
        code: 'ROOM_NOT_FOUND',
        message: 'Max players too low',
        userMessage: `Rooms need at least ${MIN_ROOM_PLAYERS} players.`,
      });
    }
    if (params.maxPlayers > MAX_ROOM_PLAYERS) {
      throw new AppError({
        code: 'ROOM_FULL',
        message: 'Max players exceeded',
        userMessage: `Rooms can have at most ${MAX_ROOM_PLAYERS} players.`,
      });
    }
    return this.roomRepository.createRoom(params);
  }
}

export class JoinRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  async execute(
    code: string,
    player: { id: string; name: string; avatarColor: string; isHost: boolean }
  ): Promise<Room> {
    if (code.length !== 6) {
      throw new AppError({
        code: 'ROOM_INVALID_CODE',
        message: 'Invalid room code',
        userMessage: 'Room code must be exactly 6 characters.',
      });
    }
    return this.roomRepository.joinRoom(code.toUpperCase(), player);
  }
}
