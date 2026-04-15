import { AppSettings } from '@/types';

import { AppSettingsRepository } from '../repositories/app-settings.repository';

const KEY_APP_SETTINGS = 'appSettings';

const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: false,
  themeMode: 'system',
};

function parseStoredSettings(raw: string): AppSettings {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const parsedThemeMode = parsed.themeMode === 'light' || parsed.themeMode === 'dark' || parsed.themeMode === 'system'
        ? parsed.themeMode
        : DEFAULT_SETTINGS.themeMode;

    if (typeof parsed.notificationsEnabled === 'boolean') {
      return {
        notificationsEnabled: parsed.notificationsEnabled,
        themeMode: parsedThemeMode,
      };
    }

    // Legacy: flat { enabled, dayOfMonth, hour, minute }
    if (typeof parsed.enabled === 'boolean') {
      return {
        notificationsEnabled: parsed.enabled,
        themeMode: parsedThemeMode,
      };
    }

    // Legacy: { reminderSettings: { enabled } }
    const rs = parsed.reminderSettings as { enabled?: boolean } | undefined;
    if (rs && typeof rs.enabled === 'boolean') {
      return {
        notificationsEnabled: rs.enabled,
        themeMode: parsedThemeMode,
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function normalizeIncoming(settings: AppSettings | Record<string, unknown>): AppSettings {
  if (typeof (settings as AppSettings).notificationsEnabled === 'boolean') {
    const typedSettings = settings as Partial<AppSettings>;
    return {
      notificationsEnabled: typedSettings.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
      themeMode:
        typedSettings.themeMode === 'light' || typedSettings.themeMode === 'dark' || typedSettings.themeMode === 'system'
          ? typedSettings.themeMode
          : DEFAULT_SETTINGS.themeMode,
    };
  }
  const legacy = settings as { reminderSettings?: { enabled?: boolean } };
  if (legacy.reminderSettings && typeof legacy.reminderSettings.enabled === 'boolean') {
    return {
      notificationsEnabled: legacy.reminderSettings.enabled,
      themeMode: DEFAULT_SETTINGS.themeMode,
    };
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
