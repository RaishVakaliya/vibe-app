import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '📭', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['8'],
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing['4'],
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['xl'],
    color: palette.white,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: palette.whiteAlpha70,
    textAlign: 'center',
    lineHeight: fontSize.base * 1.5,
    marginBottom: spacing['6'],
  },
  button: {
    backgroundColor: palette.purpleVibrant,
    paddingHorizontal: spacing['6'],
    paddingVertical: spacing['3'],
    borderRadius: radius.full,
  },
  buttonLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.base,
    color: palette.white,
  },
});
