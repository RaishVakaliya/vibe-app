import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';

export default function AboutScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#0D0D1A' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0D0D1A', '#111128']} style={[{ flex: 1, paddingHorizontal: spacing['4'] }, { paddingTop: insets.top }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing['4'] }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: palette.white }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: palette.white, marginLeft: spacing['4'] }}>{t('profile.about')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', paddingVertical: spacing['8'] }}>
            <LinearGradient colors={[palette.purpleVibrant, palette.pinkHot]} style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing['4'] }}>
              <Text style={{ fontFamily: fontFamily.extraBold, fontSize: 32, color: palette.white }}>V</Text>
            </LinearGradient>
            <Text style={{ fontFamily: fontFamily.extraBold, fontSize: fontSize['2xl'], color: palette.white, letterSpacing: 4 }}>VIBE</Text>
            <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: palette.whiteAlpha70, marginTop: spacing['1'] }}>Questions • Games • Challenges</Text>
            <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: palette.whiteAlpha50, marginTop: spacing['2'] }}>Version 1.0.0</Text>
          </View>
          <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.base, color: palette.whiteAlpha70, textAlign: 'center', lineHeight: 24, paddingHorizontal: spacing['4'] }}>
            VIBE is a social question and game platform designed to bring people closer together through fun, meaningful conversations and exciting challenges.
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
