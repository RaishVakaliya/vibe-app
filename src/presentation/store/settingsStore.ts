import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Storage, STORAGE_KEYS } from '@data/datasources/LocalStorageDataSource';
import type { SupportedLanguageCode } from '@core/constants';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  language: SupportedLanguageCode;
  themeMode: ThemeMode;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationDailyQuestion: boolean;
  notificationStreakReminder: boolean;
  notificationNewPack: boolean;
  notificationFriendJoined: boolean;
}

interface SettingsActions {
  setLanguage: (lang: SupportedLanguageCode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setNotification: (key: keyof Omit<SettingsState, 'language' | 'themeMode' | 'soundEnabled' | 'hapticsEnabled'>, value: boolean) => void;
  loadFromStorage: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  immer((set) => ({
    language: 'en',
    themeMode: 'dark',
    soundEnabled: true,
    hapticsEnabled: true,
    notificationDailyQuestion: true,
    notificationStreakReminder: true,
    notificationNewPack: true,
    notificationFriendJoined: true,

    setLanguage: (lang) =>
      set((state) => {
        state.language = lang;
        Storage.setString(STORAGE_KEYS.LANGUAGE, lang);
      }),

    setThemeMode: (mode) =>
      set((state) => {
        state.themeMode = mode;
        Storage.setString(STORAGE_KEYS.THEME_MODE, mode);
      }),

    setSoundEnabled: (enabled) =>
      set((state) => {
        state.soundEnabled = enabled;
        Storage.setBoolean(STORAGE_KEYS.SOUND_ENABLED, enabled);
      }),

    setHapticsEnabled: (enabled) =>
      set((state) => {
        state.hapticsEnabled = enabled;
        Storage.setBoolean(STORAGE_KEYS.HAPTICS_ENABLED, enabled);
      }),

    setNotification: (key, value) =>
      set((state) => {
        (state as SettingsState)[key] = value;
      }),

    loadFromStorage: () =>
      set((state) => {
        const lang = Storage.getString(STORAGE_KEYS.LANGUAGE);
        if (lang) state.language = lang as SupportedLanguageCode;
        const theme = Storage.getString(STORAGE_KEYS.THEME_MODE);
        if (theme) state.themeMode = theme as ThemeMode;
        const sound = Storage.getBoolean(STORAGE_KEYS.SOUND_ENABLED);
        if (sound !== undefined) state.soundEnabled = sound;
        const haptics = Storage.getBoolean(STORAGE_KEYS.HAPTICS_ENABLED);
        if (haptics !== undefined) state.hapticsEnabled = haptics;
      }),
  }))
);
