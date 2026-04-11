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
 * 2. Run: `npx expo install expo-application` (and ensure `react-native-safe-area-context` exists — default in Expo templates).
 * 3. Edit `config.ts` (title/message + store options).
 * 4. Wrap your root component with `AppUpdateProvider`.
 */

export type {
  AppUpdateConfig,
  AppUpdateConfigLoader,
  AppUpdateContextValue,
  PlatformUpdateRules,
  UpdateDecision,
  UpdateEvaluation,
  UpdateInfo,
} from './types';

export { APP_UPDATE_CONFIG, loadLocalAppUpdateConfig } from './config';
export { evaluateAppUpdate } from './app-update.service';
export { compareSemver, parseSemver, semverEqual } from './version-utils';
export type { ParsedSemver } from './version-utils';

export { AppUpdateProvider } from './app-update-provider';
export type { AppUpdateProviderProps } from './app-update-provider';

export { useAppUpdate, AppUpdateContext } from './use-app-update';

export { UpdateDialog } from './update-dialog';
export type { UpdateDialogProps } from './update-dialog';

export { ForceUpdateScreen } from './force-update-screen';
export type { ForceUpdateScreenProps } from './force-update-screen';
