import { Platform } from 'react-native';

export const fontFamily = {
  // Display face for question text & screen titles (Bricolage Grotesque)
  display: Platform.select({ ios: 'BricolageGrotesque-Bold', android: 'BricolageGrotesque_700Bold', default: 'BricolageGrotesque_700Bold' }),
  displayBold: Platform.select({ ios: 'BricolageGrotesque-Bold', android: 'BricolageGrotesque_700Bold', default: 'BricolageGrotesque_700Bold' }),
  displayExtraBold: Platform.select({ ios: 'BricolageGrotesque-ExtraBold', android: 'BricolageGrotesque_800ExtraBold', default: 'BricolageGrotesque_800ExtraBold' }),

  // Body & UI face for buttons, labels, descriptions, form fields (Manrope)
  regular: Platform.select({ ios: 'Manrope-Regular', android: 'Manrope_400Regular', default: 'Manrope_400Regular' }),
  medium: Platform.select({ ios: 'Manrope-Medium', android: 'Manrope_500Medium', default: 'Manrope_500Medium' }),
  semiBold: Platform.select({ ios: 'Manrope-SemiBold', android: 'Manrope_600SemiBold', default: 'Manrope_600SemiBold' }),
  bold: Platform.select({ ios: 'Manrope-Bold', android: 'Manrope_700Bold', default: 'Manrope_700Bold' }),
  extraBold: Platform.select({ ios: 'Manrope-ExtraBold', android: 'Manrope_800ExtraBold', default: 'Manrope_800ExtraBold' }),
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  '2xl': 26,
  '3xl': 32,
  '4xl': 40,
  '5xl': 52,
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
  widest: 2.0,
} as const;

