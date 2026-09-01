// Core color palette for VIBE
export const palette = {
  // Base backgrounds
  inkNavy: '#161B22',
  background: '#161B22',
  surface: '#1F2733',
  surfaceElevated: '#263242',
  surfaceLight: '#2D3748',

  // Primary & Accent tiers
  warmAmber: '#F2A93B',
  coralRose: '#EF6F6C',
  sageTeal: '#5FA88F',

  // Primary accent aliases
  primary: '#F2A93B',
  secondary: '#EF6F6C',
  tertiary: '#5FA88F',

  // Typography
  textPrimary: '#F5F1E8',
  textSecondary: '#8A93A6',
  textMuted: '#5C667A',

  // UI States & Legacy aliases
  white: '#F5F1E8',
  whiteAlpha90: 'rgba(245, 241, 232, 0.90)',
  whiteAlpha70: 'rgba(245, 241, 232, 0.70)',
  whiteAlpha50: 'rgba(245, 241, 232, 0.50)',
  whiteAlpha30: 'rgba(245, 241, 232, 0.30)',
  whiteAlpha15: 'rgba(245, 241, 232, 0.15)',
  whiteAlpha10: 'rgba(245, 241, 232, 0.10)',
  whiteAlpha08: 'rgba(245, 241, 232, 0.08)',
  black: '#0A0D12',
  blackAlpha70: 'rgba(10, 13, 18, 0.70)',
  blackAlpha50: 'rgba(10, 13, 18, 0.50)',
  blackAlpha30: 'rgba(10, 13, 18, 0.30)',

  // Borders & Dividers
  border: '#263242',
  borderLight: 'rgba(245, 241, 232, 0.06)',
  borderSubtle: 'rgba(245, 241, 232, 0.08)',
  borderFocus: '#F2A93B',

  // Status & semantic
  error: '#EF6F6C',
  success: '#5FA88F',
  warning: '#F2A93B',
  overlay: 'rgba(10, 13, 18, 0.75)',

  // Card surfaces
  card: '#1F2733',
  cardBorder: '#263242',
  inputBg: '#181F2A',

  // Legacy color aliases for backward compatibility without purple gradients
  purpleVibrant: '#F2A93B',
  purpleLight: '#F5BE6B',
  purpleDark: '#C8831E',
  pinkHot: '#EF6F6C',
  pinkLight: '#F59A98',
  amberGlow: '#F2A93B',
  amberLight: '#F8CE84',
  tealVibe: '#5FA88F',
  greenNeon: '#5FA88F',
  redPassion: '#EF6F6C',
  orangeEnergy: '#F2A93B',

  // Transparent
  transparent: 'transparent',
} as const;

export type PaletteColor = keyof typeof palette;

// Difficulty color mapping (Warm Amber for Mild, Sage Teal for Medium, Coral Rose for Spicy)
export const difficultyColors: Record<string, string> = {
  mild: '#F2A93B',
  medium: '#5FA88F',
  spicy: '#EF6F6C',
};

// Category accent colors (Distinguished by typography and subtle accent, not neon gradients)
export const categoryColors: Record<string, [string, string]> = {
  couples: ['#1F2733', '#2A1F26'],
  friends: ['#1F2733', '#1F2B2E'],
  best_friends: ['#1F2733', '#1F292B'],
  party: ['#1F2733', '#2B261D'],
  deep_talk: ['#1F2733', '#1C2430'],
  funny: ['#1F2733', '#2A241D'],
  would_you_rather: ['#1F2733', '#1D2A2B'],
  never_have_i_ever: ['#1F2733', '#2B1E22'],
  truth_or_dare: ['#1F2733', '#2A1E20'],
  who_knows_me_best: ['#1F2733', '#1E2829'],
  most_likely_to: ['#1F2733', '#212738'],
  date_night: ['#1F2733', '#2E1E24'],
  family: ['#1F2733', '#202A24'],
  ice_breakers: ['#1F2733', '#1E2930'],
  random: ['#1F2733', '#28231E'],
  custom: ['#1F2733', '#222933'],
};

// Category accent highlights for tags/borders
export const categoryAccentColors: Record<string, string> = {
  couples: '#EF6F6C',
  friends: '#5FA88F',
  best_friends: '#5FA88F',
  party: '#F2A93B',
  deep_talk: '#5FA88F',
  funny: '#F2A93B',
  would_you_rather: '#5FA88F',
  never_have_i_ever: '#EF6F6C',
  truth_or_dare: '#EF6F6C',
  who_knows_me_best: '#5FA88F',
  most_likely_to: '#F2A93B',
  date_night: '#EF6F6C',
  family: '#5FA88F',
  ice_breakers: '#5FA88F',
  random: '#F2A93B',
  custom: '#F2A93B',
};

