import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Heart, Share2, ArrowRight, ArrowLeft, Lock } from 'lucide-react-native';
import type { Question } from '@domain/entities/Question';
import { getQuestionText } from '@domain/entities/Question';
import type { SupportedLanguageCode } from '@core/constants';
import { palette, difficultyColors } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - spacing['4'] * 2, 380);
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.52, 420);
const SWIPE_THRESHOLD = 90;

interface QuestionCardProps {
  question: Question;
  nextQuestion?: Question | null;
  language: SupportedLanguageCode;
  isFavorite: boolean;
  questionNumber: number;
  totalQuestions: number;
  isPremiumLocked?: boolean;
  onFavorite: () => void;
  onShare: () => void;
  onNext: () => void;
  onPrev?: () => void;
  onUnlock?: () => void;
}

export function QuestionCard({
  question,
  nextQuestion,
  language,
  isFavorite,
  questionNumber,
  totalQuestions,
  isPremiumLocked = false,
  onFavorite,
  onShare,
  onNext,
  onPrev,
  onUnlock,
}: QuestionCardProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const diffColor = difficultyColors[question.difficulty] ?? palette.warmAmber;
  const diffLabel = question.difficulty.toUpperCase();
  const questionText = getQuestionText(question, language);

  const nextDiffColor = nextQuestion ? difficultyColors[nextQuestion.difficulty] ?? palette.warmAmber : palette.warmAmber;
  const nextDiffLabel = nextQuestion ? nextQuestion.difficulty.toUpperCase() : '';
  const nextQuestionText = nextQuestion ? getQuestionText(nextQuestion, language) : '';

  const triggerNext = useCallback(() => {
    setIsTransitioning(true);
    translateX.value = withTiming(-SCREEN_WIDTH * 1.3, { duration: 240 }, () => {
      runOnJS(onNext)();
      translateX.value = 0;
      translateY.value = 0;
      runOnJS(setIsTransitioning)(false);
    });
  }, [onNext, translateX, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 && !isTransitioning;
      },
      onPanResponderMove: (_, gesture) => {
        if (isTransitioning) return;
        translateX.value = gesture.dx;
        translateY.value = gesture.dy * 0.2;
      },
      onPanResponderRelease: (_, gesture) => {
        if (isTransitioning) return;
        if (gesture.dx < -SWIPE_THRESHOLD || gesture.vx < -0.6) {
          triggerNext();
        } else if (gesture.dx > SWIPE_THRESHOLD || gesture.vx > 0.6) {
          setIsTransitioning(true);
          translateX.value = withTiming(SCREEN_WIDTH * 1.3, { duration: 240 }, () => {
            runOnJS(onNext)();
            translateX.value = 0;
            translateY.value = 0;
            runOnJS(setIsTransitioning)(false);
          });
        } else {
          translateX.value = withSpring(0, { damping: 15, stiffness: 180 });
          translateY.value = withSpring(0, { damping: 15, stiffness: 180 });
        }
      },
    })
  ).current;

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [question.id, translateX, translateY]);

  const topCardAnimStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-12, 0, 12],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH * 0.9],
      [1, 0.2],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  const nextCardAnimStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH * 0.8],
      [0.94, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH * 0.8],
      [0.65, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.stackContainer}>
        {nextQuestion && (
          <Animated.View style={[styles.card, styles.nextCard, nextCardAnimStyle]}>
            <View style={styles.cardHeader}>
              <View style={styles.indexBadge}>
                <Text style={styles.indexText}>
                  {questionNumber + 1} / {totalQuestions}
                </Text>
              </View>
              <View style={[styles.diffBadge, { borderColor: nextDiffColor, backgroundColor: 'rgba(22, 27, 34, 0.6)' }]}>
                <View style={[styles.diffDot, { backgroundColor: nextDiffColor }]} />
                <Text style={[styles.diffText, { color: nextDiffColor }]}>{nextDiffLabel}</Text>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText} numberOfLines={4}>
                {nextQuestionText}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.categoryLabel}>{nextQuestion.category.replace(/_/g, ' ')}</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.card, styles.topCard, topCardAnimStyle]}
        >
          {isPremiumLocked && (
            <TouchableOpacity style={styles.lockOverlay} onPress={onUnlock} activeOpacity={0.95}>
              <View style={styles.lockIconBox}>
                <Lock size={24} color={palette.warmAmber} />
              </View>
              <Text style={styles.lockTitle}>VIBE PRO Question</Text>
              <Text style={styles.lockDesc}>Unlock spicy and deep-talk questions</Text>
              <View style={styles.unlockButton}>
                <Text style={styles.unlockLabel}>Unlock Now</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.cardHeader}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>
                {questionNumber} / {totalQuestions}
              </Text>
            </View>

            <View style={[styles.diffBadge, { borderColor: diffColor, backgroundColor: 'rgba(22, 27, 34, 0.6)' }]}>
              <View style={[styles.diffDot, { backgroundColor: diffColor }]} />
              <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
            </View>
          </View>

          <View style={styles.questionContainer}>
            <Text
              style={[
                styles.questionText,
                questionText.length > 110 && styles.questionTextMedium,
                questionText.length > 180 && styles.questionTextSmall,
              ]}
              accessibilityLabel={`Question: ${questionText}`}
              accessibilityRole="text"
            >
              {questionText}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.categoryLabel}>{question.category.replace(/_/g, ' ')}</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionBar}>
        {onPrev && (
          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={onPrev}
            accessibilityLabel="Previous question"
            activeOpacity={0.75}
          >
            <ArrowLeft size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.iconActionBtn, isFavorite && styles.favoriteActiveBtn]}
          onPress={onFavorite}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          activeOpacity={0.75}
        >
          <Heart
            size={20}
            color={isFavorite ? palette.coralRose : palette.textSecondary}
            fill={isFavorite ? palette.coralRose : 'transparent'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, isTransitioning && { opacity: 0.7 }]}
          onPress={triggerNext}
          disabled={isTransitioning}
          activeOpacity={0.85}
          accessibilityLabel="Next question"
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <ArrowRight size={18} color="#0A0D12" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconActionBtn}
          onPress={onShare}
          accessibilityLabel="Share question"
          activeOpacity={0.75}
        >
          <Share2 size={20} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: '100%',
  },
  stackContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1F2733',
    borderRadius: radius['2xl'],
    padding: spacing['6'],
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#263242',
  },
  topCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  nextCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indexBadge: {
    backgroundColor: '#161B22',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#263242',
  },
  indexText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
    letterSpacing: 0.5,
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing['3'],
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  diffText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4'],
  },
  questionText: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
    textAlign: 'center',
    lineHeight: fontSize['2xl'] * 1.32,
  },
  questionTextMedium: {
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * 1.35,
  },
  questionTextSmall: {
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * 1.35,
  },
  cardFooter: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: palette.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22, 27, 34, 0.92)',
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    padding: spacing['6'],
  },
  lockIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1F2733',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: '#263242',
  },
  lockTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
    marginBottom: spacing['1'],
  },
  lockDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['5'],
  },
  unlockButton: {
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
  },
  unlockLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: '#0A0D12',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    marginTop: spacing['5'],
    width: CARD_WIDTH,
  },
  iconActionBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#1F2733',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  favoriteActiveBtn: {
    borderColor: palette.coralRose,
    backgroundColor: 'rgba(239, 111, 108, 0.12)',
  },
  nextBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: palette.warmAmber,
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
