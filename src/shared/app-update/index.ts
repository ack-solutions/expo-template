/**
 * App update feature — portable Expo module.
 *
 * ----------------------------------------------------------------------------
 * EXAMPLE: wrap root (e.g. app/_layout.tsx)
 * ----------------------------------------------------------------------------
 *
 * import { AppUpdateProvider } from '@/shared/app-update';
 *
 * export default function RootLayout() {
 *   return (
 *     <AppUpdateProvider>
 *       <YourExistingTree />
 *     </AppUpdateProvider>
 *   );
 * }
 *
 * `UpdateDialog` is rendered by the provider when needed (no extra JSX).
 *
 * Optional: read state anywhere (e.g. show a banner when `lastError` is set):
 *
 * import { useAppUpdate } from '@/shared/app-update';
 *
 * function DebugBanner() {
 *   const { lastError, isChecking } = useAppUpdate();
 *   ...
 * }
 *
 * ----------------------------------------------------------------------------
 * Remote config later
 * ----------------------------------------------------------------------------
 *
 * Pass `loadConfig` to the provider:
 *
 * <AppUpdateProvider
 *   loadConfig={async () => {
 *     // return config from your API in AppUpdateConfig shape
 *     return null;
 *   }}
 * />
 *
 * Keep the same JSON shape as `APP_UPDATE_CONFIG` in config.ts. Return null on failure
 * so the app treats it as “no update” and does not crash.
 *
 * ----------------------------------------------------------------------------
 * Copy into another Expo app
 * ----------------------------------------------------------------------------
 *
 * 1. Copy the entire `src/shared/app-update` folder.
 * 2. Run: `npx expo install expo-application expo-updates` (and `react-native-safe-area-context` — default in Expo templates).
 * 3. Edit `update-strategy.ts` (EAS OTA + store prompt) and `config.ts` (store dialog copy / IDs).
 * 4. Wrap your root component with `AppUpdateProvider`.
 * 5. Read `docs/UPDATES.md` for `eas update` and runtimeVersion.
 */

export * from './app-update-provider';
export * from './app-update.service';
export * from './config';
export * from './eas-ota';
export * from './force-update-screen';
export * from './types';
export * from './update-dialog';
export * from './update-strategy';
export * from './use-app-update';
export * from './version-utils';

