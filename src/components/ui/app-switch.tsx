import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  View,
  ViewStyle,
} from 'react-native';

import { AppText } from './app-text';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppSwitchProps {
  /** Whether the switch is on. */
  value: boolean;
  /** Called when the switch is toggled. */
  onValueChange: (value: boolean) => void;
  /** Label displayed next to the switch. */
  label?: string;
  /** Secondary text shown below the label. */
  description?: string;
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Position of the switch relative to the label. Default: 'right' */
  switchSide?: 'left' | 'right';
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AppSwitch — labeled toggle switch wrapping the native Switch control.
 *
 * Tapping anywhere in the row toggles the switch.
 *
 * @example
 * <AppSwitch
 *   value={notificationsEnabled}
 *   onValueChange={setNotificationsEnabled}
 *   label="Push notifications"
 *   description="Receive alerts for new activity"
 * />
 */
export function AppSwitch({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  switchSide = 'right',
  style,
}: AppSwitchProps) {
  const { colors } = useAppTheme();
  const switchEl = (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: colors.border,
        true: colors.primaryLight
      }}
      thumbColor={Platform.OS === 'android' ? (value ? colors.primary : colors.surface) : undefined}
      ios_backgroundColor={colors.border}
    />
  );

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="switch"
      accessibilityState={{
        checked: value,
        disabled
      }}
    >
      {switchSide === 'left' && switchEl}

      {(label || description) && (
        <View style={styles.textBlock}>
          {label && (
            <AppText
              variant="bodyMedium"
              color={disabled ? 'tertiary' : 'primary'}
              style={styles.label}>
              {label}
            </AppText>
          )}
          {description && (
            <AppText
              variant="caption"
              color={disabled ? 'tertiary' : 'secondary'}
              style={styles.description}>
              {description}
            </AppText>
          )}
        </View>
      )}

      {switchSide === 'right' && switchEl}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xxs,
  },
  label: {
    ...Typography.bodyMedium,
  },
  description: {
    ...Typography.caption,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.45,
  },
});
