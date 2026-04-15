import { Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProgressBarProps {
  /** Progress value from 0 to 100. */
  value: number;
  /** Color variant. Default: 'primary' */
  variant?: ProgressBarVariant;
  /** Bar thickness. Default: 'md' */
  size?: ProgressBarSize;
  /** Show percentage label at the end. Default: false */
  showLabel?: boolean;
  /** Custom label text. Overrides percentage display. */
  label?: string;
  /** Animate the bar fill on value change. Default: true */
  animated?: boolean;
  style?: ViewStyle;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const sizeHeight: Record<ProgressBarSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ProgressBar — linear progress indicator.
 *
 * @example
 * // Upload progress
 * <ProgressBar value={uploadProgress} variant="primary" showLabel />
 *
 * // Step indicator
 * <ProgressBar value={(step / totalSteps) * 100} variant="success" size="sm" />
 *
 * // Error state
 * <ProgressBar value={100} variant="error" label="Upload failed" showLabel />
 */
export function ProgressBar({
  value,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  style,
}: ProgressBarProps) {
  const { colors } = useAppTheme();
  const variantColor: Record<ProgressBarVariant, string> = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };
  const clampedValue = Math.min(100, Math.max(0, value));
  const widthAnim = useRef(new Animated.Value(clampedValue)).current;
  const barHeight = sizeHeight[size];
  const fillColor = variantColor[variant];

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: clampedValue,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(clampedValue);
    }
  }, [
clampedValue,
animated,
widthAnim
]);

  const displayLabel = label ?? `${Math.round(clampedValue)}%`;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          { backgroundColor: colors.borderLight },
          {
 height: barHeight,
borderRadius: barHeight / 2 
},
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: fillColor,
              borderRadius: barHeight / 2,
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {showLabel && (
        <AppText style={[styles.label, { color: fillColor }]}>{displayLabel}</AppText>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  label: {
    ...Typography.smallMedium,
    minWidth: 34,
    textAlign: 'right',
  },
});
