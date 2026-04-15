import { AppColors, Radii, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './app-text';
import { Button } from './button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.dialog, Shadows.xl]} onPress={() => {}}>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.message}>{message}</AppText>
          <View style={styles.actions}>
            <Button
title={cancelLabel}
onPress={onCancel}
variant="ghost"
size="sm"
style={styles.actionBtn} />
            <Button
              title={confirmLabel}
              onPress={onConfirm}
              variant={variant}
              size="sm"
              style={styles.actionBtn}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xxl,
    },
    dialog: {
      backgroundColor: colors.surface,
      borderRadius: Radii.xl,
      padding: Spacing.xxl,
      width: '100%',
      maxWidth: 340,
    },
    title: {
      ...Typography.h3,
      color: colors.textPrimary,
      marginBottom: Spacing.sm,
    },
    message: {
      ...Typography.caption,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: Spacing.xxl,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    actionBtn: {
      minWidth: 120,
    },
  });
