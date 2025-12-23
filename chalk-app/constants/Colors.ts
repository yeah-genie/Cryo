/**
 * Chalk Design System - Mobile Colors
 *
 * Unified with web design tokens for consistency.
 * Single source of truth: src/design-system/tokens.ts (web)
 */

// ===========================================
// BRAND COLORS
// ===========================================
const brand = {
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  primaryMuted: 'rgba(16, 185, 129, 0.15)',
  primaryGlow: 'rgba(16, 185, 129, 0.25)',
};

// ===========================================
// COLOR THEMES
// ===========================================
export default {
  light: {
    // Text hierarchy
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',

    // Background hierarchy
    background: '#FFFFFF',
    backgroundElevated: '#F9FAFB',
    backgroundSurface: '#F3F4F6',
    backgroundHover: '#E5E7EB',

    // Brand
    brand: brand.primary,
    brandLight: brand.primaryLight,
    brandDark: brand.primaryDark,
    brandMuted: 'rgba(16, 185, 129, 0.1)',

    // Tabs
    tabIconDefault: '#9CA3AF',
    tabIconSelected: brand.primary,

    // Borders
    border: '#E5E7EB',
    borderHover: '#D1D5DB',
    borderFocus: 'rgba(16, 185, 129, 0.5)',

    // Status
    success: '#22C55E',
    successMuted: 'rgba(34, 197, 94, 0.1)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.1)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',
    infoMuted: 'rgba(59, 130, 246, 0.1)',

    // Level indicators (for student progress)
    levelHigh: '#10B981',
    levelMid: '#3B82F6',
    levelLow: '#F59E0B',

    // Card
    cardBackground: '#FFFFFF',
    cardBorder: '#E5E7EB',

    // Gradient
    gradientStart: brand.primary,
    gradientEnd: brand.primaryLight,
  },

  dark: {
    // Text hierarchy (WCAG AA compliant)
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',

    // Background hierarchy
    background: '#09090B',
    backgroundElevated: '#111113',
    backgroundSurface: '#18181B',
    backgroundHover: '#1F1F23',

    // Brand
    brand: brand.primary,
    brandLight: brand.primaryLight,
    brandDark: brand.primaryDark,
    brandMuted: brand.primaryMuted,

    // Tabs
    tabIconDefault: '#71717A',
    tabIconSelected: brand.primary,

    // Borders
    border: 'rgba(255, 255, 255, 0.06)',
    borderHover: 'rgba(255, 255, 255, 0.12)',
    borderFocus: 'rgba(16, 185, 129, 0.5)',

    // Status
    success: '#22C55E',
    successMuted: 'rgba(34, 197, 94, 0.15)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoMuted: 'rgba(59, 130, 246, 0.15)',

    // Level indicators (for student progress)
    levelHigh: '#34D399',
    levelMid: '#60A5FA',
    levelLow: '#FBBF24',

    // Card (glass morphism)
    cardBackground: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',

    // Gradient
    gradientStart: brand.primary,
    gradientEnd: brand.primaryLight,

    // Glass effect
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },
};

// ===========================================
// SPACING (4px base unit)
// ===========================================
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ===========================================
// TYPOGRAPHY
// ===========================================
export const typography = {
  // Display
  display: {
    fontSize: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 48,
  },
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  // Body
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
  // Caption
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  // Label
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
} as const;

// ===========================================
// BORDER RADIUS
// ===========================================
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ===========================================
// SHADOWS (for React Native)
// ===========================================
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  glow: {
    shadowColor: brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// ===========================================
// COMPONENT SIZES
// ===========================================
export const componentSizes = {
  button: {
    sm: { height: 32, paddingHorizontal: 12, fontSize: 13 },
    md: { height: 40, paddingHorizontal: 16, fontSize: 14 },
    lg: { height: 48, paddingHorizontal: 24, fontSize: 15 },
  },
  input: {
    sm: { height: 32, paddingHorizontal: 10, fontSize: 13 },
    md: { height: 40, paddingHorizontal: 14, fontSize: 14 },
    lg: { height: 48, paddingHorizontal: 16, fontSize: 15 },
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  },
} as const;

// Type exports
export type ColorTheme = typeof import('./Colors').default.dark;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Radius = typeof radius;
