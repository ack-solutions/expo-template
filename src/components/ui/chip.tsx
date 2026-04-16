import {
  AppColors, Radii, Spacing, Typography
} from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Pressable, StyleSheet, View, ViewStyle
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Visual style of the chip. */
export type ChipVariant = 'filled' | 'outlined' | 'ghost';

/** Semantic color of the chip. */
export type ChipColor = 'primary' | 'success' | 'error' | 'warning' | 'neutral';

export type ChipSize = 'sm' | 'md';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  /** Visual style. Default: 'outlined' */
  variant?: ChipVariant;
  /** Semantic color. Default: 'primary' */
  color?: ChipColor;
  /** Size. Default: 'md' */
  size?: ChipSize;
  /** Highlight as selected state. Default: false */
  selected?: boolean;
  /** Makes the chip interactive. */
  onPress?: () => void;
  /** Shows an × remove button. */
  onRemove?: () => void;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

// ─── Animation config ─────────────────────────────────────────────────────────

const SPRING = {
  damping: 20,
  stiffness: 300,
  mass: 0.5
};

// ─── Style Helpers ────────────────────────────────────────────────────────────

function resolveColorTokens(
  color: ChipColor,
  colors: AppColors,
): { solid: string; faded: string; faded12: string } {
  switch (color) {
    case 'primary':
      return {
        solid: colors.primary,
        faded: colors.primaryFaded,
        faded12: colors.primaryFaded12,
      };
    case 'success':
      return {
        solid: colors.success,
        faded: colors.successFaded,
        faded12: colors.successFaded,
      };
    case 'error':
      return {
        solid: colors.error,
        faded: colors.errorFaded,
        faded12: colors.errorFaded,
      };
    case 'warning':
      return {
        solid: colors.warning,
        faded: colors.warningFaded,
        faded12: colors.warningFaded,
      };
    case 'neutral':
      return {
        solid: colors.textSecondary,
        faded: colors.borderLight,
        faded12: colors.borderLight,
      };
  }
}

function resolveContainerStyle(
  variant: ChipVariant,
  color: ChipColor,
  selected: boolean,
  size: ChipSize,
  colors: AppColors,
): ViewStyle {
  const paddingH = size === 'sm' ? Spacing.sm : Spacing.md;
  const paddingV = size === 'sm' ? Spacing.xxs + 2 : Spacing.xs + 1;
  const tokens = resolveColorTokens(color, colors);

  const base: ViewStyle = {
    borderRadius: Radii.pill,
    paddingHorizontal: paddingH,
    paddingVertical: paddingV,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    minHeight: size === 'sm' ? 32 : 36,
  };

  if (variant === 'filled') {
    return {
      ...base,
      backgroundColor: selected ? tokens.solid : tokens.faded,
    };
  }
  if (variant === 'outlined') {
    return {
      ...base,
      backgroundColor: selected ? tokens.faded12 : 'transparent',
      borderWidth: 1.5,
      borderColor: selected ? tokens.solid : colors.border,
    };
  }
  // ghost
  return {
    ...base,
    backgroundColor: selected ? tokens.faded : 'transparent',
  };
}

function resolveTextColor(
  variant: ChipVariant,
  color: ChipColor,
  selected: boolean,
  colors: AppColors,
): string {
  const tokens = resolveColorTokens(color, colors);
  if (variant === 'filled') return selected ? colors.textInverse : tokens.solid;
  return selected ? tokens.solid : colors.textSecondary;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Chip — compact interactive or informational label with spring press animation.
 *
 * `variant` controls the visual style; `color` controls the semantic meaning.
 *
 * @example
 * // Filter chip
 * <Chip label="Design" selected={active} onPress={toggle} variant="outlined" color="primary" />
 *
 * // Status chip
 * <Chip label="Active" variant="filled" color="success" />
 *
 * // Removable tag
 * <Chip label="React Native" onRemove={() => removeTag()} variant="filled" color="primary" />
 */
export function Chip({
  label,
  variant = 'outlined',
  color = 'primary',
  size = 'md',
  selected = false,
  onPress,
  onRemove,
  leftIcon,
  disabled = false,
  style,
}: ChipProps) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = resolveContainerStyle(variant, color, selected, size, colors);
  const textColor = resolveTextColor(variant, color, selected, colors);
  const textStyle = size === 'sm' ? Typography.small : Typography.captionMedium;
  const iconSize = size === 'sm' ? 12 : 14;

  const innerContent = (
    <>
      {leftIcon && <View style={styles.iconSlot}>{leftIcon}</View>}
      <AppText
        style={[
          textStyle,
          {
            color: textColor,
            fontWeight: '500'
          }
        ]}
        numberOfLines={1}
      >
        {label}
      </AppText>
      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={{
            top: 8,
            bottom: 8,
            left: 8,
            right: 8
          }}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <Ionicons
            name="close"
            size={iconSize}
            color={textColor} />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.93, SPRING); }}
        onPressOut={() => { scale.value = withSpring(1, SPRING); }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{
          selected,
          disabled
        }}
        style={disabled && styles.disabled}
      >
        <AnimatedView style={[
          containerStyle,
          animStyle,
          style
        ]}>
          {innerContent}
        </AnimatedView>
      </Pressable>
    );
  }

  return (
    <AnimatedView style={[
      containerStyle,
      disabled && styles.disabled,
      style
    ]}>
      {innerContent}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});
