/**
 * Shared types for the app-update feature. Kept generic so the module stays portable.
 */

export type PlatformUpdateRules = {
  /**
   * Optional explicit listing URL. If omitted, provider can derive:
   * - Android from `Application.applicationId`
   * - iOS from `appStoreId` below
   */
  storeUrl?: string;
  /** Optional iOS App Store numeric id (used to derive URL if storeUrl is missing). */
  appStoreId?: string;
  title: string;
  message: string;
};

/** Keys match React Native Platform.OS for native builds. */
export type AppUpdateConfig = {
  ios?: PlatformUpdateRules;
  android?: PlatformUpdateRules;
};

export type UpdateDecision = 'none' | 'soft';

export type UpdateInfo = {
  decision: 'soft';
  title: string;
  message: string;
  storeUrl?: string;
  appStoreId?: string;
  latestVersion: string;
};

export type UpdateEvaluation = {
  decision: UpdateDecision;
  info: UpdateInfo | null;
  /** Non-fatal context when decision is "none" (debugging / support). */
  skipReason?: string;
};

/** Async loader so local config today can become a remote fetch tomorrow without changing consumers. */
export type AppUpdateConfigLoader = () => Promise<AppUpdateConfig | null>;

/** Result of the EAS Update / expo-updates pass (JS bundle OTA). */
export type AppUpdateOtaState = {
  status: 'idle' | 'checking' | 'up_to_date' | 'downloaded' | 'skipped' | 'error';
  skipReason: string | null;
  error: string | null;
};

export type AppUpdateContextValue = {
  isChecking: boolean;
  lastError: string | null;
  updateInfo: UpdateInfo | null;
  isForceUpdate: boolean;
  isSoftUpdate: boolean;
  isOpeningStore: boolean;
  openStore: () => Promise<void>;
  recheck: () => Promise<void>;
  /** EAS Update (expo-updates) status for the current session. */
  ota: AppUpdateOtaState;
};
