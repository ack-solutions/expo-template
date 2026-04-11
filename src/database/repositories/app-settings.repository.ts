import { eq } from 'drizzle-orm';

import { db } from '../client';
import { appSettings } from '../schema/app-settings.schema';

export class AppSettingsRepository {
  static async getSetting(key: string): Promise<string | null> {
    const rows = await db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1);
    return rows[0]?.value ?? null;
  }

  static async setSetting(key: string, value: string, nowIso: string): Promise<void> {
    const existing = await db.select({ id: appSettings.id }).from(appSettings).where(eq(appSettings.key, key)).limit(1);
    const id = existing[0]?.id;

    if (id) {
      await db
        .update(appSettings)
        .set({ value, updatedAt: nowIso })
        .where(eq(appSettings.id, id));
      return;
    }

    await db.insert(appSettings).values({
      id: `${key}:${nowIso}`,
      key,
      value,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  static async removeSetting(key: string): Promise<void> {
    await db.delete(appSettings).where(eq(appSettings.key, key));
  }
}

