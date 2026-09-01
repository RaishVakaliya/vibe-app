import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Copy, Play, Check, Users, Sparkles } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useAuthStore } from '@presentation/store/authStore';
import { useRoomStore } from '@presentation/store/roomStore';
import { useSettingsStore } from '@presentation/store/settingsStore';
import { useGameStore } from '@presentation/store/gameStore';
import { roomRepository } from '@data/repositories/RoomRepository';
import { AnalyticsService } from '@core/services/AnalyticsService';
import { ANALYTICS_EVENTS } from '@core/constants';

export default function CreateRoomRoute() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { language } = useSettingsStore();
  const { selectedDifficulty, questionCount } = useGameStore();
  const { setRoom, setLocalPlayerId, setQuestions } = useRoomStore();

  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = async () => {
    setCreating(true);
    try {
      const hostId = user?.uid ?? `guest_${Math.random().toString(36).substring(2, 8)}`;
      const hostName = user?.name ?? 'Host';

      const room = await roomRepository.createRoom({
        hostId,
        hostName,
        category: 'friends',
        difficulty: selectedDifficulty ?? 'medium',
        language: language ?? 'en',
        questionCount: questionCount ?? 15,
        maxPlayers: 8,
      });

      const questions = await roomRepository.getRoomQuestions(room.id);

      setRoom(room);
      setLocalPlayerId(hostId);
      setQuestions(questions);
      setRoomCode(room.code);

      void AnalyticsService.logEvent(ANALYTICS_EVENTS.ROOM_CREATED, { code: room.code });
    } catch (e: any) {
      const msg = e?.message ?? t('errors.generic');
      Alert.alert('Unable to Create Room', msg);
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = async () => {
    if (roomCode) {
      await Clipboard.setStringAsync(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterLobby = () => {
    if (!roomCode) return;
    router.push(`/game/multiplayer/${roomCode}`);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('multiplayer.createRoom', 'Create Room')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {!roomCode ? (
          <View style={styles.createCard}>
            <View style={styles.iconCircle}>
              <Users size={32} color={palette.warmAmber} />
            </View>
            <Text style={styles.title}>Host a Live Session</Text>
            <Text style={styles.subtitle}>
              Generate a unique 6-character room code to invite friends on their own devices in real time.
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailBadge}>
                <Text style={styles.detailText}>{questionCount ?? 15} Questions</Text>
              </View>
              <View style={styles.detailBadge}>
                <Text style={styles.detailText}>Difficulty: {selectedDifficulty ?? 'Medium'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, creating && { opacity: 0.7 }]}
              onPress={() => void handleCreateRoom()}
              disabled={creating}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Sparkles size={18} color="#0A0D12" />
              <Text style={styles.primaryBtnText}>
                {creating ? 'Creating Room...' : 'Create Room Code'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.createdCard}>
            <View style={styles.successBadge}>
              <Check size={16} color={palette.sageTeal} />
              <Text style={styles.successText}>Room Ready</Text>
            </View>

            <Text style={styles.codePrompt}>Share this code with your friends</Text>
            
            <View style={styles.codeContainer}>
              <Text style={styles.codeNumber}>{roomCode}</Text>
            </View>

            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => void handleCopyCode()}
              activeOpacity={0.8}
            >
              {copied ? (
                <>
                  <Check size={18} color={palette.sageTeal} />
                  <Text style={[styles.copyBtnText, { color: palette.sageTeal }]}>Copied to Clipboard</Text>
                </>
              ) : (
                <>
                  <Copy size={18} color={palette.textPrimary} />
                  <Text style={styles.copyBtnText}>Copy Room Code</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleEnterLobby}
              activeOpacity={0.85}
            >
              <Play size={18} color="#0A0D12" />
              <Text style={styles.primaryBtnText}>Enter Game Lobby</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/game/multiplayer/join-room')}
              style={styles.secondaryLink}
            >
              <Text style={styles.linkText}>Have a code instead? Join Room</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#161B22',
    paddingHorizontal: spacing['4'],
  },
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
  headerTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCard: {
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
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
    marginBottom: spacing['2'],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
    marginBottom: spacing['5'],
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing['2'],
    marginBottom: spacing['6'],
  },
  detailBadge: {
    backgroundColor: '#161B22',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#263242',
  },
  detailText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: palette.warmAmber,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  primaryBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: '#0A0D12',
  },
  createdCard: {
    width: '100%',
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['6'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    backgroundColor: 'rgba(95, 168, 143, 0.15)',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: radius.full,
    marginBottom: spacing['3'],
  },
  successText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    color: palette.sageTeal,
  },
  codePrompt: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    marginBottom: spacing['3'],
  },
  codeContainer: {
    backgroundColor: '#161B22',
    paddingHorizontal: spacing['8'],
    paddingVertical: spacing['4'],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.warmAmber,
    marginBottom: spacing['4'],
  },
  codeNumber: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['4xl'],
    color: palette.warmAmber,
    letterSpacing: 6,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    backgroundColor: '#263242',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
    marginBottom: spacing['5'],
  },
  copyBtnText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
  },
  secondaryLink: {
    marginTop: spacing['4'],
    padding: spacing['2'],
  },
  linkText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
  },
});
