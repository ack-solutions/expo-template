import {
  AppColors,
  Radii,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedScheme = 'light' | 'dark';

export interface AppTheme {
  themeMode: ThemeMode;
  resolvedColorScheme: ResolvedScheme;
  setThemeMode: (mode: ThemeMode) => void;
  colors: AppColors;
  spacing: typeof Spacing;
  typography: typeof Typography;
  radii: typeof Radii;
  shadows: typeof Shadows;
}

export type AppThemeColors = AppTheme['colors'];

