import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Users, Play, ChevronRight, Crown } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useRoomStore, selectCurrentRoomQuestion, selectIsHost } from '@presentation/store/roomStore';
import { getQuestionText } from '@domain/entities/Question';
import { useSettingsStore } from '@presentation/store/settingsStore';
import { roomRepository } from '@data/repositories/RoomRepository';

export default function RoomGameRoute() {
  const params = useLocalSearchParams<{ code: string }>();
  const code = (params.code ?? '??????').toUpperCase();
  const insets = useSafeAreaInsets();
  const { room, players, questions, currentQuestionIndex, setRoom, setPlayers, setQuestions, setCurrentQuestionIndex } = useRoomStore();
  const { language } = useSettingsStore();
  const isHost = useRoomStore(selectIsHost);
  const currentQuestion = useRoomStore(selectCurrentRoomQuestion);

  useEffect(() => {
    const roomId = `room_${code}`;
    const unsubRoom = roomRepository.listenToRoom(roomId, (updatedRoom) => {
      if (updatedRoom) {
        setRoom(updatedRoom);
        setCurrentQuestionIndex(updatedRoom.currentQuestionIndex);
      }
    });

    const unsubPlayers = roomRepository.listenToRoomPlayers(roomId, (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    roomRepository.getRoomQuestions(roomId).then((qs) => {
      if (qs.length > 0) setQuestions(qs);
    });

    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [code, setRoom, setPlayers, setQuestions, setCurrentQuestionIndex]);

  const handleStartGame = async () => {
    const roomId = `room_${code}`;
    await roomRepository.updateRoomQuestion(roomId, 0);
  };

  const handleNextQuestion = async () => {
    const nextIdx = currentQuestionIndex + 1;
    const roomId = `room_${code}`;
    if (nextIdx < questions.length) {
      await roomRepository.updateRoomQuestion(roomId, nextIdx);
    } else {
      await roomRepository.endRoom(roomId);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={palette.textPrimary} />
        </TouchableOpacity>
        <View style={styles.roomCodePill}>
          <Text style={styles.roomCodeLabel}>ROOM</Text>
          <Text style={styles.roomCodeValue}>{code}</Text>
        </View>
        <View style={styles.playerCountBadge}>
          <Users size={14} color={palette.warmAmber} />
          <Text style={styles.playerCountText}>{players.length}</Text>
        </View>
      </View>

      <View style={styles.container}>
        {room?.status === 'waiting' ? (
          <ScrollView contentContainerStyle={styles.lobbyScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.lobbyCard}>
              <Text style={styles.lobbyTitle}>Room Lobby</Text>
              <Text style={styles.lobbySubtitle}>Waiting for host to start the round</Text>

              <View style={styles.playerList}>
                <Text style={styles.playersHeader}>Joined Players ({players.length})</Text>
                {players.map((p, idx) => (
                  <View key={p.id || idx} style={styles.playerRow}>
                    <View style={[styles.playerAvatar, { backgroundColor: p.isHost ? palette.warmAmber : palette.surfaceElevated }]}>
                      <Text style={[styles.playerInitial, p.isHost && { color: '#0A0D12' }]}>
                        {p.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.playerName}>{p.name}</Text>
                    {p.isHost && (
                      <View style={styles.hostTag}>
                        <Crown size={12} color={palette.warmAmber} />
                        <Text style={styles.hostTagText}>Host</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {isHost ? (
                <TouchableOpacity style={styles.startBtn} onPress={() => void handleStartGame()} activeOpacity={0.85}>
                  <Play size={18} color="#0A0D12" />
                  <Text style={styles.startBtnText}>Start Live Game</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.waitingNotice}>
                  <Text style={styles.waitingText}>Only the host can launch the game.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.gameView}>
            <View style={styles.questionCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.progressText}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Text>
              </View>

              <View style={styles.questionBody}>
                <Text style={styles.questionText}>
                  {currentQuestion ? getQuestionText(currentQuestion, language) : 'Loading next prompt...'}
                </Text>
              </View>

              {isHost && (
                <TouchableOpacity style={styles.nextBtn} onPress={() => void handleNextQuestion()} activeOpacity={0.85}>
                  <Text style={styles.nextBtnText}>
                    {currentQuestionIndex + 1 >= questions.length ? 'Finish Session' : 'Next Question'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#161B22', paddingHorizontal: spacing['4'] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  roomCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    backgroundColor: '#1F2733',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#263242',
  },
  roomCodeLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: palette.warmAmber,
    letterSpacing: 1,
  },
  roomCodeValue: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
    letterSpacing: 3,
  },
  playerCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1F2733',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#263242',
  },
  playerCountText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
  },
  container: { flex: 1 },
  lobbyScroll: { paddingVertical: spacing['4'] },
  lobbyCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: '#263242',
  },
  lobbyTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.xl,
    color: palette.textPrimary,
    marginBottom: 4,
  },
  lobbySubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    marginBottom: spacing['5'],
  },
  playerList: {
    gap: spacing['2'],
    marginBottom: spacing['6'],
  },
  playersHeader: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    color: palette.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing['2'],
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    backgroundColor: '#161B22',
    padding: spacing['3'],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#263242',
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitial: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
  playerName: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
  hostTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(242, 169, 59, 0.15)',
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  hostTagText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: palette.warmAmber,
  },
  startBtn: {
    height: 52,
    backgroundColor: palette.warmAmber,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  startBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: '#0A0D12',
  },
  waitingNotice: {
    paddingVertical: spacing['3'],
    alignItems: 'center',
  },
  waitingText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
  },
  gameView: { flex: 1, justifyContent: 'center' },
  questionCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius['2xl'],
    padding: spacing['6'],
    borderWidth: 1,
    borderColor: '#263242',
    minHeight: 340,
    justifyContent: 'space-between',
  },
  cardHeader: { alignItems: 'center' },
  progressText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    color: palette.warmAmber,
    letterSpacing: 1,
  },
  questionBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing['6'] },
  questionText: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
    textAlign: 'center',
    lineHeight: fontSize['2xl'] * 1.35,
  },
  nextBtn: {
    height: 50,
    backgroundColor: palette.warmAmber,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  nextBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: '#0A0D12',
  },
});
