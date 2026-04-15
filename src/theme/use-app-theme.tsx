import {
  Radii,
  Shadows,
  Spacing,
  Typography,
  getThemeColors,
} from '@/constants/theme';
import { AppSettingsService } from '@/database/services/app-settings.service';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  AppTheme,
  ThemeMode,
} from '@/theme/types';
import React, {
  PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState
} from 'react';

const AppThemeContext = createContext<AppTheme | undefined>(undefined);

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

  const resolvedColorScheme = useMemo(() => {
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

