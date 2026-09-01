import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { QuestionCard } from '@presentation/components/QuestionCard';
import {
  useGameStore,
  selectCurrentQuestion,
  selectIsLastQuestion,
  selectProgress,
} from '@presentation/store/gameStore';
import { useSettingsStore } from '@presentation/store/settingsStore';
import { useAuthStore } from '@presentation/store/authStore';
import { questionRepository } from '@data/repositories/QuestionRepository';
import { AdManager } from '@core/services/AdManager';
import { AnalyticsService } from '@core/services/AnalyticsService';
import { ANALYTICS_EVENTS } from '@core/constants';
import type { GameCategory } from '@core/constants';

export default function GamePlayRoute() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category: string }>();
  const category = (params.category ?? 'random') as GameCategory;

  const { language } = useSettingsStore();
  const {
    session,
    selectedDifficulty,
    questionCount,
    setCategory,
    startGame,
    nextQuestion,
    previousQuestion,
    completeGame,
    resetGame,
    setLoading,
    setError,
  } = useGameStore();

  const user = useAuthStore((s) => s.user);
  const isPremium = user?.isPremium ?? false;

  const currentQuestion = useGameStore(selectCurrentQuestion);
  const isLast = useGameStore(selectIsLastQuestion);
  const progress = useGameStore(selectProgress);

  const [isFavorite, setIsFavorite] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      setCategory(category);
      const questions = await questionRepository.getQuestions({
        category,
        difficulty: selectedDifficulty,
        language: language ?? 'en',
        count: questionCount ?? 15,
        premiumAllowed: isPremium,
      });

      if (questions.length === 0) {
        setError('No questions found for this selection.');
        return;
      }

      startGame(questions);
      void AnalyticsService.logEvent(ANALYTICS_EVENTS.GAME_STARTED, {
        category,
        difficulty: selectedDifficulty,
      });
    } catch {
      setError(t('errors.generic', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [category, selectedDifficulty, language, questionCount, isPremium, setCategory, startGame, setLoading, setError, t]);

  useEffect(() => {
    if (!session || session.category !== category) {
      void loadQuestions();
    }
  }, [category, session, loadQuestions]);

  // Check if current question is favorited
  useEffect(() => {
    if (currentQuestion) {
      questionRepository.isFavorite('local', currentQuestion.id).then((fav) => {
        setIsFavorite(fav);
      });
    }
  }, [currentQuestion]);

  const handleNext = () => {
    if (isLast) {
      handleFinish();
      return;
    }
    nextQuestion();
    AdManager.onRoundCompleted();
    void AnalyticsService.logEvent(ANALYTICS_EVENTS.QUESTION_VIEWED, { category });
  };

  const handleFinish = () => {
    completeGame();
    void AnalyticsService.logEvent(ANALYTICS_EVENTS.GAME_COMPLETED, { category });
    Alert.alert(
      'Session Complete',
      'You finished all questions in this pack!',
      [
        {
          text: 'Play Again',
          onPress: () => {
            resetGame();
            void loadQuestions();
          },
        },
        {
          text: 'Done',
          onPress: () => {
            resetGame();
            router.back();
          },
          style: 'cancel',
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!currentQuestion) return;
    if (isFavorite) {
      await questionRepository.removeFavorite('local', currentQuestion.id);
      setIsFavorite(false);
    } else {
      await questionRepository.addFavorite('local', currentQuestion.id);
      setIsFavorite(true);
      void AnalyticsService.logEvent(ANALYTICS_EVENTS.QUESTION_FAVORITED, { questionId: currentQuestion.id });
    }
  };

  const handleShare = async () => {
    if (!currentQuestion) return;
    const text = currentQuestion.translations[language] ?? currentQuestion.translations['en'];
    try {
      await Share.share({
        message: `"${text}" — Shared via VIBE`,
      });
      void AnalyticsService.logEvent(ANALYTICS_EVENTS.QUESTION_SHARED, { questionId: currentQuestion.id });
    } catch {
      // Ignored
    }
  };

  if (!currentQuestion || !session) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor="#161B22" />
        <Text style={styles.loadingText}>Preparing your question deck...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityLabel="Exit game"
        >
          <ArrowLeft size={20} color={palette.textPrimary} />
        </TouchableOpacity>

        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{category.replace(/_/g, ' ')}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            resetGame();
            void loadQuestions();
          }}
          style={styles.headerBtn}
          accessibilityLabel="Restart deck"
        >
          <RotateCcw size={18} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardArea}>
        <QuestionCard
          question={currentQuestion}
          nextQuestion={session.currentQuestionIndex + 1 < session.questions.length ? session.questions[session.currentQuestionIndex + 1] : null}
          language={language}
          questionNumber={session.currentQuestionIndex + 1}
          totalQuestions={session.questions.length}
          onNext={handleNext}
          onPrev={session.currentQuestionIndex > 0 ? previousQuestion : undefined}
          onFavorite={() => void handleToggleFavorite()}
          onShare={() => void handleShare()}
          isFavorite={isFavorite}
          isPremiumLocked={currentQuestion.isPremium && !isPremium}
          onUnlock={() => router.push('/premium')}
        />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['3'],
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: '#1F2733',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  categoryInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing['3'],
  },
  categoryTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  progressBarBg: {
    width: 120,
    height: 4,
    backgroundColor: '#1F2733',
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#263242',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.warmAmber,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
