import { Colors, Spacing, Typography } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Controls what accessory is shown on the trailing edge of the row. */
export type ListItemAccessory = 'arrow' | 'none';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ListItemProps {
  /** Primary text. */
  title: string;
  /** Secondary text shown below the title. */
  subtitle?: string;
  /** Node rendered before the title (icon, avatar, etc.). */
  left?: React.ReactNode;
  /** Node rendered after the title (badge, custom button, etc.). Overrides accessory. */
  right?: React.ReactNode;
  /** Trailing accessory type. Default: 'none' */
  accessory?: ListItemAccessory;
  /** Makes the row tappable. */
  onPress?: () => void;
  /** Show a hairline divider at the bottom. Default: false */
  showDivider?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ListItem — standard list row with optional icon, subtitle, and accessory.
 *
 * @example
 * // Navigable setting row
 * <ListItem
 *   title="Account"
 *   subtitle="Manage your profile"
 *   left={<Ionicons name="person-circle-outline" size={22} color={Colors.primary} />}
 *   accessory="arrow"
 *   onPress={() => router.push('/account')}
 *   showDivider
 * />
 *
 * // Static info row with custom right slot
 * <ListItem
 *   title="Version"
 *   right={<Badge label="1.0.0" variant="neutral" size="sm" />}
 * />
 */
export function ListItem({
  title,
  subtitle,
  left,
  right,
  accessory = 'none',
  onPress,
  showDivider = false,
  disabled = false,
  style,
}: ListItemProps) {
  const content = (
    <View style={[styles.row, showDivider && styles.rowDivider]}>
      {left && <View style={styles.leftSlot}>{left}</View>}

      <View style={styles.center}>
        <Text style={[styles.title, disabled && styles.textDisabled]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, disabled && styles.textDisabled]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSlot}>
        {right ?? (
          accessory === 'arrow' && (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textTertiary}
            />
          )
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.container,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, disabled && styles.disabled, style]}>
      {content}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
    gap: Spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  leftSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  center: {
    flex: 1,
    gap: Spacing.xxs,
  },
  rightSlot: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pressed: {
    backgroundColor: Colors.borderLight,
  },
  disabled: {
    opacity: 0.45,
  },
  textDisabled: {
    color: Colors.textTertiary,
  },
});
