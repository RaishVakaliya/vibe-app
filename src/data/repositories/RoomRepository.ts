import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@core/firebase/firebaseApp';
import type { Room, RoomPlayer } from '@domain/entities/GameSession';
import type { Question } from '@domain/entities/Question';
import type { IRoomRepository, CreateRoomParams } from '@domain/repositories/IRoomRepository';
import { generateRoomCode, shuffleArray } from '@core/utils/shuffleUtils';
import { SAMPLE_QUESTIONS } from '@data/seeds/sampleQuestions';
import { Storage } from '@data/datasources/LocalStorageDataSource';
import { ROOM_EXPIRY_MINUTES } from '@core/constants';

const ROOMS_CACHE_KEY = 'vibe_active_rooms';

interface StoredRoomData {
  room: Room;
  players: RoomPlayer[];
  questions: Question[];
}

class RoomRepositoryImpl implements IRoomRepository {
  private activeRooms = new Map<string, StoredRoomData>();
  private roomListeners = new Map<string, Set<(room: Room | null) => void>>();
  private playerListeners = new Map<string, Set<(players: RoomPlayer[]) => void>>();

  constructor() {
    this.hydrateFromStorage();
  }

  private hydrateFromStorage() {
    const cached = Storage.getJSON<Record<string, StoredRoomData>>(ROOMS_CACHE_KEY);
    if (cached) {
      Object.entries(cached).forEach(([code, data]) => {
        this.activeRooms.set(code.toUpperCase(), data);
      });
    }
  }

  private persistRooms() {
    const obj: Record<string, StoredRoomData> = {};
    this.activeRooms.forEach((data, code) => {
      obj[code] = data;
    });
    Storage.setJSON(ROOMS_CACHE_KEY, obj);
  }

  async createRoom(params: CreateRoomParams): Promise<Room> {
    const code = generateRoomCode();
    const expiresAt = new Date(Date.now() + ROOM_EXPIRY_MINUTES * 60 * 1000);

    const categoryQuestions = SAMPLE_QUESTIONS.filter((q) => {
      const matchCat = params.category === 'random' || q.category === params.category;
      const matchDiff = !params.difficulty || q.difficulty === params.difficulty;
      return matchCat && matchDiff;
    });
    const pool = categoryQuestions.length >= params.questionCount
      ? categoryQuestions
      : SAMPLE_QUESTIONS.filter((q) => params.category === 'random' || q.category === params.category);

    const selectedQuestions = shuffleArray(pool).slice(0, params.questionCount);

    const room: Room = {
      id: `room_${code}`,
      code,
      hostId: params.hostId,
      hostName: params.hostName || 'Host',
      category: params.category,
      difficulty: params.difficulty,
      language: params.language,
      status: 'waiting',
      currentQuestionIndex: 0,
      questionCount: selectedQuestions.length,
      createdAt: new Date(),
      expiresAt,
      maxPlayers: params.maxPlayers,
    };

    const hostPlayer: RoomPlayer = {
      id: params.hostId,
      name: params.hostName || 'Host',
      avatarColor: '#F2A93B',
      isHost: true,
      joinedAt: new Date(),
      isActive: true,
      score: 0,
    };

    const storedData: StoredRoomData = {
      room,
      players: [hostPlayer],
      questions: selectedQuestions,
    };

    this.activeRooms.set(code, storedData);
    this.persistRooms();
    this.notifyRoomChange(code);
    this.notifyPlayersChange(code);

    // Sync to Firestore in background
    try {
      const roomRef = doc(db, 'rooms', code);
      await setDoc(roomRef, {
        ...room,
        createdAt: room.createdAt.toISOString(),
        expiresAt: room.expiresAt.toISOString(),
        players: [hostPlayer],
        questions: selectedQuestions,
      });
    } catch {
      // Offline fallback
    }

    return room;
  }

  async joinRoom(code: string, player: Omit<RoomPlayer, 'joinedAt' | 'isActive' | 'score'>): Promise<Room> {
    const normalizedCode = code.trim().toUpperCase();

    // Try fetching from Firestore first if not in local map
    try {
      const roomRef = doc(db, 'rooms', normalizedCode);
      const snap = await getDoc(roomRef);
      if (snap.exists()) {
        const data = snap.data();
        const firestoreRoom: Room = {
          ...data,
          createdAt: new Date(data.createdAt),
          expiresAt: new Date(data.expiresAt),
        } as Room;

        this.activeRooms.set(normalizedCode, {
          room: firestoreRoom,
          players: (data.players ?? []).map((p: any) => ({ ...p, joinedAt: new Date(p.joinedAt) })),
          questions: data.questions ?? [],
        });
      }
    } catch {
      // Offline fallback
    }

    const roomData = this.activeRooms.get(normalizedCode);
    if (!roomData) {
      throw new Error('Room not found. Please verify the 6-character room code.');
    }

    if (roomData.room.status === 'completed' || roomData.room.status === 'expired') {
      throw new Error('This game session has already ended.');
    }

    const existingPlayerIndex = roomData.players.findIndex((p) => p.id === player.id);
    if (existingPlayerIndex >= 0 && roomData.players[existingPlayerIndex]) {
      roomData.players[existingPlayerIndex].isActive = true;
    } else {
      if (roomData.players.length >= roomData.room.maxPlayers) {
        throw new Error('Room is full.');
      }
      roomData.players.push({
        ...player,
        joinedAt: new Date(),
        isActive: true,
        score: 0,
      });
    }

    this.persistRooms();
    this.notifyRoomChange(normalizedCode);
    this.notifyPlayersChange(normalizedCode);

    // Sync updated player list to Firestore
    try {
      const roomRef = doc(db, 'rooms', normalizedCode);
      await updateDoc(roomRef, {
        players: roomData.players,
      });
    } catch {
      // Offline fallback
    }

    return roomData.room;
  }

  async leaveRoom(roomId: string, playerId: string): Promise<void> {
    const code = roomId.replace('room_', '').toUpperCase();
    const roomData = this.activeRooms.get(code);
    if (roomData) {
      roomData.players = roomData.players.filter((p) => p.id !== playerId);
      if (roomData.players.length === 0) {
        this.activeRooms.delete(code);
      }
      this.persistRooms();
      this.notifyRoomChange(code);
      this.notifyPlayersChange(code);

      try {
        const roomRef = doc(db, 'rooms', code);
        await updateDoc(roomRef, {
          players: roomData.players,
        });
      } catch {
        // Ignored
      }
    }
  }

  async getRoomByCode(code: string): Promise<Room | null> {
    const normalized = code.trim().toUpperCase();
    const data = this.activeRooms.get(normalized);
    return data?.room ?? null;
  }

  listenToRoom(roomId: string, callback: (room: Room | null) => void): () => void {
    const code = roomId.replace('room_', '').toUpperCase();
    if (!this.roomListeners.has(code)) {
      this.roomListeners.set(code, new Set());
    }
    const set = this.roomListeners.get(code)!;
    set.add(callback);

    // Initial emit
    const current = this.activeRooms.get(code)?.room ?? null;
    callback(current);

    // Realtime Firestore onSnapshot listener
    let unsubFirestore: (() => void) | null = null;
    try {
      const roomRef = doc(db, 'rooms', code);
      unsubFirestore = onSnapshot(roomRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const updatedRoom: Room = {
            ...data,
            createdAt: new Date(data.createdAt),
            expiresAt: new Date(data.expiresAt),
          } as Room;

          const existingData = this.activeRooms.get(code);
          if (existingData) {
            existingData.room = updatedRoom;
          } else {
            this.activeRooms.set(code, {
              room: updatedRoom,
              players: (data.players ?? []).map((p: any) => ({ ...p, joinedAt: new Date(p.joinedAt) })),
              questions: data.questions ?? [],
            });
          }
          this.notifyRoomChange(code);
        }
      });
    } catch {
      // Ignored if offline
    }

    return () => {
      set.delete(callback);
      if (unsubFirestore) unsubFirestore();
    };
  }

  listenToRoomPlayers(roomId: string, callback: (players: RoomPlayer[]) => void): () => void {
    const code = roomId.replace('room_', '').toUpperCase();
    if (!this.playerListeners.has(code)) {
      this.playerListeners.set(code, new Set());
    }
    const set = this.playerListeners.get(code)!;
    set.add(callback);

    const current = this.activeRooms.get(code)?.players ?? [];
    callback(current);

    return () => {
      set.delete(callback);
    };
  }

  async updateRoomQuestion(roomId: string, questionIndex: number): Promise<void> {
    const code = roomId.replace('room_', '').toUpperCase();
    const roomData = this.activeRooms.get(code);
    if (roomData) {
      roomData.room.currentQuestionIndex = questionIndex;
      if (roomData.room.status === 'waiting') {
        roomData.room.status = 'playing';
      }
      this.persistRooms();
      this.notifyRoomChange(code);

      try {
        const roomRef = doc(db, 'rooms', code);
        await updateDoc(roomRef, {
          currentQuestionIndex: questionIndex,
          status: roomData.room.status,
        });
      } catch {
        // Ignored
      }
    }
  }

  async endRoom(roomId: string): Promise<void> {
    const code = roomId.replace('room_', '').toUpperCase();
    const roomData = this.activeRooms.get(code);
    if (roomData) {
      roomData.room.status = 'completed';
      this.persistRooms();
      this.notifyRoomChange(code);

      try {
        const roomRef = doc(db, 'rooms', code);
        await updateDoc(roomRef, {
          status: 'completed',
        });
      } catch {
        // Ignored
      }
    }
  }

  async updatePlayerScore(roomId: string, playerId: string, score: number): Promise<void> {
    const code = roomId.replace('room_', '').toUpperCase();
    const roomData = this.activeRooms.get(code);
    if (roomData) {
      const p = roomData.players.find((player) => player.id === playerId);
      if (p) {
        p.score = score;
        this.persistRooms();
        this.notifyPlayersChange(code);
      }
    }
  }

  async getRoomQuestions(roomId: string): Promise<Question[]> {
    const code = roomId.replace('room_', '').toUpperCase();
    return this.activeRooms.get(code)?.questions ?? [];
  }

  private notifyRoomChange(code: string) {
    const listeners = this.roomListeners.get(code);
    if (listeners) {
      const room = this.activeRooms.get(code)?.room ?? null;
      listeners.forEach((cb) => cb(room));
    }
  }

  private notifyPlayersChange(code: string) {
    const listeners = this.playerListeners.get(code);
    if (listeners) {
      const players = this.activeRooms.get(code)?.players ?? [];
      listeners.forEach((cb) => cb(players));
    }
  }
}

export const roomRepository = new RoomRepositoryImpl();
