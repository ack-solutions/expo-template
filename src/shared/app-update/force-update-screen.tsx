import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import {
  AppColors,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';

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
  const styles = useThemedStyle((theme) => createStyles(theme.colors));

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.inner}>
        <AppText
          variant="h2"
          color="primary"
          style={styles.title}>
          {title}
        </AppText>
        <AppText
          variant="body"
          color="secondary"
          style={styles.message}>
          {message}
        </AppText>
        <Button
          title="Update now"
          onPress={() => {
            void onUpdateNow();
          }}
          loading={loading}
          fullWidth
        />
        {onRetry ? (
          <Button
            title="Retry"
            onPress={() => {
              void onRetry();
            }}
            variant="outline"
            fullWidth
            loading={retryLoading}
          />
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      paddingHorizontal: Spacing.xxxl,
      justifyContent: 'center',
      gap: Spacing.xl,
    },
    title: {
      ...Typography.h2,
    },
    message: {
      ...Typography.body,
    },
  });
