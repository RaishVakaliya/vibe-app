import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, KeyRound, LogIn } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useAuthStore } from '@presentation/store/authStore';
import { useRoomStore } from '@presentation/store/roomStore';
import { roomRepository } from '@data/repositories/RoomRepository';
import { AnalyticsService } from '@core/services/AnalyticsService';
import { ANALYTICS_EVENTS } from '@core/constants';

export default function JoinRoomRoute() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { setRoom, setLocalPlayerId, setQuestions } = useRoomStore();

  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-character room code.');
      return;
    }
    setJoining(true);
    try {
      const playerId = user?.uid ?? `guest_${Math.random().toString(36).substring(2, 8)}`;
      const playerName = user?.name ?? 'Player';

      const room = await roomRepository.joinRoom(trimmed, {
        id: playerId,
        name: playerName,
        avatarColor: '#5FA88F',
        isHost: false,
      });

      const questions = await roomRepository.getRoomQuestions(room.id);

      setRoom(room);
      setLocalPlayerId(playerId);
      setQuestions(questions);

      void AnalyticsService.logEvent(ANALYTICS_EVENTS.ROOM_JOINED, { code: trimmed });
      router.push(`/game/multiplayer/${trimmed}`);
    } catch (e: any) {
      const errorMsg = e?.message ?? t('errors.roomNotFound', 'Room not found. Please check the code.');
      Alert.alert('Unable to Join', errorMsg);
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Back">
            <ArrowLeft size={20} color={palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('multiplayer.joinRoom', 'Join Room')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <KeyRound size={32} color={palette.warmAmber} />
            </View>

            <Text style={styles.heading}>{t('multiplayer.enterCode', 'Enter Room Code')}</Text>
            <Text style={styles.subheading}>Type the 6-character code provided by the game host.</Text>

            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(v) => setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              placeholder="ABC123"
              placeholderTextColor={palette.textMuted}
              autoCapitalize="characters"
              maxLength={6}
              autoFocus
              keyboardType="default"
              accessibilityLabel="Room code input"
            />

            <TouchableOpacity
              style={[styles.joinBtn, (joining || code.length !== 6) && { opacity: 0.5 }]}
              onPress={() => void handleJoin()}
              disabled={joining || code.length !== 6}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <LogIn size={18} color="#0A0D12" />
              <Text style={styles.joinBtnText}>
                {joining ? 'Connecting...' : t('multiplayer.joinRoom', 'Join Room')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/game/multiplayer/create-room')} style={styles.createLink}>
              <Text style={styles.linkText}>Don&apos;t have a code? Create a room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#161B22', paddingHorizontal: spacing['4'] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing['3'] },
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
  headerTitle: { fontFamily: fontFamily.displayBold, fontSize: fontSize.lg, color: palette.textPrimary },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['6'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#263242',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  heading: { fontFamily: fontFamily.displayBold, fontSize: fontSize['2xl'], color: palette.textPrimary, marginBottom: spacing['2'], textAlign: 'center' },
  subheading: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: palette.textSecondary, textAlign: 'center', marginBottom: spacing['6'] },
  codeInput: {
    backgroundColor: '#161B22',
    borderRadius: radius.lg,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['4'],
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['3xl'],
    color: palette.warmAmber,
    borderWidth: 1,
    borderColor: palette.warmAmber,
    width: '100%',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: spacing['5'],
  },
  joinBtn: {
    width: '100%',
    height: 52,
    backgroundColor: palette.warmAmber,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  joinBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: '#0A0D12' },
  createLink: { marginTop: spacing['4'], padding: spacing['2'] },
  linkText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: palette.textSecondary },
});
