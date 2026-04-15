import { Spacing } from '@/constants/theme';
import React from 'react';
import { FlexAlignType, StyleSheet, View, ViewStyle } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

// ─── Props ────────────────────────────────────────────────────────────────────

interface StackProps {
  children: React.ReactNode;
  /**
   * Layout axis.
   * - `'column'` stacks children vertically (default for `Stack` / `VStack`)
   * - `'row'`    places children horizontally (default for `HStack`)
   */
  direction?: 'row' | 'column';
  /**
   * Gap between children in px. Accepts a raw number or a key from the
   * Spacing token map.
   *
   * | Token  | Value |
   * |--------|-------|
   * | `xxs`  | 2     |
   * | `xs`   | 4     |
   * | `sm`   | 6     |
   * | `md`   | 10    |
   * | `lg`   | 14    |
   * | `xl`   | 16    |
   * | `xxl`  | 20    |
   * | `xxxl` | 28    |
   *
   * Default: `Spacing.md` (10)
   */
  gap?: number | keyof typeof Spacing;
  /** Cross-axis alignment. Default: `'flex-start'` */
  align?: FlexAlignType;
  /** Main-axis distribution. Default: `'flex-start'` */
  justify?: JustifyContent;
  /** Allow children to wrap onto the next line. Default: `false` */
  wrap?: boolean;
  /** `flex` value applied to the container. */
  flex?: number;
  /** Padding on all sides (px or Spacing key). */
  padding?: number | keyof typeof Spacing;
  /** Horizontal padding (px or Spacing key). Overrides `padding` for horizontal axis. */
  paddingH?: number | keyof typeof Spacing;
  /** Vertical padding (px or Spacing key). Overrides `padding` for vertical axis. */
  paddingV?: number | keyof typeof Spacing;
  style?: ViewStyle;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function resolveSpacing(value: number | keyof typeof Spacing): number {
  if (typeof value === 'number') return value;
  return Spacing[value];
}

function buildStyle(props: StackProps): ViewStyle {
  const {
    direction = 'column',
    gap = 'md',
    // 'stretch' is the correct default for column stacks so children fill the
    // container width. HStack callers pass 'flex-start' explicitly to avoid
    // stretching child height.
    align = 'stretch',
    justify = 'flex-start',
    wrap = false,
    flex,
    padding,
    paddingH,
    paddingV,
  } = props;

  const resolvedGap = resolveSpacing(gap);
  const resolvedPad = padding !== undefined ? resolveSpacing(padding) : undefined;
  const resolvedPadH = paddingH !== undefined ? resolveSpacing(paddingH) : resolvedPad;
  const resolvedPadV = paddingV !== undefined ? resolveSpacing(paddingV) : resolvedPad;

  return {
    flexDirection: direction,
    gap: resolvedGap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    ...(flex !== undefined ? { flex } : {}),
    ...(resolvedPadH !== undefined
      ? { paddingLeft: resolvedPadH, paddingRight: resolvedPadH }
      : {}),
    ...(resolvedPadV !== undefined
      ? { paddingTop: resolvedPadV, paddingBottom: resolvedPadV }
      : {}),
  };
}

// ─── Stack ────────────────────────────────────────────────────────────────────

/**
 * Stack — vertical layout container with consistent spacing.
 *
 * Use `Stack` (or its alias `VStack`) when arranging children top-to-bottom.
 * Use `HStack` when arranging children left-to-right.
 *
 * Gap, padding, alignment and distribution are all controlled through props —
 * no inline styles needed for the common cases.
 *
 * @example
 * // Form fields stacked vertically with standard gap
 * <Stack gap="lg">
 *   <AppInput label="First name" … />
 *   <AppInput label="Last name" … />
 *   <Button title="Submit" onPress={handleSubmit} />
 * </Stack>
 *
 * // Horizontal row of badges
 * <HStack gap="sm" wrap>
 *   <Badge label="Active" variant="success" />
 *   <Badge label="Admin" variant="primary" />
 * </HStack>
 *
 * // Full-height section with padding
 * <Stack flex={1} padding="xl" gap="xxl" justify="center" align="center">
 *   <EmptyState … />
 * </Stack>
 *
 * // Spread row (icon left, text center, action right)
 * <HStack justify="space-between" align="center">
 *   <Ionicons name="person" size={22} color={Colors.primary} />
 *   <AppText variant="h3">Profile</AppText>
 *   <Button title="Edit" variant="ghost" size="sm" onPress={…} />
 * </HStack>
 */
export function Stack({ children, style, ...props }: StackProps) {
  return (
    <View style={[buildStyle({ ...props, direction: props.direction ?? 'column' }), style]}>
      {children}
    </View>
  );
}

/**
 * VStack — explicit vertical Stack (identical to `Stack`).
 *
 * Use when co-located with `HStack` for readability clarity.
 *
 * @example
 * <VStack gap="md">
 *   <AppText variant="h2">Title</AppText>
 *   <AppText variant="body" color="secondary">Description</AppText>
 * </VStack>
 */
export function VStack({ children, style, ...props }: Omit<StackProps, 'direction'>) {
  return (
    <View style={[buildStyle({ ...props, direction: 'column' }), style]}>
      {children}
    </View>
  );
}

/**
 * HStack — horizontal Stack.
 *
 * @example
 * // Icon + label row
 * <HStack gap="sm" align="center">
 *   <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
 *   <AppText variant="bodyMedium">Verified</AppText>
 * </HStack>
 *
 * // Two-button row
 * <HStack gap="sm">
 *   <Button title="Cancel" variant="ghost" flex={1} onPress={onCancel} />
 *   <Button title="Save" variant="primary" flex={1} onPress={onSave} />
 * </HStack>
 */
export function HStack({ children, style, align = 'flex-start', ...props }: Omit<StackProps, 'direction'>) {
  return (
    <View style={[buildStyle({ ...props, direction: 'row', align }), style]}>
      {children}
    </View>
  );
}
