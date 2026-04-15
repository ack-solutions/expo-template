import * as Updates from 'expo-updates';

import type { EasOtaStrategy } from './update-strategy';

export type EasOtaRunResult =
  | { kind: 'skipped'; reason: string }
  | { kind: 'up_to_date' }
  | { kind: 'downloaded'; reloaded: boolean }
  | { kind: 'error'; message: string };

/**
 * EAS Update / expo-updates: fetch a newer JS bundle from Expo’s update server.
 * Does nothing in development, Expo Go, or when `expo-updates` is disabled for this build.
 */
export async function runEasOtaCheck(strategy: EasOtaStrategy): Promise<EasOtaRunResult> {
  if (!strategy.enabled || !strategy.checkOnLaunch) {
    return { kind: 'skipped', reason: 'disabled_in_config' };
  }

  if (__DEV__) {
    return { kind: 'skipped', reason: 'development_mode' };
  }

  if (!Updates.isEnabled) {
    return { kind: 'skipped', reason: 'updates_not_enabled' };
  }

  try {
    const check = await Updates.checkForUpdateAsync();
    if (!check.isAvailable) {
      return { kind: 'up_to_date' };
    }

    await Updates.fetchUpdateAsync();

    if (strategy.reloadImmediately) {
      await Updates.reloadAsync();
      return { kind: 'downloaded', reloaded: true };
    }

    return { kind: 'downloaded', reloaded: false };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'eas_ota_failed';
    return { kind: 'error', message };
  }
}
