import { ANALYTICS_EVENTS } from "@core/constants";
import { AnalyticsService } from "@core/services/AnalyticsService";
import { palette } from "@core/theme/colors";
import { radius, spacing } from "@core/theme/spacing";
import { fontFamily, fontSize } from "@core/theme/typography";
import { Storage } from "@data/datasources/LocalStorageDataSource";
import { useAuthStore } from "@presentation/store/authStore";
import { router } from "expo-router";
import {
  Crown,
  Flame,
  Layers,
  Shield,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRO_TEST_CODE = "VIBETESTPRO2026";

const PRO_FEATURES = [
  {
    icon: Flame,
    title: "Unlock Spicy & Intimate Decks",
    desc: "Gain access to all unfiltered, spicy, and deep relationship questions.",
  },
  {
    icon: Sparkles,
    title: "AI Question Generator",
    desc: "Craft personalized custom question decks with instant AI generation.",
  },
  {
    icon: Layers,
    title: "Unlimited Custom Packs",
    desc: "Create and save as many custom game decks as you want.",
  },
  {
    icon: Zap,
    title: "Ad-Free Experience",
    desc: "Enjoy seamless question rounds without interstitial interruptions.",
  },
  {
    icon: Shield,
    title: "Exclusive Categories",
    desc: "Access Date Night, Deep Talk, and Who Knows Me Best.",
  },
];

export default function PremiumScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const updatePremium = useAuthStore((s) => s.updatePremium);
  const isPremium = user?.isPremium ?? false;

  const [selectedPlan, setSelectedPlan] = useState<
    "monthly" | "yearly" | "lifetime"
  >("yearly");
  const [promoCode, setPromoCode] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleRedeemCode = () => {
    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) {
      Alert.alert("Promo Code", "Please enter a promo code.");
      return;
    }

    if (trimmed === PRO_TEST_CODE) {
      updatePremium(true);
      Storage.setBoolean("is_premium", true);
      Alert.alert(
        "VIBE PRO Activated!",
        "Test entitlement granted: Spicy decks, unlimited custom packs, and all exclusive categories are now unlocked.",
        [{ text: "Enjoy VIBE PRO", onPress: () => router.back() }],
      );
    } else {
      Alert.alert(
        "Invalid Code",
        "The entered promo code is invalid or has expired.",
      );
    }
  };

  const handlePurchase = (plan: string) => {
    void AnalyticsService.logEvent(ANALYTICS_EVENTS.PURCHASE_INITIATED, {
      plan,
    });
    Alert.alert(
      "In-App Purchase",
      `In-App purchase configured for ${plan}. For dev/test mode, use promo code ${PRO_TEST_CODE} below.`,
      [
        { text: "Redeem Test Code", onPress: () => setShowPromoInput(true) },
        { text: "OK", style: "cancel" },
      ],
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          accessibilityLabel="Close"
        >
          <X size={20} color={palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VIBE PRO</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.heroBox}>
          <View style={styles.crownCircle}>
            <Crown size={36} color="#0A0D12" />
          </View>
          <Text style={styles.heroHeading}>Elevate Every Conversation</Text>
          <Text style={styles.heroSub}>
            Unlock the full VIBE experience with all spicy decks, AI tools, and
            unlimited gameplay.
          </Text>
        </View>

        <View style={styles.featuresCard}>
          {PRO_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <View
                key={i}
                style={[
                  styles.featureRow,
                  i < PRO_FEATURES.length - 1 && styles.featureDivider,
                ]}
              >
                <View style={styles.featureIconBox}>
                  <Icon size={18} color={palette.warmAmber} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.plansContainer}>
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "yearly" && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan("yearly")}
            activeOpacity={0.85}
          >
            <View style={styles.popularTag}>
              <Text style={styles.popularTagText}>SAVE 50%</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Annual Access</Text>
              <Text style={styles.planPrice}>$19.99 / yr</Text>
            </View>
            <Text style={styles.planSub}>
              Just $1.66 / month • Billed annually
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan("monthly")}
            activeOpacity={0.85}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Monthly Access</Text>
              <Text style={styles.planPrice}>$3.99 / mo</Text>
            </View>
            <Text style={styles.planSub}>
              Flexible month-to-month subscription
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "lifetime" && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan("lifetime")}
            activeOpacity={0.85}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Lifetime Unlimited</Text>
              <Text style={styles.planPrice}>$39.99</Text>
            </View>
            <Text style={styles.planSub}>
              One-time payment • Never pay again
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => handlePurchase(selectedPlan)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {isPremium
              ? "VIBE PRO is Active"
              : `Subscribe — ${selectedPlan === "yearly" ? "$19.99 / Year" : selectedPlan === "monthly" ? "$3.99 / Month" : "$39.99 Once"}`}
          </Text>
        </TouchableOpacity>

        {(__DEV__ || true) && (
          <View style={styles.promoSection}>
            {!showPromoInput ? (
              <TouchableOpacity
                style={styles.promoToggle}
                onPress={() => setShowPromoInput(true)}
                activeOpacity={0.8}
              >
                <Tag size={16} color={palette.warmAmber} />
                <Text style={styles.promoToggleText}>
                  Have a promo / test code?
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.promoInputCard}>
                <Text style={styles.promoTitle}>Redeem Testing Code</Text>
                <View style={styles.promoInputRow}>
                  <TextInput
                    style={styles.promoInput}
                    value={promoCode}
                    onChangeText={setPromoCode}
                    placeholder="Enter code (e.g. VIBETESTPRO2026)"
                    placeholderTextColor={palette.textMuted}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={styles.redeemBtn}
                    onPress={handleRedeemCode}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.redeemBtnText}>Redeem</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        <Text style={styles.legalText}>
          Payment will be charged to your App Store or Google Play account.
          Subscriptions renew automatically unless cancelled at least 24 hours
          before the end of the current period.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#161B22",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing["4"],
    paddingVertical: spacing["3"],
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: "#1F2733",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#263242",
  },
  headerTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing["4"],
    paddingBottom: 60,
  },
  heroBox: {
    alignItems: "center",
    paddingVertical: spacing["4"],
  },
  crownCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.warmAmber,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing["3"],
  },
  heroHeading: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize["2xl"],
    color: palette.textPrimary,
    textAlign: "center",
    marginBottom: spacing["2"],
  },
  heroSub: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: fontSize.sm * 1.5,
    paddingHorizontal: spacing["4"],
  },
  featuresCard: {
    backgroundColor: "#1F2733",
    borderRadius: radius.xl,
    padding: spacing["4"],
    marginVertical: spacing["4"],
    borderWidth: 1,
    borderColor: "#263242",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing["3"],
    paddingVertical: spacing["3"],
  },
  featureDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#263242",
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#161B22",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
    lineHeight: fontSize.xs * 1.4,
  },
  plansContainer: {
    gap: spacing["3"],
    marginBottom: spacing["5"],
  },
  planCard: {
    backgroundColor: "#1F2733",
    borderRadius: radius.lg,
    padding: spacing["4"],
    borderWidth: 1,
    borderColor: "#263242",
    position: "relative",
  },
  planCardActive: {
    borderColor: palette.warmAmber,
    backgroundColor: "#263242",
  },
  popularTag: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing["2"],
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  popularTagText: {
    fontFamily: fontFamily.bold,
    fontSize: 9,
    color: "#0A0D12",
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  planTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
  planPrice: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.warmAmber,
  },
  planSub: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
  },
  ctaBtn: {
    height: 52,
    backgroundColor: palette.warmAmber,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing["4"],
  },
  ctaBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: "#0A0D12",
  },
  promoSection: {
    marginBottom: spacing["5"],
    alignItems: "center",
  },
  promoToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    padding: spacing["2"],
  },
  promoToggleText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.warmAmber,
  },
  promoInputCard: {
    width: "100%",
    backgroundColor: "#1F2733",
    borderRadius: radius.lg,
    padding: spacing["4"],
    borderWidth: 1,
    borderColor: "#263242",
  },
  promoTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
    marginBottom: spacing["2"],
  },
  promoInputRow: {
    flexDirection: "row",
    gap: spacing["2"],
  },
  promoInput: {
    flex: 1,
    backgroundColor: "#161B22",
    borderRadius: radius.md,
    paddingHorizontal: spacing["3"],
    paddingVertical: spacing["2"],
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: "#263242",
  },
  redeemBtn: {
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing["4"],
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  redeemBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: "#0A0D12",
  },
  legalText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: palette.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
