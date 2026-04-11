/**
 * LOCAL app-update rules (no backend).
 *
 * WHAT TO CHANGE PER APP
 * ----------------------
 * - ios.storeUrl / android.storeUrl (optional): direct listing URLs.
 * - ios.appStoreId (optional): numeric App Store id (used if ios.storeUrl is missing).
 * - title / message: copy shown in the update dialog.
 *
 * SWITCHING TO REMOTE CONFIG LATER
 * --------------------------------
 * Keep this file as a fallback or delete it. In app-update.service.ts (or your app bootstrap),
 * pass a custom `loadConfig` to `evaluateAppUpdate` that `fetch()`es JSON from your API and returns
 * the same `AppUpdateConfig` shape. The provider already accepts `loadConfig` for that swap.
 *
 * COPYING THIS MODULE
 * -------------------
 * Copy the whole `app-update` folder, run `npx expo install expo-application`, wrap your root with
 * `AppUpdateProvider`, and render `UpdateDialog` + children as shown in `index.ts` usage comments.
 */

import type { AppUpdateConfig } from './types';

/**
 * Replace placeholder values before shipping.
 * Omitted platforms are ignored (no crash).
 */
export const APP_UPDATE_CONFIG: AppUpdateConfig = {
  ios: {
    appStoreId: '123456789',
    title: 'Update Available',
    message: 'A newer version of the app is available. Please update for the best experience.',
  },
  android: {
    // Optional. If omitted, Play URL is derived from Application.applicationId.
    // storeUrl: 'https://play.google.com/store/apps/details?id=com.example.app',
    title: 'Update Available',
    message: 'A newer version of the app is available. Please update for the best experience.',
  },
};

/** Default loader: resolves local static config (swap for remote in one place). */
export async function loadLocalAppUpdateConfig(): Promise<AppUpdateConfig | null> {
  try {
    return APP_UPDATE_CONFIG;
  } catch {
    return null;
  }
}
