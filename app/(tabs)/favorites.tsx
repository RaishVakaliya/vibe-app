import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Heart, Play, Trash2, FolderPlus, Bookmark } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { Storage } from '@data/datasources/LocalStorageDataSource';
import { questionRepository } from '@data/repositories/QuestionRepository';
import { useGameStore } from '@presentation/store/gameStore';
import { useSettingsStore } from '@presentation/store/settingsStore';
import type { Question } from '@domain/entities/Question';
import { getQuestionText } from '@domain/entities/Question';
import { CUSTOM_GAMES_KEY, type CustomGameItem } from './create';

export default function FavoritesTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { language } = useSettingsStore();
  const { startGame } = useGameStore();

  const [activeTab, setActiveTab] = useState<'favorites' | 'custom'>('favorites');
  const [favorites, setFavorites] = useState<Question[]>([]);
  const [customGames, setCustomGames] = useState<CustomGameItem[]>([]);

  const loadData = useCallback(async () => {
    const favs = await questionRepository.getFavorites('local');
    setFavorites(favs);

    const custom = Storage.getJSON<CustomGameItem[]>(CUSTOM_GAMES_KEY) ?? [];
    setCustomGames(custom);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRemoveFavorite = async (questionId: string) => {
    await questionRepository.removeFavorite('local', questionId);
    setFavorites((prev) => prev.filter((q) => q.id !== questionId));
  };

  const handleDeleteCustomGame = (gameId: string) => {
    Alert.alert('Delete Custom Pack', 'Are you sure you want to delete this custom game pack?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = customGames.filter((g) => g.id !== gameId);
          Storage.setJSON(CUSTOM_GAMES_KEY, updated);
          setCustomGames(updated);
        },
      },
    ]);
  };

  const handlePlayCustomGame = (game: CustomGameItem) => {
    const customQuestions: Question[] = game.questions.map((text, idx) => ({
      id: `custom_${game.id}_${idx}`,
      category: 'custom',
      difficulty: 'medium',
      isPremium: false,
      isActive: true,
      translations: { en: text },
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      shareCount: 0,
      type: 'standard',
    }));

    startGame(customQuestions);
    router.push({ pathname: '/game/play', params: { category: 'custom' } });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{t('favorites.title', 'Saved & Custom')}</Text>
      </View>

      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'favorites' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('favorites')}
          activeOpacity={0.8}
        >
          <Bookmark size={16} color={activeTab === 'favorites' ? '#0A0D12' : palette.textSecondary} />
          <Text style={[styles.segmentText, activeTab === 'favorites' && styles.segmentTextActive]}>
            Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'custom' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('custom')}
          activeOpacity={0.8}
        >
          <FolderPlus size={16} color={activeTab === 'custom' ? '#0A0D12' : palette.textSecondary} />
          <Text style={[styles.segmentText, activeTab === 'custom' && styles.segmentTextActive]}>
            My Games ({customGames.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {activeTab === 'favorites' ? (
          favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={36} color={palette.textMuted} />
              <Text style={styles.emptyTitle}>No Favorite Questions Yet</Text>
              <Text style={styles.emptyDesc}>
                Tap the heart icon on any question card during a game to save it here for quick access.
              </Text>
            </View>
          ) : (
            favorites.map((q) => (
              <View key={q.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.categoryBadge}>{q.category}</Text>
                  <Text style={styles.cardText}>{getQuestionText(q, language)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => void handleRemoveFavorite(q.id)}
                  accessibilityLabel="Remove favorite"
                >
                  <Trash2 size={18} color={palette.coralRose} />
                </TouchableOpacity>
              </View>
            ))
          )
        ) : customGames.length === 0 ? (
          <View style={styles.emptyState}>
            <FolderPlus size={36} color={palette.textMuted} />
            <Text style={styles.emptyTitle}>No Custom Packs Created</Text>
            <Text style={styles.emptyDesc}>
              Head over to the Create tab to author and save your own question decks.
            </Text>
            <TouchableOpacity
              style={styles.createCta}
              onPress={() => router.push('/(tabs)/create')}
              activeOpacity={0.85}
            >
              <Text style={styles.createCtaText}>Create Custom Pack</Text>
            </TouchableOpacity>
          </View>
        ) : (
          customGames.map((game) => (
            <View key={game.id} style={styles.customCard}>
              <View style={styles.customInfo}>
                <Text style={styles.customTitle}>{game.title}</Text>
                <Text style={styles.customMeta}>
                  {game.questions.length} questions • Created {new Date(game.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.customActions}>
                <TouchableOpacity
                  style={styles.playBtn}
                  onPress={() => handlePlayCustomGame(game)}
                  activeOpacity={0.85}
                >
                  <Play size={14} color="#0A0D12" />
                  <Text style={styles.playBtnText}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteCustomBtn}
                  onPress={() => handleDeleteCustomGame(game.id)}
                >
                  <Trash2 size={16} color={palette.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  header: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['3'],
    paddingBottom: spacing['2'],
  },
  title: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2733',
    marginHorizontal: spacing['4'],
    marginVertical: spacing['3'],
    borderRadius: radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: '#263242',
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['2'],
    borderRadius: radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: palette.warmAmber,
  },
  segmentText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
  },
  segmentTextActive: {
    fontFamily: fontFamily.bold,
    color: '#0A0D12',
  },
  list: {
    paddingHorizontal: spacing['4'],
    paddingBottom: 100,
    gap: spacing['3'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['10'],
    paddingHorizontal: spacing['6'],
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#263242',
    marginTop: spacing['4'],
  },
  emptyTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
    marginTop: spacing['3'],
    marginBottom: spacing['2'],
  },
  emptyDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
  },
  createCta: {
    marginTop: spacing['5'],
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing['5'],
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
  },
  createCtaText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: '#0A0D12',
  },
  card: {
    backgroundColor: '#1F2733',
    borderRadius: radius.lg,
    padding: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263242',
    gap: spacing['3'],
  },
  cardContent: {
    flex: 1,
  },
  categoryBadge: {
    fontFamily: fontFamily.semiBold,
    fontSize: 10,
    color: palette.warmAmber,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    lineHeight: fontSize.base * 1.4,
  },
  actionBtn: {
    padding: spacing['2'],
  },
  customCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius.lg,
    padding: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#263242',
  },
  customInfo: {
    flex: 1,
    marginRight: spacing['3'],
  },
  customTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    marginBottom: 2,
  },
  customMeta: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
  },
  customActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: radius.sm,
  },
  playBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: '#0A0D12',
  },
  deleteCustomBtn: {
    padding: spacing['2'],
  },
});
