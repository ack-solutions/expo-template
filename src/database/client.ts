import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

/** Must match `openDatabaseSync` name — used for backup import / `deleteDatabaseAsync`. */
export const DB_FILE_NAME = 'app_template.db';

// One shared connection for the whole app.
export const expoDb = openDatabaseSync(DB_FILE_NAME, { enableChangeListener: true });

export const db = drizzle(expoDb, { schema });

export type AppDb = typeof db;

