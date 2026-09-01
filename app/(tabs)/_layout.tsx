import { radius, spacing } from "@core/theme/spacing";
import { fontFamily } from "@core/theme/typography";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import {
  Bookmark,
  Compass,
  Gamepad2,
  PlusCircle,
  User,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TAB_ICONS = {
  index: Compass,
  games: Gamepad2,
  create: PlusCircle,
  favorites: Bookmark,
  profile: User,
} as const;

function AnimatedTabItem({
  name,
  label,
  isFocused,
  onPress,
}: {
  name: keyof typeof TAB_ICONS;
  label: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const IconComponent = TAB_ICONS[name] ?? Compass;
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSequence(
        withSpring(1.18, { damping: 10, stiffness: 220 }),
        withSpring(1, { damping: 12, stiffness: 180 }),
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const activeColor = "#FFFFFF";
  const inactiveColor = "#8A93A6";

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.iconBox, animatedIconStyle]}>
        <IconComponent
          size={22}
          color={isFocused ? activeColor : inactiveColor}
          strokeWidth={isFocused ? 2.4 : 1.8}
        />
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          { color: isFocused ? activeColor : inactiveColor },
          isFocused && styles.tabLabelFocused,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function CustomAnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const numTabs = state.routes.length;
  const tabWidth = SCREEN_WIDTH / numTabs;

  const indicatorTranslateX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    indicatorTranslateX.value = withSpring(state.index * tabWidth, {
      damping: 20,
      stiffness: 170,
      mass: 0.8,
    });
  }, [state.index, tabWidth, indicatorTranslateX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorTranslateX.value }],
  }));

  return (
    <View
      style={[
        styles.tabBarWrapper,
        { paddingBottom: Math.max(insets.bottom, 4) },
      ]}
    >
      <View style={styles.tabBarContainer}>
        <Animated.View
          style={[
            styles.activeSpotlight,
            { width: tabWidth },
            animatedIndicatorStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.15)",
              "rgba(255, 255, 255, 0.04)",
              "rgba(255, 255, 255, 0.0)",
            ]}
            style={styles.spotlightGradient}
          />
          <View style={styles.topGlowLine} />
        </Animated.View>

        <View style={styles.tabButtonsRow}>
          {state.routes.map((route, index) => {
            const descriptor = descriptors[route.key];
            const options = descriptor?.options ?? {};
            const isFocused = state.index === index;

            const label =
              options.tabBarLabel !== undefined
                ? (options.tabBarLabel as string)
                : options.title !== undefined
                  ? options.title
                  : route.name === "index"
                    ? "Home"
                    : route.name === "games"
                      ? "Games"
                      : route.name === "create"
                        ? "Create"
                        : route.name === "favorites"
                          ? "Saved"
                          : "Profile";

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <AnimatedTabItem
                key={route.key}
                name={route.name as keyof typeof TAB_ICONS}
                label={label}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <CustomAnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home.title", "Home"),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: t("games.title", "Games"),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t("create.tab", "Create"),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("favorites.tab", "Saved"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile.tab", "Profile"),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: "#1F2733",
  },
  tabBarContainer: {
    backgroundColor: "#1F2733",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#263242",
    position: "relative",
    overflow: "hidden",
  },
  activeSpotlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    zIndex: 1,
  },
  spotlightGradient: {
    width: "100%",
    height: "100%",
  },
  topGlowLine: {
    position: "absolute",
    top: 0,
    width: 36,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: radius.full,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  tabButtonsRow: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    zIndex: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["2"],
    gap: 3,
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
  tabLabelFocused: {
    fontFamily: fontFamily.bold,
    color: "#FFFFFF",
  },
});
