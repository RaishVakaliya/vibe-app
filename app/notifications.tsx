import React from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useSettingsStore } from '@presentation/store/settingsStore';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    notificationDailyQuestion,
    notificationStreakReminder,
    notificationNewPack,
    notificationFriendJoined,
    setNotification,
  } = useSettingsStore();

  const NOTIF_ITEMS = [
    { key: 'notificationDailyQuestion', label: t('settings.dailyReminder'), icon: '⭐', value: notificationDailyQuestion },
    { key: 'notificationStreakReminder', label: t('settings.streakReminder'), icon: '🔥', value: notificationStreakReminder },
    { key: 'notificationNewPack', label: 'New Question Packs', icon: '🎁', value: notificationNewPack },
    { key: 'notificationFriendJoined', label: 'Friend Joined Room', icon: '👥', value: notificationFriendJoined },
  ] as const;

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0D1A' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0D0D1A', '#111128']} style={[{ flex: 1, paddingHorizontal: spacing['4'] }, { paddingTop: insets.top }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing['4'] }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: palette.white }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: palette.white, marginLeft: spacing['4'] }}>{t('profile.notifications')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, gap: spacing['2'] }}>
          {NOTIF_ITEMS.map((item) => (
            <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radius.xl, padding: spacing['4'], borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Text style={{ fontSize: 22, marginRight: spacing['3'] }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontFamily: fontFamily.medium, fontSize: fontSize.base, color: palette.white }}>{item.label}</Text>
              <Switch
                value={item.value}
                onValueChange={(v) => setNotification(item.key, v)}
                trackColor={{ true: palette.purpleVibrant, false: 'rgba(255,255,255,0.15)' }}
                thumbColor={palette.white}
              />
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
