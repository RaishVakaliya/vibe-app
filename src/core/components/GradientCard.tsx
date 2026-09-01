import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientCardProps {
  colors: [string, string, ...string[]];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  borderRadius?: number;
}

export function GradientCard({
  colors,
  children,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  borderRadius = 20,
}: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.card, { borderRadius }, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
