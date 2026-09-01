import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, ChevronRight, Moon, Sun, Monitor, Volume2, Vibrate, Bell, Globe, Crown } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useSettingsStore } from '@presentation/store/settingsStore';
import { SUPPORTED_LANGUAGES } from '@core/constants';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    themeMode,
    soundEnabled,
    hapticsEnabled,
    language,
    notificationDailyQuestion,
    notificationStreakReminder,
    setThemeMode,
    setSoundEnabled,
    setHapticsEnabled,
    setNotification,
  } = useSettingsStore();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Back">
          <ArrowLeft size={20} color={palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.title', 'Settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.appearance', 'Appearance')}</Text>
          <View style={styles.card}>
            {(['dark', 'light', 'system'] as const).map((mode, i) => (
              <TouchableOpacity
                key={mode}
                style={[styles.row, i < 2 && styles.rowBorder]}
                onPress={() => setThemeMode(mode)}
                accessibilityRole="radio"
                accessibilityState={{ selected: themeMode === mode }}
              >
                <View style={styles.rowLeft}>
                  {mode === 'dark' && <Moon size={18} color={palette.textSecondary} />}
                  {mode === 'light' && <Sun size={18} color={palette.textSecondary} />}
                  {mode === 'system' && <Monitor size={18} color={palette.textSecondary} />}
                  <Text style={styles.rowLabel}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                  </Text>
                </View>
                {themeMode === mode && <Check size={18} color={palette.warmAmber} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <Volume2 size={18} color={palette.textSecondary} />
                <Text style={styles.rowLabel}>{t('settings.sound', 'Sound Effects')}</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ true: palette.warmAmber, false: '#263242' }}
                thumbColor={palette.textPrimary}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Vibrate size={18} color={palette.textSecondary} />
                <Text style={styles.rowLabel}>{t('settings.haptics', 'Haptic Vibrations')}</Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ true: palette.warmAmber, false: '#263242' }}
                thumbColor={palette.textPrimary}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications', 'Notifications')}</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <Bell size={18} color={palette.textSecondary} />
                <Text style={styles.rowLabel}>{t('settings.dailyReminder', 'Daily Prompt Reminder')}</Text>
              </View>
              <Switch
                value={notificationDailyQuestion}
                onValueChange={(v) => setNotification('notificationDailyQuestion', v)}
                trackColor={{ true: palette.warmAmber, false: '#263242' }}
                thumbColor={palette.textPrimary}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Bell size={18} color={palette.textSecondary} />
                <Text style={styles.rowLabel}>{t('settings.streakReminder', 'Streak Protection')}</Text>
              </View>
              <Switch
                value={notificationStreakReminder}
                onValueChange={(v) => setNotification('notificationStreakReminder', v)}
                trackColor={{ true: palette.warmAmber, false: '#263242' }}
                thumbColor={palette.textPrimary}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language', 'Language')}</Text>
          <TouchableOpacity
            style={[styles.card, styles.row]}
            onPress={() => router.push('/(auth)/language-select')}
            accessibilityLabel="Change language"
          >
            <View style={styles.rowLeft}>
              <Globe size={18} color={palette.textSecondary} />
              <Text style={styles.rowLabel}>{currentLang?.name ?? 'English'}</Text>
            </View>
            <ChevronRight size={18} color={palette.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership & Codes</Text>
          <TouchableOpacity
            style={[styles.card, styles.row]}
            onPress={() => router.push('/premium')}
            accessibilityLabel="VIBE PRO Membership"
          >
            <View style={styles.rowLeft}>
              <Crown size={18} color={palette.warmAmber} />
              <Text style={styles.rowLabel}>VIBE PRO Access</Text>
            </View>
            <ChevronRight size={18} color={palette.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#161B22', paddingHorizontal: spacing['4'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['3'],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: '#1F2733',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
  },
  scroll: { paddingBottom: 80 },
  section: {
    marginBottom: spacing['5'],
  },
  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    color: palette.textMuted,
    marginBottom: spacing['2'],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1F2733',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#263242',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    flex: 1,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#263242',
  },
  rowLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
});
