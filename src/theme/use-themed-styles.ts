import {
  AppTheme,
} from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useMemo } from 'react';

/**
 * Reusable themed style creator.
 * Keeps style instances stable until theme tokens change.
 */
export function useThemedStyle<T>(createStyles: (theme: AppTheme) => T): T {
  const theme = useAppTheme();
  return useMemo(() => createStyles(theme), [createStyles, theme]);
}

