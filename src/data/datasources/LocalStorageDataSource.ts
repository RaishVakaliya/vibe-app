import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

let storage: any = null;
try {
  if (Platform.OS !== "web") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require("react-native-mmkv");
    storage = new MMKV({ id: "vibe-storage" });
  }
} catch {
  // Fallback to memory / AsyncStorage
}

const memoryStore = new Map<string, string | number | boolean>();

const isClient = typeof window !== "undefined" || Platform.OS !== "web";

if (!storage && isClient) {
  AsyncStorage.getAllKeys()
    .then((keys) => AsyncStorage.multiGet(keys))
    .then((pairs) => {
      pairs.forEach(([key, val]) => {
        if (val !== null) {
          if (val === "true") memoryStore.set(key, true);
          else if (val === "false") memoryStore.set(key, false);
          else memoryStore.set(key, val);
        }
      });
    })
    .catch(() => {});
}

export const Storage = {
  // String
  setString(key: string, value: string): void {
    if (storage) {
      storage.set(key, value);
    } else {
      memoryStore.set(key, value);
      if (isClient) {
        AsyncStorage.setItem(key, String(value)).catch(() => {});
      }
    }
  },
  getString(key: string): string | undefined {
    if (storage) {
      return storage.getString(key);
    }
    const val = memoryStore.get(key);
    return val !== undefined ? String(val) : undefined;
  },

  // Number
  setNumber(key: string, value: number): void {
    if (storage) {
      storage.set(key, value);
    } else {
      memoryStore.set(key, value);
      if (isClient) {
        AsyncStorage.setItem(key, String(value)).catch(() => {});
      }
    }
  },
  getNumber(key: string): number | undefined {
    if (storage) {
      return storage.getNumber(key);
    }
    const val = memoryStore.get(key);
    if (val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  },

  // Boolean
  setBoolean(key: string, value: boolean): void {
    if (storage) {
      storage.set(key, value);
    } else {
      memoryStore.set(key, value);
      if (isClient) {
        AsyncStorage.setItem(key, String(value)).catch(() => {});
      }
    }
  },
  getBoolean(key: string): boolean | undefined {
    if (storage) {
      return storage.getBoolean(key);
    }
    const val = memoryStore.get(key);
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  },

  // JSON
  setJSON<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    if (storage) {
      storage.set(key, serialized);
    } else {
      memoryStore.set(key, serialized);
      if (isClient) {
        AsyncStorage.setItem(key, serialized).catch(() => {});
      }
    }
  },
  getJSON<T>(key: string): T | undefined {
    let raw: string | undefined;
    if (storage) {
      raw = storage.getString(key);
    } else {
      const val = memoryStore.get(key);
      raw = val !== undefined ? String(val) : undefined;
    }
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  },

  delete(key: string): void {
    if (storage) {
      storage.delete(key);
    } else {
      memoryStore.delete(key);
      if (isClient) {
        AsyncStorage.removeItem(key).catch(() => {});
      }
    }
  },

  clearAll(): void {
    if (storage) {
      storage.clearAll();
    } else {
      memoryStore.clear();
      if (isClient) {
        AsyncStorage.clear().catch(() => {});
      }
    }
  },

  contains(key: string): boolean {
    if (storage) {
      return storage.contains(key);
    }
    return memoryStore.has(key);
  },
} as const;

export const STORAGE_KEYS = {
  LANGUAGE: "app_language",
  THEME_MODE: "theme_mode",
  ONBOARDING_DONE: "onboarding_done",
  USER_ID: "user_id",
  COINS: "coins_cache",
  STREAK: "streak_cache",
  LAST_ACTIVE: "last_active",
  FAVORITES_CACHE: "favorites_cache",
  DAILY_QUESTION_DATE: "daily_question_date",
  DAILY_QUESTION_ANSWERED: "daily_question_answered",
  INTERSTITIAL_COUNT: "interstitial_count",
  SOUND_ENABLED: "sound_enabled",
  HAPTICS_ENABLED: "haptics_enabled",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
