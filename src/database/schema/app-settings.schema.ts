import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const appSettings = sqliteTable(
  'app_settings',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    value: text('value').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (t) => ({
    keyIdx: index('app_settings_key_idx').on(t.key),
  }),
);

