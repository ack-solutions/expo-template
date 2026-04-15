import { installCrashlyticsGlobalHandlers } from '@/crashlytics';
import '@/sentry';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { DatabaseProvider } from '@/database';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppUpdateProvider } from '@/shared/app-update';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayout() {
  const colorScheme = useColorScheme();
  installCrashlyticsGlobalHandlers();

  return (
    <SafeAreaProvider>
      <AppUpdateProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <DatabaseProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style="dark" />
          </DatabaseProvider>
        </ThemeProvider>
      </AppUpdateProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
