import { AppColors, Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from './app-text';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppCheckboxProps {
  /** Whether the checkbox is checked. */
  checked: boolean;
  /** Called when the user taps the checkbox row. */
  onPress: () => void;
  /** Label displayed next to the checkbox. */
  label?: string;
  /** Secondary text shown below the label. */
  description?: string;
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Shows a dash (−) instead of a checkmark for partial selection. Default: false */
  indeterminate?: boolean;
  style?: ViewStyle;
}

// ─── Animation config ─────────────────────────────────────────────────────────

const CHECK_SPRING = {
 damping: 14,
stiffness: 260,
mass: 0.7 
};
const BOX_TIMING = { duration: 160 };

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AppCheckbox — accessible checkbox with animated check and box transitions.
 *
 * - Box background color fades in when checked.
 * - Checkmark icon springs in with a slight overshoot for tactile feel.
 * - Entire row is the tap target for easy interaction.
 *
 * @example
 * <AppCheckbox
 *   checked={agreed}
 *   onPress={() => setAgreed(!agreed)}
 *   label="I agree to the terms"
 *   description="By checking you confirm you have read the terms"
 * />
 */
export function AppCheckbox({
  checked,
  onPress,
  label,
  description,
  disabled = false,
  indeterminate = false,
  style,
}: AppCheckboxProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  const isActive = checked || indeterminate;

  // 0 = unchecked, 1 = checked
  const checkProgress = useSharedValue(isActive ? 1 : 0);
  const iconScale = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    checkProgress.value = withTiming(isActive ? 1 : 0, BOX_TIMING);
    iconScale.value = isActive
      ? withSpring(1, CHECK_SPRING)
      : withTiming(0, { duration: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive]);

  const animBoxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      checkProgress.value,
      [0, 1],
      [colors.surface, colors.primary],
    ),
    borderColor: interpolateColor(
      checkProgress.value,
      [0, 1],
      [colors.border, colors.primary],
    ),
  }));

  const animIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconScale.value,
  }));

  const rowPressScale = useSharedValue(1);
  const animRowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowPressScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { rowPressScale.value = withSpring(0.98, {
 damping: 20,
stiffness: 300 
}); }}
      onPressOut={() => { rowPressScale.value = withSpring(1, {
 damping: 20,
stiffness: 300 
}); }}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{
 checked: indeterminate ? 'mixed' : checked,
disabled 
}}
    >
      <Animated.View
        style={[
          styles.row,
          disabled && styles.disabled,
          animRowStyle,
          style,
        ]}
      >
        <Animated.View style={[styles.box, animBoxStyle]}>
          <Animated.View style={animIconStyle}>
            <Ionicons
              name={indeterminate ? 'remove' : 'checkmark'}
              size={14}
              color={colors.textInverse}
            />
          </Animated.View>
        </Animated.View>

        {(label || description) && (
          <View style={styles.textBlock}>
            {label && (
              <AppText style={[styles.label, disabled && styles.textDisabled]}>{label}</AppText>
            )}
            {description && (
              <AppText style={[styles.description, disabled && styles.textDisabled]}>{description}</AppText>
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    minHeight: 44,
    alignContent: 'center',
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
    borderWidth: 1.5,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xxs,
    justifyContent: 'center',
  },
  label: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
  },
  description: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  disabled: {
    opacity: 0.45,
  },
  textDisabled: {
    color: colors.textTertiary,
  },
  });
