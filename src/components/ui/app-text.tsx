import { Colors, Typography } from '@/constants/theme';
import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

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
  style?: TextStyle;
  numberOfLines?: number;
  /** Whether text should not wrap. Default: false */
  nowrap?: boolean;
}

// ─── Color Map ────────────────────────────────────────────────────────────────

const colorMap: Record<TextColor, string> = {
  primary: Colors.textPrimary,
  secondary: Colors.textSecondary,
  tertiary: Colors.textTertiary,
  inverse: Colors.textInverse,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
  accent: Colors.accent,
};

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
  return (
    <Text
      style={[
        styles.base,
        Typography[variant],
        { color: colorMap[color], textAlign: align },
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
