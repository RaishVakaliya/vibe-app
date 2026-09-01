import { palette } from "@core/theme/colors";
import { radius, spacing } from "@core/theme/spacing";
import { fontFamily, fontSize } from "@core/theme/typography";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlide {
  icon: string;
  title: string;
  description: string;
  gradient: [string, string];
}

const SLIDES: OnboardingSlide[] = [
  {
    icon: "🎮",
    title: "Play Together, Anywhere",
    description:
      "Fun questions, games and challenges designed for couples, friends and families.",
    gradient: ["#7C3AED", "#EC4899"],
  },
  {
    icon: "💬",
    title: "Thousands of Questions",
    description:
      "Deep talks, party games, truth or dare, and more — in 15 languages.",
    gradient: ["#06B6D4", "#7C3AED"],
  },
  {
    icon: "🌐",
    title: "Multiplayer Rooms",
    description:
      "Create a room and play in real-time with friends across the world.",
    gradient: ["#EC4899", "#F59E0B"],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);
  const iconBounce = useSharedValue(0);
  const slide = SLIDES[currentSlide];

  useEffect(() => {
    iconBounce.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 800 }),
        withTiming(0, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, [iconBounce]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconBounce.value }],
  }));

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const isLast = currentSlide === SLIDES.length - 1;
  const gradient = slide?.gradient ?? ["#7C3AED", "#EC4899"];
  const colors: [string, string, ...string[]] = [
    gradient[0],
    gradient[1],
    "#0D0D1A",
  ];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={onComplete}
        accessibilityLabel="Skip onboarding"
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.brandRow}>
        <Text style={styles.brandName}>VIBE</Text>
        <Text style={styles.brandTag}>Questions • Games • Challenges</Text>
      </View>

      <Animated.Text style={[styles.slideIcon, iconStyle]}>
        {slide?.icon ?? "🎮"}
      </Animated.Text>

      <Animated.View
        key={currentSlide}
        entering={FadeInUp.duration(400)}
        style={styles.content}
      >
        <Text style={styles.slideTitle}>{slide?.title ?? ""}</Text>
        <Text style={styles.slideDesc}>{slide?.description ?? ""}</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentSlide && styles.dotActive]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={handleNext}
        activeOpacity={0.85}
        accessibilityLabel={isLast ? "Get Started" : "Next"}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={[palette.purpleVibrant, palette.pinkHot]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>
            {isLast ? "🚀 Get Started" : "Next →"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing["6"],
  },
  skipBtn: {
    alignSelf: "flex-end",
    padding: spacing["3"],
    marginTop: spacing["2"],
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.whiteAlpha70,
  },
  brandRow: {
    alignItems: "center",
    marginTop: spacing["4"],
    marginBottom: spacing["10"],
  },
  brandName: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize["4xl"],
    color: palette.white,
    letterSpacing: 8,
  },
  brandTag: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: palette.whiteAlpha70,
    letterSpacing: 1,
    marginTop: spacing["1"],
  },
  slideIcon: {
    fontSize: 96,
    marginBottom: spacing["8"],
  },
  content: {
    alignItems: "center",
    paddingHorizontal: spacing["4"],
    flex: 1,
    justifyContent: "center",
  },
  slideTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize["3xl"],
    color: palette.white,
    textAlign: "center",
    marginBottom: spacing["4"],
    lineHeight: fontSize["3xl"] * 1.2,
  },
  slideDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: palette.whiteAlpha70,
    textAlign: "center",
    lineHeight: fontSize.md * 1.6,
  },
  dotsRow: {
    flexDirection: "row",
    gap: spacing["2"],
    marginBottom: spacing["6"],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.whiteAlpha30,
  },
  dotActive: {
    width: 24,
    backgroundColor: palette.white,
  },
  cta: {
    width: SCREEN_WIDTH - spacing["8"] * 2,
    height: 56,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing["4"],
  },
  ctaGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: palette.white,
  },
});
