/**
 * Central switches for update behavior. Edit here instead of scattering flags.
 *
 * - **EAS OTA** — JavaScript/assets from EAS Update (`eas update`). Same native binary.
 * - **Store prompt** — Compares App Store / Play listing version to `expo.application.nativeVersion`
 *   and shows a dialog to open the store (new native build required).
 */

export type EasOtaStrategy = {
  /** Master switch for expo-updates checks from JS (`runEasOtaCheck`). */
  enabled: boolean;
  /** Call `checkForUpdateAsync` / `fetchUpdateAsync` once after app load. */
  checkOnLaunch: boolean;
  /** After a successful download, call `reloadAsync()` so the new bundle runs immediately. */
  reloadImmediately: boolean;
};

export type StoreVersionPromptStrategy = {
  /** Master switch for store scraping + optional dialog (see `evaluateAppUpdate`). */
  enabled: boolean;
};

export type UpdateStrategy = {
  easOta: EasOtaStrategy;
  storeVersionPrompt: StoreVersionPromptStrategy;
};

/**
 * Defaults: OTA on launch in release builds; store-version soft prompt enabled.
 * Pair with `app.json` → `updates.checkAutomatically`: use `NEVER` if you rely only on
 * `easOta.checkOnLaunch` to avoid duplicate network checks (see docs/UPDATES.md).
 */
export const UPDATE_STRATEGY: UpdateStrategy = {
  easOta: {
    enabled: true,
    checkOnLaunch: true,
    reloadImmediately: true,
  },
  storeVersionPrompt: {
    enabled: true,
  },
};
