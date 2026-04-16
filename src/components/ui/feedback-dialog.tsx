import {
 Radii, Shadows, Spacing, Typography
} from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo } from 'react';
import {
 Modal, Pressable, StyleSheet, View
} from 'react-native';

import { AppText } from './app-text';
import { Button } from './button';

/** Semantic color of the feedback dialog. */
export type FeedbackColor = 'success' | 'error' | 'info' | 'warning';

/** @deprecated Use FeedbackColor instead. */
export type FeedbackVariant = FeedbackColor;

const DEFAULT_TITLES: Record<FeedbackColor, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Notice',
  warning: 'Attention',
};

const ICONS: Record<FeedbackColor, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'warning',
};

interface FeedbackDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  /** Semantic color. Default: 'info' */
  color?: FeedbackColor;
  confirmLabel?: string;
  onDismiss: () => void;
}

/**
 * FeedbackDialog — single-action modal for short user-facing feedback.
 *
 * @example
 * <FeedbackDialog
 *   visible={showFeedback}
 *   color="success"
 *   message="Your changes were saved."
 *   onDismiss={() => setShowFeedback(false)}
 * />
 */
export function FeedbackDialog({
  visible,
  title,
  message,
  color = 'info',
  confirmLabel = 'OK',
  onDismiss,
}: FeedbackDialogProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle(createStyles);

  const iconColors: Record<FeedbackColor, string> = useMemo(
    () => ({
      success: colors.success,
      error: colors.error,
      info: colors.primary,
      warning: colors.warning,
    }),
    [colors],
  );

  const resolvedTitle = title ?? DEFAULT_TITLES[color];

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
name={ICONS[color]}
size={40}
color={iconColors[color]} />
          </View>
          <AppText style={styles.title}>{resolvedTitle}</AppText>
          <AppText style={styles.message}>{message}</AppText>
          <Button
            title={confirmLabel}
            onPress={onDismiss}
            size="md"
            fullWidth
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = ({ colors }: AppTheme) =>
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
