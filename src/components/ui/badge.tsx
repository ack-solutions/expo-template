import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  /** Visual style. Default: 'neutral' */
  variant?: BadgeVariant;
  /** Size. Default: 'md' */
  size?: BadgeSize;
  /** Show pill (dot) instead of text label. Default: false */
  dot?: boolean;
  style?: ViewStyle;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantBg: Record<BadgeVariant, string> = {
  primary: Colors.primaryFaded12,
  success: Colors.successFaded,
  error: Colors.errorFaded,
  warning: Colors.warningFaded,
  neutral: Colors.borderLight,
};

const variantText: Record<BadgeVariant, string> = {
  primary: Colors.primary,
  success: Colors.success,
  error: Colors.error,
  warning: Colors.warning,
  neutral: Colors.textSecondary,
};

const sizePaddingH: Record<BadgeSize, number> = {
  sm: Spacing.xs,
  md: Spacing.sm,
  lg: Spacing.md,
};

const sizePaddingV: Record<BadgeSize, number> = {
  sm: 2,
  md: Spacing.xxs + 1,
  lg: Spacing.xs,
};

const sizeFontStyle: Record<BadgeSize, object> = {
  sm: Typography.small,
  md: Typography.captionMedium,
  lg: Typography.bodyMedium,
};

const dotSize: Record<BadgeSize, number> = {
  sm: 6,
  md: 8,
  lg: 10,
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Badge — compact status indicator.
 *
 * @example
 * <Badge label="Active" variant="success" />
 * <Badge label="3" variant="error" size="sm" />
 * <Badge label="" variant="warning" dot />
 */
export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  style,
}: BadgeProps) {
  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            width: dotSize[size],
            height: dotSize[size],
            borderRadius: dotSize[size] / 2,
            backgroundColor: variantText[variant],
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantBg[variant],
          paddingHorizontal: sizePaddingH[size],
          paddingVertical: sizePaddingV[size],
        },
        style,
      ]}
    >
      <Text style={[sizeFontStyle[size], { color: variantText[variant] }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    alignSelf: 'flex-start',
  },
});
