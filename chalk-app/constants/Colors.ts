const tintColorLight = '#00D4AA'; // Mint/Teal accent
const tintColorDark = '#00D4AA';

export const colors = {
  bg: {
    base: '#0F1115',      // Very dark charcoal, almost black
    secondary: '#181B21', // Slightly lighter for cards/nav
    tertiary: '#232830',  // Inputs, borders
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#52525B',
  },
  accent: {
    default: '#00D4AA',   // Main brand color (Mint)
    muted: '#00D4AA30',   // Low opacity mint
    subtle: '#00D4AA10',  // Very low opacity mint
  },
  border: {
    default: '#27272A',
    light: '#3F3F46',
  },
  level: {
    high: '#22C55E', // Green
    mid: '#EAB308',  // Yellow
    low: '#EF4444',  // Red
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as '700' },
  h2: { fontSize: 22, fontWeight: '600' as '600' },
  h3: { fontSize: 18, fontWeight: '600' as '600' },
  body: { fontSize: 16, fontWeight: '400' as '400' },
  small: { fontSize: 14, fontWeight: '500' as '500' },
  caption: { fontSize: 12, fontWeight: '500' as '500' },
};

export const components = {
  button: {
    sm: 32,
    md: 44,
    lg: 52,
  },
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
