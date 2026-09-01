import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Play, Users, Lock } from 'lucide-react-native';
import { palette, difficultyColors } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useGameStore } from '@presentation/store/gameStore';
import { useAuthStore } from '@presentation/store/authStore';
import type { GameCategory } from '@core/constants';
import { DIFFICULTY_LEVELS } from '@core/constants';

const CATEGORY_DESCRIPTIONS: Record<string, { description: string; count: number; isPremium: boolean }> = {
  couples: { description: 'Deepen your bond with thoughtful questions about love, dreams, and shared memories.', count: 120, isPremium: false },
  friends: { description: 'Bond and discover unexpected truths about your closest friends.', count: 100, isPremium: false },
  party: { description: 'Break the ice and energize the room with crowd-tested party prompts.', count: 150, isPremium: false },
  deep_talk: { description: 'Go beyond small talk with questions that touch authentic emotions.', count: 90, isPremium: true },
  funny: { description: 'Hilarious and unhinged questions guaranteed to produce laughs.', count: 110, isPremium: false },
  would_you_rather: { description: 'Make impossible choices and reveal your group’s true priorities.', count: 130, isPremium: false },
  never_have_i_ever: { description: 'Find out what your friends have (and haven’t) actually done.', count: 100, isPremium: false },
  truth_or_dare: { description: 'The classic game of honest confessions and bold challenges.', count: 200, isPremium: false },
  who_knows_me_best: { description: 'Put your connections to the test to see who truly knows you best.', count: 70, isPremium: true },
  most_likely_to: { description: 'Vote on who in your circle is most likely to end up in wild scenarios.', count: 80, isPremium: false },
  date_night: { description: 'Meaningful, romantic prompts designed for a memorable evening.', count: 85, isPremium: true },
  family: { description: 'Strengthen family connections with heartwarming questions for all generations.', count: 90, isPremium: false },
  ice_breakers: { description: 'Ideal for getting to know colleagues, classmates, or new acquaintances.', count: 60, isPremium: false },
  random: { description: 'A curated mix of everything — completely unpredictable.', count: 300, isPremium: false },
  best_friends: { description: 'Only for best friends who think they know everything about each other.', count: 80, isPremium: false },
  custom: { description: 'Your own custom crafted questions.', count: 0, isPremium: false },
};

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25];

export default function GameDetailsRoute() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: string }>();
  const category = (params.category ?? 'random') as GameCategory;
  const meta = CATEGORY_DESCRIPTIONS[category];

  const { selectedDifficulty, questionCount, setDifficulty, setQuestionCount } = useGameStore();
  const user = useAuthStore((s) => s.user);
  const isPremium = user?.isPremium ?? false;

  const isLocked = (meta?.isPremium ?? false) && !isPremium;

  const handleStart = () => {
    if (isLocked) {
      router.push('/premium');
      return;
    }
    router.push({ pathname: '/game/play', params: { category } });
  };

  const handleMultiplayer = () => {
    router.push('/game/multiplayer/create-room');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={palette.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <View style={styles.promptCountBadge}>
              <Text style={styles.promptCountText}>{meta?.count ?? 100}+ PROMPTS</Text>
            </View>
            {meta?.isPremium && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>

          <Text style={styles.heroTitle}>{t(`categories.${category}`, category.replace(/_/g, ' '))}</Text>
          <Text style={styles.heroDesc}>{meta?.description ?? ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Intensity</Text>
          <View style={styles.optionRow}>
            {DIFFICULTY_LEVELS.map((d) => {
              const color = difficultyColors[d] ?? palette.warmAmber;
              const isSelected = selectedDifficulty === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.diffChip,
                    isSelected && { borderColor: color, backgroundColor: 'rgba(31, 39, 51, 0.9)' },
                  ]}
                  onPress={() => setDifficulty(d)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.tierIndicator, { backgroundColor: color }]} />
                  <Text style={[styles.diffLabel, isSelected && { color: palette.textPrimary, fontFamily: fontFamily.bold }]}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Questions</Text>
          <View style={styles.optionRow}>
            {QUESTION_COUNT_OPTIONS.map((n) => {
              const isSelected = questionCount === n;
              return (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.countChip,
                    isSelected && styles.countChipActive,
                  ]}
                  onPress={() => setQuestionCount(n)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.countLabel, isSelected && styles.countLabelActive]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            {isLocked ? (
              <>
                <Lock size={18} color="#0A0D12" />
                <Text style={styles.startBtnText}>Unlock with PRO</Text>
              </>
            ) : (
              <>
                <Play size={18} color="#0A0D12" />
                <Text style={styles.startBtnText}>Start Single Device</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.multiBtn}
            onPress={handleMultiplayer}
            activeOpacity={0.85}
          >
            <Users size={18} color={palette.textPrimary} />
            <Text style={styles.multiBtnText}>Play Live Multiplayer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#161B22', paddingHorizontal: spacing['4'] },
  scroll: { paddingBottom: 80 },
  topRow: { paddingVertical: spacing['3'] },
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
  heroCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['5'],
    marginBottom: spacing['5'],
    borderWidth: 1,
    borderColor: '#263242',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing['2'],
    marginBottom: spacing['3'],
  },
  promptCountBadge: {
    backgroundColor: '#161B22',
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: '#263242',
  },
  promptCountText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: palette.textSecondary,
    letterSpacing: 0.8,
  },
  proBadge: {
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  proBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: '#0A0D12',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
    marginBottom: spacing['2'],
  },
  heroDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.textSecondary,
    lineHeight: fontSize.base * 1.5,
  },
  section: {
    marginBottom: spacing['5'],
  },
  sectionTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    marginBottom: spacing['3'],
  },
  optionRow: { flexDirection: 'row', gap: spacing['2'] },
  diffChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
    backgroundColor: '#1F2733',
    borderWidth: 1,
    borderColor: '#263242',
    gap: 6,
  },
  tierIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  diffLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
  },
  countChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
    backgroundColor: '#1F2733',
    borderWidth: 1,
    borderColor: '#263242',
  },
  countChipActive: {
    borderColor: palette.warmAmber,
    backgroundColor: '#263242',
  },
  countLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textSecondary,
  },
  countLabelActive: {
    fontFamily: fontFamily.bold,
    color: palette.warmAmber,
  },
  actions: { gap: spacing['3'], marginTop: spacing['2'] },
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
  multiBtn: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2733',
    borderWidth: 1,
    borderColor: '#263242',
    flexDirection: 'row',
    gap: spacing['2'],
  },
  multiBtnText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
});
