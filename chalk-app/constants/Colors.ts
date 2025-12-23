/**
 * Chalk App - Noir Academy Design System
 * Dark-first, neon accent 테마
 */

// ===========================================
// BRAND COLORS
// ===========================================
const brand = {
  primary: '#FF6B35', // Neon Orange
  secondary: '#00F5D4', // Neon Mint
  accent: '#A855F7', // Electric Purple (AI)
  textLight: '#F0EDE5', // Chalk cream white
};

// ===========================================
// SPACING
// ===========================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ===========================================
// TYPOGRAPHY
// ===========================================
export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  number: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
};

// ===========================================
// BORDER RADIUS
// ===========================================
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// ===========================================
// SHADOWS
// ===========================================
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }),
};

// ===========================================
// COMPONENT SIZES
// ===========================================
export const componentSizes = {
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  inputHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  },
};

// ===========================================
// COLOR THEMES
// ===========================================
const Colors = {
  light: {
    // Text hierarchy (WCAG AA compliant)
    text: '#1A1A1A',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',

    // Background hierarchy
    background: '#FAFAFA',
    backgroundElevated: '#FFFFFF',
    backgroundSurface: '#F4F4F5',
    backgroundHover: '#E4E4E7',
    backgroundTertiary: 'rgba(0, 0, 0, 0.03)',

    // Brand colors
    tint: brand.primary,
    tintSecondary: '#00D4B4', // 라이트용 민트 (약간 어둡게)
    tintAccent: brand.accent,
    brandMuted: 'rgba(255, 107, 53, 0.1)',
    brandSecondaryMuted: 'rgba(0, 212, 180, 0.1)',
    brandAccentMuted: 'rgba(168, 85, 247, 0.1)',

    // Tabs
    tabIconDefault: '#A1A1AA',
    tabIconSelected: brand.primary,

    // Borders
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.15)',
    borderFocus: brand.primary,

    // Status
    success: '#00D4B4',
    successMuted: 'rgba(0, 212, 180, 0.1)',
    warning: '#FF6B35',
    warningMuted: 'rgba(255, 107, 53, 0.1)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',
    infoMuted: 'rgba(59, 130, 246, 0.1)',

    // Level indicators
    levelHigh: '#00D4B4',
    levelMid: '#FF6B35',
    levelLow: '#F59E0B',

    // Card
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(0, 0, 0, 0.06)',

    // Gradient
    gradientStart: brand.primary,
    gradientEnd: '#00D4B4',

    // Glass effect
    glassBackground: 'rgba(255, 255, 255, 0.6)',
    glassBorder: 'rgba(0, 0, 0, 0.05)',
  },

  dark: {
    // Text hierarchy (WCAG AA compliant)
    text: brand.textLight,
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',

    // Background hierarchy
    background: '#0D1117',
    backgroundElevated: '#161B22',
    backgroundSurface: '#1F242A',
    backgroundHover: '#2D333B',
    backgroundTertiary: 'rgba(255, 255, 255, 0.04)',

    // Brand colors
    tint: brand.primary,
    tintSecondary: brand.secondary,
    tintAccent: brand.accent,
    brandMuted: 'rgba(255, 107, 53, 0.15)',
    brandSecondaryMuted: 'rgba(0, 245, 212, 0.15)',
    brandAccentMuted: 'rgba(168, 85, 247, 0.15)',

    // Tabs
    tabIconDefault: '#71717A',
    tabIconSelected: brand.primary,

    // Borders
    border: 'rgba(255, 255, 255, 0.06)',
    borderHover: 'rgba(255, 255, 255, 0.12)',
    borderFocus: brand.primary,

    // Status
    success: brand.secondary,
    successMuted: 'rgba(0, 245, 212, 0.15)',
    warning: brand.primary,
    warningMuted: 'rgba(255, 107, 53, 0.15)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.15)',
    info: '#60A5FA',
    infoMuted: 'rgba(96, 165, 250, 0.15)',

    // Level indicators
    levelHigh: brand.secondary,
    levelMid: brand.primary,
    levelLow: '#FBBF24',

    // Card
    cardBackground: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',

    // Gradient
    gradientStart: brand.primary,
    gradientEnd: brand.secondary,

    // Glass effect
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },
};

export default Colors;
