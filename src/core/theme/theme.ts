import { palette } from './colors';
import { fontFamily, fontSize } from './typography';
import { spacing, radius, shadow } from './spacing';

export const lightTheme = {
  dark: false,
  colors: {
    background: '#F5F5FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F8',
    primary: palette.purpleVibrant,
    primaryLight: palette.purpleLight,
    secondary: palette.pinkHot,
    accent: palette.amberGlow,
    text: '#0D0D1A',
    textSecondary: '#555570',
    textMuted: '#8888AA',
    textInverse: '#FFFFFF',
    border: '#E0E0F0',
    borderLight: '#F0F0FA',
    error: palette.redPassion,
    success: palette.greenNeon,
    warning: palette.amberGlow,
    cardBg: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E8E8F0',
    overlay: 'rgba(0,0,0,0.4)',
    coin: palette.amberGlow,
    premium: palette.purpleVibrant,
  },
} as const;

export const darkTheme = {
  dark: true,
  colors: {
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceElevated,
    primary: palette.warmAmber,
    primaryLight: palette.warmAmber,
    secondary: palette.coralRose,
    accent: palette.sageTeal,
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    textInverse: palette.background,
    border: palette.border,
    borderLight: palette.borderLight,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    cardBg: palette.surface,
    tabBar: palette.surface,
    tabBarBorder: palette.border,
    overlay: palette.overlay,
    coin: palette.warmAmber,
    premium: palette.warmAmber,
  },
} as const;

export type Theme = typeof darkTheme | typeof lightTheme;
export type ThemeColors = (typeof darkTheme)['colors'];

export { palette, fontFamily, fontSize, spacing, radius, shadow };
