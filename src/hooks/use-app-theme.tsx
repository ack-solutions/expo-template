import { AppSettingsService } from '@/database/services/app-settings.service';
import {
  Radii,
  Shadows,
  Spacing,
  Typography,
  getThemeColors,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeMode } from '@/types';
import React, {
  PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState
} from 'react';

type ResolvedScheme = 'light' | 'dark';

interface AppThemeContextValue {
  themeMode: ThemeMode;
  resolvedColorScheme: ResolvedScheme;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ReturnType<typeof getThemeColors>;
  spacing: typeof Spacing;
  typography: typeof Typography;
  radii: typeof Radii;
  shadows: typeof Shadows;
}

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const settings = await AppSettingsService.getSettings();
        if (isMounted) {
          setThemeModeState(settings.themeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const resolvedColorScheme: ResolvedScheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [systemColorScheme, themeMode]);
  const colors = useMemo(() => getThemeColors(resolvedColorScheme), [resolvedColorScheme]);

  const value = useMemo(
    () => ({
      themeMode,
      resolvedColorScheme,
      setThemeMode,
      colors,
      spacing: Spacing,
      typography: Typography,
      radii: Radii,
      shadows: Shadows,
    }),
    [
      themeMode,
      resolvedColorScheme,
      setThemeMode,
      colors,
    ],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }
  return context;
}
