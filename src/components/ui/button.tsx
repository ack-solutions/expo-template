import {
  Radii,
  Shadows,
  Spacing, Typography
} from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
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

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
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

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Button — primary action component with spring press animation.
 *
 * Touch targets are sized to the 44 pt minimum (md = 48 pt, lg = 56 pt).
 *
 * @example
 * <Button title="Save" onPress={handleSave} variant="primary" />
 * <Button title="Delete" onPress={handleDelete} variant="danger" />
 * <Button title="Loading…" loading onPress={() => {}} />
 * <Button
 *   title="Add item"
 *   icon={<Ionicons name="add" size={16} color="#fff" />}
 *   onPress={handleAdd}
 *   fullWidth
 * />
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const colors = useAppColors();
  const isDisabled = disabled || loading;
  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.primaryFaded },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.error },
  };

  const variantTextStyles: Record<ButtonVariant, TextStyle> = {
    primary: { color: colors.textInverse },
    secondary: { color: colors.primary },
    outline: { color: colors.textPrimary },
    ghost: { color: colors.primary },
    danger: { color: colors.textInverse },
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

  const spinnerColor =
    variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        variant === 'primary' && !isDisabled ? Shadows.md : undefined,
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
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {icon}
          <AppText
            variant="bodySemibold"
            style={[
              styles.text,
              variantTextStyles[variant],
              sizeTextStyles[size],
              textStyle,
            ]}
          >
            {title}
          </AppText>
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
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
