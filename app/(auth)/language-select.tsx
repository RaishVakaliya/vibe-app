import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import i18n from '@core/localization/i18n';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { SUPPORTED_LANGUAGES } from '@core/constants';
import { Storage, STORAGE_KEYS } from '@data/datasources/LocalStorageDataSource';
import { useSettingsStore } from '@presentation/store/settingsStore';

export default function LanguageSelectRoute() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { setLanguage } = useSettingsStore();
  const [selected, setSelected] = useState<string>(Storage.getString(STORAGE_KEYS.LANGUAGE) ?? 'en');

  const handleSelect = async (code: string) => {
    setSelected(code);
    setLanguage(code as typeof SUPPORTED_LANGUAGES[number]['code']);
    await i18n.changeLanguage(code);
    Storage.setString(STORAGE_KEYS.LANGUAGE, code);
  };

  const handleContinue = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <LinearGradient
      colors={['#0D0D1A', '#111128', '#0D0D1A']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>{t('language.subtitle')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {SUPPORTED_LANGUAGES.map((lang, i) => (
          <Animated.View key={lang.code} entering={FadeInDown.delay(i * 40).duration(300)}>
            <TouchableOpacity
              style={[styles.langItem, selected === lang.code && styles.langItemSelected]}
              onPress={() => void handleSelect(lang.code)}
              accessibilityLabel={`${lang.name} (${lang.nativeName})`}
              accessibilityRole="radio"
              accessibilityState={{ selected: selected === lang.code }}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <View style={styles.langText}>
                <Text style={styles.langName}>{lang.name}</Text>
                <Text style={styles.langNative}>{lang.nativeName}</Text>
              </View>
              {selected === lang.code && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleContinue}
        activeOpacity={0.85}
        accessibilityLabel="Continue"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={[palette.purpleVibrant, palette.pinkHot]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueBtnGradient}
        >
          <Text style={styles.continueBtnText}>{t('common.continue')} →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing['4'] },
  header: { paddingVertical: spacing['6'], alignItems: 'center' },
  title: { fontFamily: fontFamily.extraBold, fontSize: fontSize['2xl'], color: palette.white, marginBottom: spacing['2'] },
  subtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: palette.whiteAlpha70, textAlign: 'center' },
  list: { paddingBottom: spacing['4'], gap: spacing['2'] },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.lg,
    padding: spacing['4'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: spacing['3'],
  },
  langItemSelected: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderColor: palette.purpleVibrant,
  },
  langFlag: { fontSize: 28 },
  langText: { flex: 1 },
  langName: { fontFamily: fontFamily.semiBold, fontSize: fontSize.base, color: palette.white },
  langNative: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: palette.whiteAlpha70 },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.purpleVibrant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { fontFamily: fontFamily.bold, fontSize: 14, color: palette.white },
  continueBtn: {
    marginVertical: spacing['4'],
    height: 56,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  continueBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: palette.white },
});
