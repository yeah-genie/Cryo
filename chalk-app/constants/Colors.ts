// Chalk 디자인 시스템 - Indigo/Violet 테마 (Web Portfolio 스타일)
// 핵심: 전문적이고 신뢰감 있는 인디고/바이올렛 컬러

export const FORCE_DARK_MODE = true;

// ============================================
// 색상 시스템 (Indigo/Violet)
// ============================================
export const colors = {
  // 배경 계층
  bg: {
    base: '#020617',      // slate-950
    secondary: '#0F172A', // slate-900
    tertiary: '#1E293B',  // slate-800
    elevated: '#334155',  // slate-700
  },

  // 텍스트
  text: {
    primary: '#F8FAFC',   // slate-50
    secondary: '#94A3B8', // slate-400
    muted: '#64748B',     // slate-500
    disabled: '#475569',  // slate-600
  },

  // 보더
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.12)',
  },

  // 액센트 (Indigo - 메인 CTA)
  accent: {
    default: '#6366F1',   // indigo-500
    hover: '#818CF8',     // indigo-400
    muted: 'rgba(99, 102, 241, 0.15)',
    subtle: 'rgba(99, 102, 241, 0.08)',
  },

  // 세컨더리 (Violet - 그라디언트용)
  secondary: {
    default: '#8B5CF6',   // violet-500
    hover: '#A78BFA',     // violet-400
    muted: 'rgba(139, 92, 246, 0.15)',
  },

  // 상태 색상
  status: {
    success: '#22C55E',   // green-500
    warning: '#F59E0B',   // amber-500
    error: '#EF4444',     // red-500
    info: '#3B82F6',      // blue-500
  },

  // 레벨/배지 색상
  level: {
    high: '#22C55E',      // green - Excellent
    mid: '#3B82F6',       // blue - Good
    low: '#F59E0B',       // amber - Needs work
  },

  // 배지 색상
  badge: {
    yellow: '#EAB308',    // Quick Response
    emerald: '#10B981',   // Consistent
    blue: '#3B82F6',      // Detailed
  },
};

// ============================================
// 그라디언트
// ============================================
export const gradients = {
  primary: ['#6366F1', '#8B5CF6'], // indigo -> violet
  hero: ['#4F46E5', '#7C3AED'],    // indigo-600 -> violet-600
  success: ['#22C55E', '#10B981'],
};

// ============================================
// 타이포그래피 (더 큰 사이즈로 업데이트)
// ============================================
export const typography = {
  // 페이지 제목
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  // 섹션 제목
  h2: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  // 카드 제목
  h3: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  // 본문
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  // 작은 본문
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
  // 캡션
  caption: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  // 아주 작은 텍스트
  micro: {
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    lineHeight: 12,
  },
  // 큰 숫자 (통계)
  stat: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
};

// ============================================
// 스페이싱 (모바일 최적화)
// ============================================
export const spacing = {
  px: 1,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

// ============================================
// 반지름
// ============================================
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// ============================================
// 그림자
// ============================================
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  xl: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
};

// ============================================
// 애니메이션 타이밍
// ============================================
export const animation = {
  fast: 100,
  normal: 200,
  slow: 300,
};

// ============================================
// 컴포넌트 사이즈
// ============================================
export const components = {
  button: {
    sm: 32,
    md: 40,
    lg: 48,
  },
  input: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
  icon: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
  },
};

// ============================================
// 레거시 호환
// ============================================
export default {
  light: {
    text: colors.text.primary,
    background: '#FFFFFF',
    tint: colors.accent.default,
  },
  dark: {
    text: colors.text.primary,
    background: colors.bg.base,
    tint: colors.accent.default,
  },
};
