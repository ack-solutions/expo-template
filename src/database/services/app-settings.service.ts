import { AppSettings } from '@/types';

import { AppSettingsRepository } from '../repositories/app-settings.repository';

const KEY_APP_SETTINGS = 'appSettings';

const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: false,
};

function parseStoredSettings(raw: string): AppSettings {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (typeof parsed.notificationsEnabled === 'boolean') {
      return { notificationsEnabled: parsed.notificationsEnabled };
    }

    // Legacy: flat { enabled, dayOfMonth, hour, minute }
    if (typeof parsed.enabled === 'boolean') {
      return { notificationsEnabled: parsed.enabled };
    }

    // Legacy: { reminderSettings: { enabled } }
    const rs = parsed.reminderSettings as { enabled?: boolean } | undefined;
    if (rs && typeof rs.enabled === 'boolean') {
      return { notificationsEnabled: rs.enabled };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function normalizeIncoming(settings: AppSettings | Record<string, unknown>): AppSettings {
  if (typeof (settings as AppSettings).notificationsEnabled === 'boolean') {
    return settings as AppSettings;
  }
  const legacy = settings as { reminderSettings?: { enabled?: boolean } };
  if (legacy.reminderSettings && typeof legacy.reminderSettings.enabled === 'boolean') {
    return { notificationsEnabled: legacy.reminderSettings.enabled };
  }
  return DEFAULT_SETTINGS;
}

export class AppSettingsService {
  static async getSettings(): Promise<AppSettings> {
    const raw = await AppSettingsRepository.getSetting(KEY_APP_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return parseStoredSettings(raw);
  }

  static async saveSettings(settings: AppSettings | Record<string, unknown>): Promise<void> {
    const now = new Date().toISOString();
    const normalized = normalizeIncoming(settings as AppSettings);
    await AppSettingsRepository.setSetting(KEY_APP_SETTINGS, JSON.stringify(normalized), now);
  }

  static async clearAll(): Promise<void> {
    await AppSettingsRepository.removeSetting(KEY_APP_SETTINGS);
  }
}
