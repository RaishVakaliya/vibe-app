import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing } from '@core/theme/spacing';

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const ACHIEVEMENTS = [
    { id: '1', icon: '🎮', title: 'First Game', desc: 'Play your first game', unlocked: true },
    { id: '2', icon: '🔥', title: '7-Day Streak', desc: 'Play 7 days in a row', unlocked: false },
    { id: '3', icon: '💬', title: 'Chatterbox', desc: 'Answer 100 questions', unlocked: false },
    { id: '4', icon: '👥', title: 'Social Butterfly', desc: 'Play in a multiplayer room', unlocked: false },
    { id: '5', icon: '❤️', title: 'Favorites Fan', desc: 'Save 10 questions', unlocked: false },
    { id: '6', icon: '⭐', title: 'Daily Devotee', desc: 'Answer 30 daily questions', unlocked: false },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0D1A' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0D0D1A', '#111128']} style={[{ flex: 1, paddingHorizontal: spacing['4'] }, { paddingTop: insets.top }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing['4'] }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: palette.white }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: palette.white, marginLeft: spacing['4'] }}>{t('profile.achievements')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, gap: spacing['3'] }}>
          {ACHIEVEMENTS.map((a) => (
            <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: a.unlocked ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: 16, padding: spacing['4'], gap: spacing['3'], borderWidth: 1, borderColor: a.unlocked ? palette.purpleVibrant : 'rgba(255,255,255,0.1)' }}>
              <Text style={{ fontSize: 36, opacity: a.unlocked ? 1 : 0.4 }}>{a.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: a.unlocked ? palette.white : palette.whiteAlpha50 }}>{a.title}</Text>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: palette.whiteAlpha50 }}>{a.desc}</Text>
              </View>
              {a.unlocked && <Text style={{ fontFamily: fontFamily.bold, fontSize: 16, color: palette.purpleVibrant }}>✓</Text>}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
