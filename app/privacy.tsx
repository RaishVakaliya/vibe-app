import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing } from '@core/theme/spacing';

const PRIVACY_CONTENT = `Last updated: January 2025

VIBE ("we", "our", or "us") is committed to protecting your privacy.

1. INFORMATION WE COLLECT
We collect information you provide directly (name, email, language preference), usage data (games played, questions viewed), and device information.

2. HOW WE USE YOUR INFORMATION
We use your data to provide and improve the Service, personalise your experience, send notifications (with consent), and process payments.

3. DATA SHARING
We do not sell your personal data. We share data only with Firebase (Google) for authentication and analytics, and AdMob for advertising.

4. YOUR RIGHTS
You may access, correct, or delete your data at any time from the Profile > Settings screen or by contacting us.

5. CHILDREN'S PRIVACY
VIBE is not directed to children under 13. We do not knowingly collect data from children under 13.

6. CONTACT
privacy@vibequestions.app`;

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#0D0D1A' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0D0D1A', '#111128']} style={[{ flex: 1, paddingHorizontal: spacing['4'] }, { paddingTop: insets.top }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing['4'] }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 20, color: palette.white }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: palette.white, marginLeft: spacing['4'] }}>Privacy Policy</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.base, color: palette.whiteAlpha70, lineHeight: 26 }}>
            {PRIVACY_CONTENT}
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
