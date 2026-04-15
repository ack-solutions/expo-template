// ─── Settings ─────────────────────────────────────────────────

/** App-wide notifications master switch for template apps. */
export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppSettings {
  notificationsEnabled: boolean;
  themeMode: ThemeMode;
}
