import { Colors, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { Platform, Pressable, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';

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
  const switchEl = (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
      thumbColor={Platform.OS === 'android' ? (value ? Colors.primary : Colors.surface) : undefined}
      ios_backgroundColor={Colors.border}
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
      accessibilityState={{ checked: value, disabled }}
    >
      {switchSide === 'left' && switchEl}

      {(label || description) && (
        <View style={styles.textBlock}>
          {label && (
            <Text style={[styles.label, disabled && styles.textDisabled]}>{label}</Text>
          )}
          {description && (
            <Text style={[styles.description, disabled && styles.textDisabled]}>{description}</Text>
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
    color: Colors.textPrimary,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.45,
  },
  textDisabled: {
    color: Colors.textTertiary,
  },
});
