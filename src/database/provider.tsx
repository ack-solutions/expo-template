import React, { PropsWithChildren, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from './client';
import migrations from './migrations/migrations';

export function DatabaseProvider({ children }: PropsWithChildren) {
  const { success, error } = useMigrations(db, migrations);

  const blockingError = useMemo(() => {
    if (error) return error;
    return null;
  }, [error]);

  if (blockingError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: '600' as const }}>
          Database error
        </Text>
        <Text style={{ color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
          {blockingError.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ color: Colors.textSecondary }}>Preparing database…</Text>
      </View>
    );
  }

  return <>{children}</>;
}

