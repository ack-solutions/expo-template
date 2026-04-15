import { Appearance } from 'react-native';

// ─── Color Palette ─────────────────────────────────────────────

export const LightColors = {
  /** Logo / brand navy */
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  primaryDark: '#172554',
  primaryFaded: 'rgba(30, 58, 138, 0.08)',
  primaryFaded12: 'rgba(30, 58, 138, 0.12)',

  accent: '#F59E0B',
  accentLight: '#FCD34D',
  accentDark: '#D97706',

  success: '#10B981',
  successFaded: 'rgba(16, 185, 129, 0.10)',
  error: '#EF4444',
  errorFaded: 'rgba(239, 68, 68, 0.10)',
  warning: '#F59E0B',
  warningFaded: 'rgba(245, 158, 11, 0.10)',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  overlay: 'rgba(15, 23, 42, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.16)',

  gradientPrimary: ['#1E3A8A', '#2563EB'] as const,
  gradientSuccess: ['#10B981', '#059669'] as const,
  gradientWarm: ['#F59E0B', '#EF4444'] as const,
} as const;

export const DarkColors = {
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#1D4ED8',
  primaryFaded: 'rgba(96, 165, 250, 0.16)',
  primaryFaded12: 'rgba(96, 165, 250, 0.22)',

  accent: '#FBBF24',
  accentLight: '#FCD34D',
  accentDark: '#D97706',

  success: '#34D399',
  successFaded: 'rgba(52, 211, 153, 0.16)',
  error: '#F87171',
  errorFaded: 'rgba(248, 113, 113, 0.16)',
  warning: '#FBBF24',
  warningFaded: 'rgba(251, 191, 36, 0.16)',

  background: '#020617',
  surface: '#0F172A',
  surfaceElevated: '#111827',
  card: '#111827',
  border: '#1F2937',
  borderLight: '#334155',

  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#020617',

  overlay: 'rgba(2, 6, 23, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.45)',
  shadowDark: 'rgba(0, 0, 0, 0.6)',

  gradientPrimary: ['#1D4ED8', '#3B82F6'] as const,
  gradientSuccess: ['#059669', '#10B981'] as const,
  gradientWarm: ['#D97706', '#EF4444'] as const,
} as const;

export type AppColors = typeof LightColors;

/**
 * Backward-compatible static color object.
 * It resolves from the current system appearance at module load time.
 * Use `getThemeColors()` (or hooks that wrap it) for live light/dark reactive rendering.
 */
export const Colors = getThemeColors(Appearance.getColorScheme());

export function getThemeColors(
  scheme: 'light' | 'dark' | null | undefined,
): AppColors {
  return scheme === 'dark' ? DarkColors : LightColors;
}

// ─── Spacing (tightened for mobile) ────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 28,
  huge: 36,
  massive: 44,
} as const;

// ─── Radii ─────────────────────────────────────────────────────

export const Radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 22,
  pill: 999,
} as const;

// ─── Typography (slightly tighter) ─────────────────────────────

export const Typography = {
  hero: {
    fontSize: 30,
    fontWeight: '800' as const,
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  bodySemibold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 15,
  },
  smallMedium: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 15,
  },
  displayLarge: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
} as const;

// ─── Shadows ───────────────────────────────────────────────────

export const Shadows = {
  none: {
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
