import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo } from 'react';
import {
 Modal, Pressable, StyleSheet, Text, View 
} from 'react-native';
import {
 AppColors, Radii, Shadows, Spacing, Typography 
} from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import { Button } from './button';

export type FeedbackVariant = 'success' | 'error' | 'info' | 'warning';

const TITLES: Record<FeedbackVariant, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Notice',
  warning: 'Attention',
};

const ICONS: Record<FeedbackVariant, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'warning',
};

interface FeedbackDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  variant?: FeedbackVariant;
  confirmLabel?: string;
  onDismiss: () => void;
}

/** Single-action modal for short feedback (replaces transient toasts). */
export function FeedbackDialog({
  visible,
  title,
  message,
  variant = 'info',
  confirmLabel = 'OK',
  onDismiss,
}: FeedbackDialogProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  const iconColors: Record<FeedbackVariant, string> = useMemo(
    () => ({
      success: colors.success,
      error: colors.error,
      info: colors.primary,
      warning: colors.warning,
    }),
    [colors],
  );
  const resolvedTitle = title ?? TITLES[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.dialog, Shadows.xl]} onPress={() => {}}>
          <View style={styles.iconWrap}>
            <Ionicons
name={ICONS[variant]}
size={40}
color={iconColors[variant]} />
          </View>
          <Text style={styles.title}>{resolvedTitle}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button
title={confirmLabel}
onPress={onDismiss}
variant="primary"
size="md"
fullWidth />
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
    iconWrap: {
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      ...Typography.h3,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    message: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xxl,
    },
  });
