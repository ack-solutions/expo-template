import { Spacing, Typography } from '@/constants/theme';
import { AppThemeColors } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import React from 'react';
import {
 StyleSheet, Text, View, ViewStyle 
} from 'react-native';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DividerProps {
  /** Layout orientation. Default: 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Optional label displayed at the center of a horizontal divider. */
  label?: string;
  /** Color of the line. Default: Colors.border */
  color?: string;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Divider — thin visual separator between sections.
 *
 * @example
 * // Full-width line
 * <Divider />
 *
 * // Labeled section break
 * <Divider label="or continue with" />
 *
 * // Vertical separator (inside a row)
 * <View style={{ flexDirection: 'row', height: 24 }}>
 *   <Text>Left</Text>
 *   <Divider orientation="vertical" />
 *   <Text>Right</Text>
 * </View>
 */
export function Divider({
  orientation = 'horizontal',
  label,
  color,
  style,
}: DividerProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  const resolvedColor = color ?? colors.border;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          { backgroundColor: resolvedColor },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.labelRow, style]}>
        <View style={[
styles.line,
{
 backgroundColor: resolvedColor,
flex: 1 
}
]} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={[
styles.line,
{
 backgroundColor: resolvedColor,
flex: 1 
}
]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontal,
        { backgroundColor: resolvedColor },
        style,
      ]}
    />
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  line: {
    height: StyleSheet.hairlineWidth,
  },
  labelText: {
    ...Typography.captionMedium,
    color: colors.textTertiary,
  },
  });
