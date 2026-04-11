import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ForceUpdateScreenProps = {
  title: string;
  message: string;
  onUpdateNow: () => void | Promise<void>;
  onRetry?: () => void | Promise<void>;
  loading?: boolean;
  retryLoading?: boolean;
};

/**
 * Full-screen gate: user cannot reach app content until they update (parent should not render children).
 */
export function ForceUpdateScreen({
  title,
  message,
  onUpdateNow,
  onRetry,
  loading = false,
  retryLoading = false,
}: ForceUpdateScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void onUpdateNow();
          }}
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryLabel}>Update now</Text>
          )}
        </Pressable>
        {onRetry ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void onRetry();
            }}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            disabled={retryLoading}
          >
            {retryLoading ? (
              <ActivityIndicator color="#2563eb" />
            ) : (
              <Text style={styles.secondaryLabel}>Retry</Text>
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    color: '#0f172a',
  },
  message: {
    color: '#334155',
  },
  primary: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryLabel: {
    color: '#fff',
  },
  secondary: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryLabel: {
    color: '#2563eb',
  },
  pressed: {
    opacity: 0.88,
  },
});
