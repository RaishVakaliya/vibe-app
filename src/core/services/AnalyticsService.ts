import type { AnalyticsEvent } from "@core/constants";

type LogEventParams = Record<string, string | number | boolean>;

function getAnalytics() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("@react-native-firebase/analytics").default as {
      logEvent: (event: string, params?: LogEventParams) => Promise<void>;
      setUserId: (id: string | null) => Promise<void>;
      setUserProperty: (name: string, value: string | null) => Promise<void>;
      logScreenView: (params: {
        screen_name: string;
        screen_class?: string;
      }) => Promise<void>;
    };
  } catch {
    return null;
  }
}

export const AnalyticsService = {
  async logEvent(
    event: AnalyticsEvent,
    params?: LogEventParams,
  ): Promise<void> {
    try {
      await getAnalytics()?.logEvent(event, params);
    } catch (e) {
      console.warn("[Analytics] logEvent failed:", e);
    }
  },

  async setUserId(uid: string | null): Promise<void> {
    try {
      await getAnalytics()?.setUserId(uid);
    } catch (e) {
      console.warn("[Analytics] setUserId failed:", e);
    }
  },

  async setUserLanguage(language: string): Promise<void> {
    try {
      await getAnalytics()?.setUserProperty("language", language);
    } catch (e) {
      console.warn("[Analytics] setUserProperty failed:", e);
    }
  },

  async logScreenView(screenName: string): Promise<void> {
    try {
      await getAnalytics()?.logScreenView({ screen_name: screenName });
    } catch (e) {
      console.warn("[Analytics] logScreenView failed:", e);
    }
  },
} as const;
