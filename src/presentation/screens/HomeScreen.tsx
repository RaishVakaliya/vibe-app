import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Flame, Coins, Search, Sparkles, ChevronRight, Crown } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { CategoryCard } from '@presentation/components/CategoryCard';
import type { GameCategory } from '@core/constants';
import { GAME_CATEGORIES } from '@core/constants';

const CATEGORY_META: Record<
  GameCategory,
  { isPremium: boolean; count: number; isNew?: boolean }
> = {
  couples: { isPremium: false, count: 120 },
  friends: { isPremium: false, count: 100 },
  best_friends: { isPremium: false, count: 80 },
  party: { isPremium: false, count: 150 },
  deep_talk: { isPremium: true, count: 90 },
  funny: { isPremium: false, count: 110 },
  would_you_rather: { isPremium: false, count: 130 },
  never_have_i_ever: { isPremium: false, count: 100 },
  truth_or_dare: { isPremium: false, count: 200 },
  who_knows_me_best: { isPremium: true, count: 70 },
  most_likely_to: { isPremium: false, count: 80 },
  date_night: { isPremium: true, count: 85, isNew: true },
  family: { isPremium: false, count: 90 },
  ice_breakers: { isPremium: false, count: 60 },
  random: { isPremium: false, count: 300 },
  custom: { isPremium: false, count: 0 },
};

interface HomeScreenProps {
  userName: string;
  streak: number;
  coins: number;
  isPremium: boolean;
  onCategoryPress: (category: GameCategory) => void;
  onDailyQuestion: () => void;
  onPremium: () => void;
  onSearch: () => void;
  onProfile: () => void;
  onCoins: () => void;
}

export function HomeScreen({
  userName,
  streak,
  coins,
  isPremium,
  onCategoryPress,
  onDailyQuestion,
  onPremium,
  onSearch,
  onProfile,
  onCoins,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const categories = GAME_CATEGORIES.filter((c) => c !== 'custom');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>VIBE</Text>
            <Text style={styles.greeting}>
              {userName
                ? t('home.greeting', { name: userName })
                : t('home.greetingGuest', 'Ready to connect')}
            </Text>
          </View>

          <View style={styles.headerRight}>
            {streak > 0 && (
              <View style={styles.streakChip}>
                <Flame size={14} color={palette.coralRose} />
                <Text style={styles.streakText}>{streak}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.coinChip}
              onPress={onCoins}
              accessibilityLabel={`${coins} coins`}
            >
              <Coins size={14} color={palette.warmAmber} />
              <Text style={styles.coinText}>{coins}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onProfile} style={styles.avatarBtn}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName?.charAt(0)?.toUpperCase() ?? 'P'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={onSearch}
          style={styles.searchBar}
          accessibilityLabel="Search prompts"
          activeOpacity={0.8}
        >
          <Search size={18} color={palette.textMuted} />
          <Text style={styles.searchPlaceholder}>Search all questions & prompts...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDailyQuestion}
          activeOpacity={0.88}
          style={styles.dailyCard}
          accessibilityRole="button"
        >
          <View style={styles.dailyBadge}>
            <Sparkles size={12} color={palette.warmAmber} />
            <Text style={styles.dailyBadgeText}>DAILY PROMPT</Text>
          </View>
          <Text style={styles.dailyTitle}>The Daily Revelation</Text>
          <Text style={styles.dailySub}>One thought-provoking question renewed every 24 hours.</Text>
          <View style={styles.dailyAction}>
            <Text style={styles.dailyActionText}>Answer Today</Text>
            <ChevronRight size={16} color={palette.warmAmber} />
          </View>
        </TouchableOpacity>

        {!isPremium && (
          <TouchableOpacity
            onPress={onPremium}
            activeOpacity={0.88}
            style={styles.proBanner}
          >
            <View style={styles.proLeft}>
              <Crown size={18} color="#0A0D12" />
              <View>
                <Text style={styles.proTitle}>Upgrade to VIBE PRO</Text>
                <Text style={styles.proSubtitle}>Unlock spicy decks & remove all ads</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#0A0D12" />
          </TouchableOpacity>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Game Categories</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <CategoryCard
                key={cat}
                category={cat}
                title={t(`categories.${cat}`)}
                questionCount={meta?.count ?? 0}
                isPremium={meta?.isPremium ?? false}
                isNew={meta?.isNew}
                onPress={() => onCategoryPress(cat)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  scroll: {
    paddingHorizontal: spacing['4'],
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['3'],
  },
  appName: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.xs,
    color: palette.warmAmber,
    letterSpacing: 2,
    marginBottom: 2,
  },
  greeting: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.xl,
    color: palette.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1F2733',
    borderRadius: radius.full,
    paddingHorizontal: spacing['2'],
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#263242',
  },
  streakText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: palette.coralRose,
  },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1F2733',
    borderRadius: radius.full,
    paddingHorizontal: spacing['2'],
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#263242',
  },
  coinText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: palette.warmAmber,
  },
  avatarBtn: {},
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1F2733',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  avatarText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2733',
    borderRadius: radius.md,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['3'],
    marginTop: spacing['3'],
    marginBottom: spacing['4'],
    borderWidth: 1,
    borderColor: '#263242',
    gap: spacing['2'],
  },
  searchPlaceholder: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textMuted,
  },
  dailyCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['5'],
    borderWidth: 1,
    borderColor: '#263242',
    marginBottom: spacing['4'],
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#161B22',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing['2'],
    paddingVertical: 3,
    borderRadius: radius.xs,
    marginBottom: spacing['2'],
    borderWidth: 1,
    borderColor: '#263242',
  },
  dailyBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: palette.warmAmber,
    letterSpacing: 0.8,
  },
  dailyTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
    marginBottom: 4,
  },
  dailySub: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    marginBottom: spacing['4'],
  },
  dailyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dailyActionText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: palette.warmAmber,
  },
  proBanner: {
    backgroundColor: palette.warmAmber,
    borderRadius: radius.lg,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['5'],
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
  },
  proTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: '#0A0D12',
  },
  proSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#3B2A10',
  },
  sectionHeader: {
    marginBottom: spacing['3'],
  },
  sectionTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
