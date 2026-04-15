// ─── Settings ─────────────────────────────────────────────────
import type { ThemeMode } from '@/theme/types';

/** App-wide notifications master switch for template apps. */
export type { ThemeMode };

export interface AppSettings {
  notificationsEnabled: boolean;
  themeMode: ThemeMode;
}
