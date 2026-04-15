import { Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Pressable, StyleSheet, View, ViewStyle
} from 'react-native';

import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Controls what accessory is shown on the trailing edge of the row. */
export type ListItemAccessory = 'arrow' | 'none';
type ListItemTone = 'default' | 'danger';

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
  tone?: ListItemTone;
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
  tone = 'default',
  disabled = false,
  style,
}: ListItemProps) {
  const { colors } = useAppTheme();
  const content = (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.borderLight },
        showDivider && styles.rowDivider,
      ]}>
      {left && <View style={styles.leftSlot}>{left}</View>}

      <View style={styles.center}>
        <AppText
          variant="bodyMedium"
          style={[
            styles.title,
            { color: colors.textPrimary },
            tone === 'danger' && styles.titleDanger,
            tone === 'danger' && { color: colors.error },
            disabled && styles.textDisabled
            ,
            disabled && { color: colors.textTertiary },
          ]}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {subtitle && (
          <AppText
            variant="caption"
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
              disabled && styles.textDisabled,
              disabled && { color: colors.textTertiary },
            ]}
            numberOfLines={2}>
            {subtitle}
          </AppText>
        )}
      </View>

      <View style={styles.rightSlot}>
        {right ?? (
          accessory === 'arrow' && (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textTertiary}
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
          { backgroundColor: colors.surface },
          pressed && !disabled && styles.pressed,
          pressed && !disabled && { backgroundColor: colors.borderLight },
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
    <View style={[
      styles.container,
      { backgroundColor: colors.surface },
      disabled && styles.disabled,
      style
    ]}>
      {content}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
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
  },
  titleDanger: {
  },
  subtitle: {
    ...Typography.caption,
  },
  pressed: {},
  disabled: {
    opacity: 0.45,
  },
  textDisabled: {},
});
