import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { GameCategory } from '@core/constants';
import { palette, categoryAccentColors } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing['4'] * 3) / 2;

export const CATEGORY_THUMBNAILS: Record<GameCategory, string> = {
  couples: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
  friends: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
  best_friends: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
  party: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
  deep_talk: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  funny: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=400&q=80',
  would_you_rather: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=400&q=80',
  never_have_i_ever: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
  truth_or_dare: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
  who_knows_me_best: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80',
  most_likely_to: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80',
  date_night: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
  ice_breakers: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
  random: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80',
  custom: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
};

interface CategoryCardProps {
  category: GameCategory;
  title: string;
  questionCount: number;
  isPremium: boolean;
  isNew?: boolean;
  onPress: () => void;
}

export function CategoryCard({
  category,
  title,
  questionCount,
  isPremium,
  isNew,
  onPress,
}: CategoryCardProps) {
  const accent = categoryAccentColors[category] ?? palette.warmAmber;
  const thumbnailUrl = CATEGORY_THUMBNAILS[category];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={`${title} category, ${questionCount} questions`}
      accessibilityRole="button"
    >
      {thumbnailUrl && (
        <Image
          source={{ uri: thumbnailUrl }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={250}
        />
      )}

      <LinearGradient
        colors={['rgba(22, 27, 34, 0.35)', 'rgba(31, 39, 51, 0.88)', '#1F2733']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.accentLine, { backgroundColor: accent }]} />

      <View style={styles.badgeRow}>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.badgeText}>PRO</Text>
          </View>
        )}
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.count}>{questionCount}+ prompts</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 130,
    backgroundColor: '#1F2733',
    borderRadius: radius.lg,
    padding: spacing['3'],
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: '#263242',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing['3'],
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2,
  },
  badgeRow: {
    position: 'absolute',
    top: spacing['2'],
    right: spacing['2'],
    flexDirection: 'row',
    gap: 4,
    zIndex: 2,
  },
  premiumBadge: {
    backgroundColor: 'rgba(22, 27, 34, 0.85)',
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: palette.warmAmber,
  },
  badgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: palette.warmAmber,
    letterSpacing: 0.5,
  },
  newBadge: {
    backgroundColor: palette.coralRose,
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  newBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: '#0A0D12',
    letterSpacing: 0.5,
  },
  content: {
    zIndex: 2,
  },
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    marginBottom: 2,
    lineHeight: fontSize.base * 1.25,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  count: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
  },
});
