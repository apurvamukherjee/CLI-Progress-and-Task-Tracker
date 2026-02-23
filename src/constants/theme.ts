export const COLORS = {
  // Primary coral-red like the design reference
  primary: '#FF6B6B',
  primaryDark: '#E85555',
  primaryLight: '#FFE8E8',

  // Accent deep navy
  accent: '#1A1A2E',
  accentMid: '#16213E',

  // Semantic
  success: '#4ECDC4',
  successLight: '#E8F8F7',
  warning: '#FFD93D',
  warningLight: '#FFF8DC',
  danger: '#FF6B6B',

  // Priority
  priorityLow: '#4ECDC4',
  priorityMedium: '#FFD93D',
  priorityHigh: '#FF6B6B',

  // Neutrals
  white: '#FFFFFF',
  background: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F2F8',
  border: '#E8EAF0',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const TYPOGRAPHY = {
  displayLarge: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  displayMed: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 18, fontWeight: '600' as const },
  subheading: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyMed: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  captionBold: { fontSize: 12, fontWeight: '600' as const },
};

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  primary: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const CATEGORIES = ['Work', 'Personal', 'Health', 'Finance', 'Learning'];