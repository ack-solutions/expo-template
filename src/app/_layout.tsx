import { installCrashlyticsGlobalHandlers } from '@/crashlytics';
import '@/sentry';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getThemeColors } from '@/constants/theme';
import { DatabaseProvider } from '@/database';
import { AppThemeProvider, useAppTheme } from '@/hooks/use-app-theme';
import { AppUpdateProvider } from '@/shared/app-update';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayout() {
  installCrashlyticsGlobalHandlers();

  return (
    <SafeAreaProvider>
      <AppUpdateProvider>
        <DatabaseProvider>
          <AppThemeProvider>
            <AppShell />
          </AppThemeProvider>
        </DatabaseProvider>
      </AppUpdateProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { resolvedColorScheme } = useAppTheme();
  const colors = getThemeColors(resolvedColorScheme);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const applyNavigationBarTheme = async () => {
      const buttonStyle = resolvedColorScheme === 'dark' ? 'light' : 'dark';

      // Use relative position so the system bar is not overlaid by app modals.
      await NavigationBar.setPositionAsync('relative');
      await NavigationBar.setBackgroundColorAsync(colors.surface);
      await NavigationBar.setButtonStyleAsync(buttonStyle);
    };

    void applyNavigationBarTheme();
  }, [colors.surface, resolvedColorScheme]);

  return (
    <ThemeProvider value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={resolvedColorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
