import { difficultyColors, palette } from "@core/theme/colors";
import { radius, spacing } from "@core/theme/spacing";
import { fontFamily, fontSize } from "@core/theme/typography";
import { SAMPLE_QUESTIONS } from "@data/seeds/sampleQuestions";
import { getQuestionText } from "@domain/entities/Question";
import { useSettingsStore } from "@presentation/store/settingsStore";
import { router } from "expo-router";
import { ArrowLeft, Search as SearchIcon } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { language } = useSettingsStore();
  const [query, setQuery] = useState("");

  const filtered =
    query.trim().length > 1
      ? SAMPLE_QUESTIONS.filter((q) =>
          getQuestionText(q, language)
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
      : [];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color={palette.textPrimary} />
        </TouchableOpacity>

        <View style={styles.inputBox}>
          <SearchIcon size={18} color={palette.textMuted} />
          <TextInput
            style={styles.input}
            placeholder={t(
              "search.placeholder",
              "Search questions & prompts...",
            )}
            placeholderTextColor={palette.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            accessibilityLabel="Search input"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          query.trim().length > 1 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptyDesc}>
                No prompts matched &quot;{query}&quot;. Try a different keyword.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyDesc}>
                Start typing above to search through all questions.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const diffColor =
            difficultyColors[item.difficulty] ?? palette.warmAmber;
          return (
            <View style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.categoryTag}>
                  {item.category.replace(/_/g, " ")}
                </Text>
                <View style={[styles.diffTag, { borderColor: diffColor }]}>
                  <Text style={[styles.diffText, { color: diffColor }]}>
                    {item.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.promptText}>
                {getQuestionText(item, language)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#161B22",
    paddingHorizontal: spacing["4"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    paddingVertical: spacing["3"],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: "#1F2733",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#263242",
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2733",
    borderRadius: radius.md,
    paddingHorizontal: spacing["3"],
    paddingVertical: spacing["2"],
    borderWidth: 1,
    borderColor: "#263242",
    gap: spacing["2"],
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
  listContent: {
    gap: spacing["3"],
    paddingVertical: spacing["3"],
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing["12"],
    paddingHorizontal: spacing["6"],
  },
  emptyTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
    marginBottom: spacing["2"],
  },
  emptyDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    textAlign: "center",
  },
  resultCard: {
    backgroundColor: "#1F2733",
    borderRadius: radius.lg,
    padding: spacing["4"],
    borderWidth: 1,
    borderColor: "#263242",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing["2"],
  },
  categoryTag: {
    fontFamily: fontFamily.semiBold,
    fontSize: 10,
    color: palette.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  diffTag: {
    paddingHorizontal: spacing["2"],
    paddingVertical: 1,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  diffText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  promptText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    lineHeight: fontSize.base * 1.4,
  },
});
