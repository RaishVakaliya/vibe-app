import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react-native';
import { CategoryCard } from '@presentation/components/CategoryCard';
import { palette, difficultyColors } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { GAME_CATEGORIES } from '@core/constants';
import { useGameStore } from '@presentation/store/gameStore';
import type { GameCategory, DifficultyLevel } from '@core/constants';

const CATEGORY_META: Record<GameCategory, { isPremium: boolean; count: number; isNew?: boolean }> = {
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

const DIFFICULTIES: { value: DifficultyLevel; label: string }[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'spicy', label: 'Spicy' },
];

export default function GamesTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { setCategory, setDifficulty, selectedDifficulty } = useGameStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'premium'>('all');

  const filtered = GAME_CATEGORIES.filter((c) => {
    if (c === 'custom') return false;
    const meta = CATEGORY_META[c];
    if (activeFilter === 'free') return !meta?.isPremium;
    if (activeFilter === 'premium') return meta?.isPremium;
    return true;
  });

  const handleCategoryPress = (cat: GameCategory) => {
    setCategory(cat);
    router.push(`/game/${cat}`);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />

      <View style={styles.header}>
        <Text style={styles.title}>{t('home.allCategories', 'Browse Decks')}</Text>
        <TouchableOpacity
          onPress={() => router.push('/search')}
          style={styles.searchBtn}
          accessibilityLabel="Search"
        >
          <Search size={18} color={palette.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          {DIFFICULTIES.map((d) => {
            const isSelected = selectedDifficulty === d.value;
            const color = difficultyColors[d.value];
            return (
              <TouchableOpacity
                key={d.value}
                style={[
                  styles.filterChip,
                  isSelected && { borderColor: color, backgroundColor: '#263242' },
                ]}
                onPress={() => setDifficulty(d.value)}
                accessibilityRole="radio"
              >
                <View style={[styles.diffIndicator, { backgroundColor: color }]} />
                <Text style={[styles.filterLabel, isSelected && { color: palette.textPrimary, fontFamily: fontFamily.bold }]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.divider} />

          {(['all', 'free', 'premium'] as const).map((f) => {
            const isSelected = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
                accessibilityRole="radio"
              >
                <Text style={[styles.filterLabel, isSelected && styles.filterLabelActive]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {filtered.map((cat) => {
          const meta = CATEGORY_META[cat];
          return (
            <CategoryCard
              key={cat}
              category={cat}
              title={t(`categories.${cat}`)}
              questionCount={meta?.count ?? 0}
              isPremium={meta?.isPremium ?? false}
              isNew={meta?.isNew}
              onPress={() => handleCategoryPress(cat)}
            />
          );
        })}
      </ScrollView>
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
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: '#1F2733',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  filterSection: {
    marginBottom: spacing['4'],
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing['2'],
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: radius.sm,
    backgroundColor: '#1F2733',
    borderWidth: 1,
    borderColor: '#263242',
  },
  filterChipActive: {
    borderColor: palette.warmAmber,
    backgroundColor: '#263242',
  },
  diffIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
  },
  filterLabelActive: {
    fontFamily: fontFamily.bold,
    color: palette.warmAmber,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#263242',
    marginHorizontal: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
});
