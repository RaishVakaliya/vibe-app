import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing } from '@core/theme/spacing';

const TERMS_CONTENT = `Last updated: January 2025

Welcome to VIBE – Questions, Games & Challenges.

1. ACCEPTANCE OF TERMS
By using VIBE, you agree to these Terms of Service.

2. USE OF SERVICE
You may use VIBE for personal, non-commercial purposes. You must not upload harmful or inappropriate content.

3. SUBSCRIPTIONS & PURCHASES
VIBE PRO subscriptions auto-renew unless cancelled at least 24 hours before the renewal date. Lifetime purchases are one-time and non-refundable.

4. INTELLECTUAL PROPERTY
All app content, design, and trademarks belong to VIBE. You may not copy or redistribute our content without permission.

5. LIMITATION OF LIABILITY
VIBE is provided "as is". We are not liable for any damages arising from your use of the app.

6. CHANGES
We reserve the right to modify these terms at any time. Continued use constitutes acceptance.

7. CONTACT
legal@vibequestions.app`;

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#0D0D1A' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0D0D1A', '#111128']} style={[{ flex: 1, paddingHorizontal: spacing['4'] }, { paddingTop: insets.top }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing['4'] }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: palette.white }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: palette.white, marginLeft: spacing['4'] }}>Terms of Service</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.base, color: palette.whiteAlpha70, lineHeight: 26 }}>
            {TERMS_CONTENT}
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
