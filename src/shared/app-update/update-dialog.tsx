import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { AppText, Button } from '@/components/ui';
import {
  AppColors,
  Radii,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';

export type UpdateDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  onLater: () => void;
  onUpdateNow: () => void | Promise<void>;
  loading?: boolean;
};

/**
 * Soft-update modal: non-blocking overlay; parent keeps rendering the app underneath.
 */
export function UpdateDialog({
  visible,
  title,
  message,
  onLater,
  onUpdateNow,
  loading = false,
}: UpdateDialogProps) {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onLater}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <AppText
variant="h3"
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
          <View style={styles.actions}>
            <Button
              title="Later"
              onPress={onLater}
              disabled={loading}
              variant="ghost"
            />
            <Button
              title="Update now"
              onPress={() => {
                void onUpdateNow();
              }}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      paddingHorizontal: Spacing.xxxl,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: Radii.xl,
      padding: Spacing.xxl,
      gap: Spacing.md,
    },
    title: {
      ...Typography.h3,
    },
    message: {
      ...Typography.body,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: Spacing.md,
      marginTop: Spacing.xs,
    },
  });
