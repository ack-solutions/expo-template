import { Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import React from 'react';
import {
 StyleProp, StyleSheet, Text, TextStyle 
} from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TextVariant =
  | 'hero'
  | 'displayLarge'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMedium'
  | 'bodySemibold'
  | 'caption'
  | 'captionMedium'
  | 'small'
  | 'smallMedium';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'error'
  | 'success'
  | 'warning'
  | 'accent';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppTextProps {
  /** Typography scale variant. Default: 'body' */
  variant?: TextVariant;
  /** Semantic color token. Default: 'primary' */
  color?: TextColor;
  /** Text alignment. Default: 'left' */
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  /** Whether text should not wrap. Default: false */
  nowrap?: boolean;
}

// ─── Color Map ────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AppText — variant-based typography component.
 *
 * Maps directly to the Typography design tokens. Use this instead of raw
 * `<Text>` to guarantee consistent type scale across the app.
 *
 * @example
 * <AppText variant="h2" color="primary">Section Title</AppText>
 * <AppText variant="body" color="secondary">Supporting copy</AppText>
 * <AppText variant="caption" color="tertiary" align="center">Hint text</AppText>
 */
export function AppText({
  variant = 'body',
  color = 'primary',
  align = 'left',
  children,
  style,
  numberOfLines,
  nowrap = false,
}: AppTextProps) {
  const { colors } = useAppTheme();
  const colorMap: Record<TextColor, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    inverse: colors.textInverse,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    accent: colors.accent,
  };

  return (
    <Text
      style={[
        styles.base,
        Typography[variant],
        {
          color: colorMap[color],
          textAlign: align
        },
        nowrap && styles.nowrap,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 1,
  },
  nowrap: {
    flexShrink: 0,
  },
});
