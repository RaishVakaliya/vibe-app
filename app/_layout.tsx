import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { initI18n } from "@core/localization/i18n";
import { AdManager } from "@core/services/AdManager";
import { ThemeProvider } from "@core/theme/ThemeContext";
import {
  Storage,
  STORAGE_KEYS,
} from "@data/datasources/LocalStorageDataSource";
import { useSettingsStore } from "@presentation/store/settingsStore";

// Keep splash screen visible while initializing
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const { themeMode, loadFromStorage } = useSettingsStore();

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    "BricolageGrotesque-Bold": BricolageGrotesque_700Bold,
    "BricolageGrotesque-ExtraBold": BricolageGrotesque_800ExtraBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    "Manrope-Regular": Manrope_400Regular,
    "Manrope-Medium": Manrope_500Medium,
    "Manrope-SemiBold": Manrope_600SemiBold,
    "Manrope-Bold": Manrope_700Bold,
    "Manrope-ExtraBold": Manrope_800ExtraBold,
  });

  useEffect(() => {
    async function init() {
      try {
        // Load persisted settings
        loadFromStorage();

        // Init i18n with saved language
        const savedLanguage = Storage.getString(STORAGE_KEYS.LANGUAGE);
        await initI18n(savedLanguage);

        // Apply RTL for Arabic
        if (savedLanguage === "ar") {
          I18nManager.forceRTL(true);
        }

        // Init ads
        AdManager.initialize();
      } catch (e) {
        console.warn("Init error:", e);
      } finally {
        setAppReady(true);
      }
    }
    void init();
  }, [loadFromStorage]);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  if (!appReady || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          initialMode={themeMode}
          onModeChange={(mode) => {
            Storage.setString(STORAGE_KEYS.THEME_MODE, mode);
          }}
        >
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#161B22" },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
            <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
            <Stack.Screen name="game" />
            <Stack.Screen
              name="premium"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen name="achievements" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="search" />
            <Stack.Screen name="about" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="terms" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
