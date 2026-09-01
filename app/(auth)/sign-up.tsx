import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';

export default function SignUpRoute() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', t('errors.weakPassword'));
      return;
    }
    setIsLoading(true);
    try {
      // TODO: wire up AuthRepository when Firebase native module is available
      Alert.alert('Note', 'Add Firebase credentials in .env to enable sign-up.');
    } catch (e) {
      Alert.alert(t('errors.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0D0D1A', '#111128', '#0D0D1A']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={styles.logo}>VIBE</Text>
            <Text style={styles.title}>{t('auth.signUp')}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.form}>
            <Text style={styles.inputLabel}>{t('auth.name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={palette.whiteAlpha30}
              autoCapitalize="words"
              accessibilityLabel="Name"
            />

            <Text style={styles.inputLabel}>{t('auth.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={palette.whiteAlpha30}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email address"
            />

            <Text style={styles.inputLabel}>{t('auth.password')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="6+ characters"
              placeholderTextColor={palette.whiteAlpha30}
              secureTextEntry
              accessibilityLabel="Password"
            />

            <TouchableOpacity
              style={[styles.signUpBtn, isLoading && { opacity: 0.7 }]}
              onPress={() => void handleSignUp()}
              disabled={isLoading}
              activeOpacity={0.85}
              accessibilityLabel="Create Account"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={[palette.purpleVibrant, palette.pinkHot]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signUpBtnGradient}
              >
                <Text style={styles.signUpBtnText}>
                  {isLoading ? '...' : `🚀 ${t('auth.createAccount')}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.signInRow}>
            <Text style={styles.signInText}>{t('auth.hasAccount')} </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.signInLink}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)}>
            <Text style={styles.terms}>{t('auth.termsAgreement')}</Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing['6'], paddingVertical: spacing['6'] },
  header: { alignItems: 'center', marginBottom: spacing['8'] },
  logo: { fontFamily: fontFamily.extraBold, fontSize: fontSize['3xl'], color: palette.white, letterSpacing: 6, marginBottom: spacing['2'] },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize['2xl'], color: palette.white },
  form: { gap: spacing['3'], marginBottom: spacing['6'] },
  inputLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: palette.whiteAlpha70 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.white,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  signUpBtn: { height: 56, borderRadius: radius.full, overflow: 'hidden', marginTop: spacing['2'] },
  signUpBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  signUpBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: palette.white },
  signInRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing['4'] },
  signInText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: palette.whiteAlpha70 },
  signInLink: { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: palette.purpleLight },
  terms: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: palette.whiteAlpha50, textAlign: 'center', lineHeight: 18 },
});
