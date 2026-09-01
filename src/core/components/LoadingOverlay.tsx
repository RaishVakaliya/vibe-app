import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { palette } from '@core/theme/colors';

interface LoadingOverlayProps {
  visible: boolean;
  color?: string;
}

export function LoadingOverlay({ visible, color = palette.purpleVibrant }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={color} />
        </View>
      </View>
    </Modal>
  );
}

interface InlineLoaderProps {
  color?: string;
  size?: 'small' | 'large';
}

export function InlineLoader({ color = palette.purpleVibrant, size = 'large' }: InlineLoaderProps) {
  return (
    <View style={styles.inline}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 28,
  },
  inline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
