import {
  Radii,
  Shadows,
  Spacing, Typography
} from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import React from 'react';
import {
  ActivityIndicator, Pressable, StyleSheet,
  TextStyle,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Visual style of the button. */
export type ButtonVariant = 'contained' | 'outlined' | 'soft' | 'ghost';

/** Semantic color of the button. */
export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'neutral';

export type ButtonSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ButtonProps {
  title: string;
  onPress: () => void;
  /** Visual style. Default: 'contained' */
  variant?: ButtonVariant;
  /** Semantic color. Default: 'primary' */
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  /** Icon rendered before the label. Size and color are injected automatically. */
  startIcon?: React.ReactNode;
  /** Icon rendered after the label. Size and color are injected automatically. */
  endIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

// ─── Animation config ─────────────────────────────────────────────────────────

const SPRING = {
  damping: 18,
  stiffness: 280,
  mass: 0.6
};

// ─── Style Maps ───────────────────────────────────────────────────────────────

/**
 * Sizes follow the 44 pt minimum touch-target guideline (Apple HIG / Material Design).
 *
 * sm  → 40 pt  (tight contexts: toolbars, table rows)
 * md  → 48 pt  (standard: most buttons)
 * lg  → 56 pt  (prominent CTAs)
 */
const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    minHeight: 40
  },
  md: {
    paddingVertical: 13,
    paddingHorizontal: Spacing.xxl,
    minHeight: 48
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.xxxl,
    minHeight: 56
  },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  sm: {
    ...Typography.bodySemibold,
    fontSize: 13
  },
  md: {
    ...Typography.bodySemibold,
    fontSize: 15
  },
  lg: {
    ...Typography.bodySemibold,
    fontSize: 16
  },
};

/** Icon sizes derived from button size — no need to pass iconSize manually. */
const iconSizeMap: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Button — primary action component with spring press animation.
 *
 * `variant` controls the visual style; `color` controls the semantic meaning.
 * Icon `size` and `color` are injected automatically based on button size and
 * variant/color — no need to pass them manually.
 *
 * Touch targets are sized to the 44 pt minimum (md = 48 pt, lg = 56 pt).
 *
 * @example
 * <Button title="Save" onPress={handleSave} />
 * <Button title="Delete" onPress={handleDelete} variant="contained" color="danger" />
 * <Button title="Cancel" onPress={handleCancel} variant="outlined" />
 * <Button title="More" onPress={handleMore} variant="ghost" />
 * <Button
 *   title="Add item"
 *   startIcon={<Ionicons name="add" />}
 *   endIcon={<Ionicons name="chevron-forward" />}
 *   onPress={handleAdd}
 *   fullWidth
 * />
 */
export function Button({
  title,
  onPress,
  variant = 'contained',
  color = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useAppTheme();
  const isDisabled = disabled || loading;

  // ── 2-D style maps: variant × color ───────────────────────────
  const bgMap: Record<ButtonVariant, Record<ButtonColor, string>> = {
    contained: {
      primary: colors.primary,
      secondary: colors.border,
      danger: colors.error,
      success: colors.success,
      warning: colors.warning,
      neutral: colors.borderLight,
    },
    soft: {
      primary: colors.primaryFaded,
      secondary: colors.borderLight,
      danger: colors.errorFaded,
      success: colors.successFaded,
      warning: colors.warningFaded,
      neutral: colors.borderLight,
    },
    outlined: {
      primary: 'transparent',
      secondary: 'transparent',
      danger: 'transparent',
      success: 'transparent',
      warning: 'transparent',
      neutral: 'transparent',
    },
    ghost: {
      primary: 'transparent',
      secondary: 'transparent',
      danger: 'transparent',
      success: 'transparent',
      warning: 'transparent',
      neutral: 'transparent',
    },
  };

  const borderMap: Record<ButtonVariant, Record<ButtonColor, string | undefined>> = {
    contained: {
      primary: undefined,
      secondary: undefined,
      danger: undefined,
      success: undefined,
      warning: undefined,
      neutral: undefined,
    },
    soft: {
      primary: undefined,
      secondary: undefined,
      danger: undefined,
      success: undefined,
      warning: undefined,
      neutral: undefined,
    },
    outlined: {
      primary: colors.primary,
      secondary: colors.border,
      danger: colors.error,
      success: colors.success,
      warning: colors.warning,
      neutral: colors.border,
    },
    ghost: {
      primary: undefined,
      secondary: undefined,
      danger: undefined,
      success: undefined,
      warning: undefined,
      neutral: undefined,
    },
  };

  const textColorMap: Record<ButtonVariant, Record<ButtonColor, string>> = {
    contained: {
      primary: colors.textInverse,
      secondary: colors.textPrimary,
      danger: colors.textInverse,
      success: colors.textInverse,
      warning: colors.textInverse,
      neutral: colors.textPrimary,
    },
    soft: {
      primary: colors.primary,
      secondary: colors.textSecondary,
      danger: colors.error,
      success: colors.success,
      warning: colors.warning,
      neutral: colors.textPrimary,
    },
    outlined: {
      primary: colors.primary,
      secondary: colors.textSecondary,
      danger: colors.error,
      success: colors.success,
      warning: colors.warning,
      neutral: colors.textPrimary,
    },
    ghost: {
      primary: colors.primary,
      secondary: colors.textSecondary,
      danger: colors.error,
      success: colors.success,
      warning: colors.warning,
      neutral: colors.textPrimary,
    },
  };

  const resolvedBg = bgMap[variant][color];
  const resolvedBorder = borderMap[variant][color];
  const resolvedTextColor = textColorMap[variant][color];

  const containerStyle: ViewStyle = {
    backgroundColor: resolvedBg,
    ...(resolvedBorder
      ? {
          borderWidth: 1.5,
          borderColor: resolvedBorder,
        }
      : {}),
  };

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function handlePressIn() {
    scale.value = withSpring(0.96, SPRING);
    opacity.value = withTiming(isDisabled ? 0.5 : 0.85, { duration: 80 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, SPRING);
    opacity.value = withTiming(isDisabled ? 0.5 : 1, { duration: 120 });
  }

  const autoIconSize = iconSizeMap[size];

  function resolveIcon(node: React.ReactNode) {
    if (!node || !React.isValidElement(node)) return node;
    return React.cloneElement(node as React.ReactElement<{ size?: number; color?: string }>, {
      size: autoIconSize,
      color: resolvedTextColor,
    });
  }

  const leadingIcon = resolveIcon(startIcon);
  const trailingIcon = resolveIcon(endIcon);

  const mergedTextStyle: TextStyle = {
    ...styles.text,
    color: resolvedTextColor,
    ...sizeTextStyles[size],
    ...(textStyle ?? {}),
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.base,
        containerStyle,
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'contained' && color === 'primary' && !isDisabled ? Shadows.md : undefined,
        animStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={resolvedTextColor} />
      ) : (
        <>
          {leadingIcon ? <Animated.View style={styles.iconSlot}>{leadingIcon}</Animated.View> : null}
          <AppText variant="bodySemibold" style={mergedTextStyle}>
            {title}
          </AppText>
          {trailingIcon ? <Animated.View style={styles.iconSlot}>{trailingIcon}</Animated.View> : null}
        </>
      )}
    </AnimatedPressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.sm,
    gap: Spacing.xs,
  },
  text: {
    ...Typography.bodySemibold,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
