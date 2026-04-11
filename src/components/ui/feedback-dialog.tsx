import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radii, Spacing, Typography, Shadows } from '@/constants/theme';
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

const ICON_COLORS: Record<FeedbackVariant, string> = {
  success: Colors.success,
  error: Colors.error,
  info: Colors.primary,
  warning: Colors.warning,
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
            <Ionicons name={ICONS[variant]} size={40} color={ICON_COLORS[variant]} />
          </View>
          <Text style={styles.title}>{resolvedTitle}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button title={confirmLabel} onPress={onDismiss} variant="primary" size="md" fullWidth />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  dialog: {
    backgroundColor: Colors.surface,
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
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
});
