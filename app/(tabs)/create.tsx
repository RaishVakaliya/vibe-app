import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Save, Sparkles } from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { Storage } from '@data/datasources/LocalStorageDataSource';
import { useAuthStore } from '@presentation/store/authStore';

export interface CustomGameItem {
  id: string;
  title: string;
  questions: string[];
  createdAt: string;
  userId?: string;
}

export const CUSTOM_GAMES_KEY = 'vibe_custom_games';

export default function CreateTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const isPremium = user?.isPremium ?? false;

  const [gameName, setGameName] = useState('');
  const [questions, setQuestions] = useState<string[]>(['', '', '']);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, '']);
  };

  const updateQuestion = (index: number, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? value : q)));
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 3) {
      Alert.alert('Notice', 'A custom game must have at least 3 questions.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const trimmedTitle = gameName.trim();
    if (!trimmedTitle) {
      Alert.alert('Missing Title', 'Please give your custom pack a title.');
      return;
    }

    const validQuestions = questions.map((q) => q.trim()).filter((q) => q.length > 0);
    if (validQuestions.length < 3) {
      Alert.alert('Incomplete Pack', 'Please fill in at least 3 distinct questions before saving.');
      return;
    }

    setSaving(true);
    try {
      const existingGames = Storage.getJSON<CustomGameItem[]>(CUSTOM_GAMES_KEY) ?? [];
      const newGame: CustomGameItem = {
        id: `custom_${Date.now()}`,
        title: trimmedTitle,
        questions: validQuestions,
        createdAt: new Date().toISOString(),
        userId: user?.uid,
      };

      const updated = [newGame, ...existingGames];
      Storage.setJSON(CUSTOM_GAMES_KEY, updated);

      Alert.alert(
        'Pack Created',
        `"${trimmedTitle}" with ${validQuestions.length} questions has been saved to My Games.`,
        [
          {
            text: 'View in My Games',
            onPress: () => {
              setGameName('');
              setQuestions(['', '', '']);
              router.push('/(tabs)/favorites');
            },
          },
          {
            text: 'Create Another',
            onPress: () => {
              setGameName('');
              setQuestions(['', '', '']);
            },
            style: 'cancel',
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Unable to save custom game pack. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerate = () => {
    if (!isPremium) {
      router.push('/premium');
      return;
    }
    Alert.alert('AI Generator', 'AI question generation will be available in the upcoming cloud update.');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('create.title', 'Create Custom Pack')}</Text>
            <Text style={styles.headerSubtitle}>
              Craft your own tailor-made questions for your group.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.inputLabel}>{t('create.gameName', 'Pack Title')}</Text>
            <TextInput
              style={styles.textInput}
              value={gameName}
              onChangeText={setGameName}
              placeholder="e.g. Saturday Night Revelations"
              placeholderTextColor={palette.textMuted}
              accessibilityLabel="Pack title"
            />
          </View>

          <TouchableOpacity
            style={styles.aiBanner}
            onPress={handleAiGenerate}
            activeOpacity={0.85}
          >
            <View style={styles.aiLeft}>
              <Sparkles size={18} color={palette.warmAmber} />
              <Text style={styles.aiText}>{t('create.aiGenerate', 'Generate Prompts with AI')}</Text>
            </View>
            {!isPremium && (
              <View style={styles.proPill}>
                <Text style={styles.proPillText}>PRO</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.inputLabel}>
                Questions ({questions.filter((q) => q.trim()).length} of {questions.length})
              </Text>
              <Text style={styles.minRequirement}>Min. 3 required</Text>
            </View>

            {questions.map((q, idx) => (
              <View key={idx} style={styles.questionItem}>
                <View style={styles.questionIndexCircle}>
                  <Text style={styles.questionIndexText}>{idx + 1}</Text>
                </View>
                <TextInput
                  style={styles.questionInput}
                  value={q}
                  onChangeText={(val) => updateQuestion(idx, val)}
                  placeholder={`Question ${idx + 1}...`}
                  placeholderTextColor={palette.textMuted}
                  multiline
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeQuestion(idx)}
                  accessibilityLabel={`Delete question ${idx + 1}`}
                >
                  <Trash2 size={16} color={palette.textMuted} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addQuestionBtn}
              onPress={addQuestion}
              activeOpacity={0.8}
            >
              <Plus size={16} color={palette.warmAmber} />
              <Text style={styles.addQuestionText}>{t('create.addQuestion', 'Add Another Question')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Save size={18} color="#0A0D12" />
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Pack'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: spacing['4'],
  },
  headerTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    color: palette.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
  },
  section: {
    marginBottom: spacing['5'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  inputLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    marginBottom: spacing['2'],
  },
  minRequirement: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textMuted,
  },
  textInput: {
    backgroundColor: '#1F2733',
    borderRadius: radius.md,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: '#263242',
  },
  aiBanner: {
    backgroundColor: '#1F2733',
    borderRadius: radius.md,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['5'],
    borderWidth: 1,
    borderColor: '#263242',
  },
  aiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  aiText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
  },
  proPill: {
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  proPillText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: '#0A0D12',
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1F2733',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#263242',
    padding: spacing['3'],
    gap: spacing['2'],
    marginBottom: spacing['3'],
  },
  questionIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#161B22',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  questionIndexText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
  },
  questionInput: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    minHeight: 48,
    paddingVertical: 0,
  },
  deleteBtn: {
    padding: spacing['1'],
    marginTop: 2,
  },
  addQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#263242',
    backgroundColor: '#1F2733',
    marginTop: spacing['1'],
  },
  addQuestionText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: palette.warmAmber,
  },
  saveBtn: {
    height: 52,
    backgroundColor: palette.warmAmber,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    marginTop: spacing['3'],
  },
  saveBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: '#0A0D12',
  },
});
