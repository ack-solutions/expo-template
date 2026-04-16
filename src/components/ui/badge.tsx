import { Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Visual style of the badge. */
export type BadgeVariant = 'filled' | 'soft' | 'outlined';

/** Semantic color of the badge. */
export type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  /** Visual style. Default: 'soft' */
  variant?: BadgeVariant;
  /** Semantic color. Default: 'neutral' */
  color?: BadgeColor;
  /** Size. Default: 'md' */
  size?: BadgeSize;
  /** Show a colored dot instead of a text label. Default: false */
  dot?: boolean;
  style?: ViewStyle;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

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
 * `variant` controls the visual style; `color` controls the semantic meaning.
 *
 * @example
 * <Badge label="Active" color="success" />
 * <Badge label="3" color="error" size="sm" variant="filled" />
 * <Badge label="Beta" color="primary" variant="outlined" />
 * <Badge label="" color="warning" dot />
 */
export function Badge({
  label,
  variant = 'soft',
  color = 'neutral',
  size = 'md',
  dot = false,
  style,
}: BadgeProps) {
  const { colors } = useAppTheme();

  const solidColor: Record<BadgeColor, string> = useMemo(
    () => ({
      primary: colors.primary,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      neutral: colors.textSecondary,
    }),
    [colors],
  );

  const fadedColor: Record<BadgeColor, string> = useMemo(
    () => ({
      primary: colors.primaryFaded,
      success: colors.successFaded,
      error: colors.errorFaded,
      warning: colors.warningFaded,
      neutral: colors.borderLight,
    }),
    [colors],
  );

  const resolvedSolid = solidColor[color];
  const resolvedFaded = fadedColor[color];

  const bgColor =
    variant === 'filled' ? resolvedSolid
    : variant === 'soft' ? resolvedFaded
    : 'transparent';

  const textColor =
    variant === 'filled' ? colors.textInverse : resolvedSolid;

  const borderColor = variant === 'outlined' ? resolvedSolid : undefined;

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            width: dotSize[size],
            height: dotSize[size],
            borderRadius: dotSize[size] / 2,
            backgroundColor: resolvedSolid,
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
          backgroundColor: bgColor,
          paddingHorizontal: sizePaddingH[size],
          paddingVertical: sizePaddingV[size],
          ...(borderColor
            ? {
                borderWidth: 1,
                borderColor,
              }
            : {}),
        },
        style,
      ]}
    >
      <AppText style={[sizeFontStyle[size], { color: textColor }]} numberOfLines={1}>
        {label}
      </AppText>
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
