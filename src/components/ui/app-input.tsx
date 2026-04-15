import {
 AppColors, Radii, Spacing, Typography 
} from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import React, { forwardRef, useRef } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// ─── Types ───────────────────────────────────────────────────────────────────

export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  /** Floating label shown above the field. */
  label?: string;
  /** Error message shown below the field. Puts the field in error state. */
  error?: string;
  /** Helper text shown below the field (hidden when error is present). */
  hint?: string;
  /** Visual variant. Default: 'outlined' */
  variant?: InputVariant;
  /**
   * Size. Default: 'md'
   *
   * sm  → 40 pt  (compact contexts)
   * md  → 48 pt  (standard — matches 44 pt HIG guideline + padding)
   * lg  → 56 pt  (prominent forms)
   */
  size?: InputSize;
  /** Node rendered at the start (left) of the input. */
  leftSlot?: React.ReactNode;
  /** Node rendered at the end (right) of the input. */
  rightSlot?: React.ReactNode;
  /** Container style override. */
  containerStyle?: ViewStyle;
}

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<InputSize, { fontSize: number; height: number; iconSize: number }> = {
  sm: {
 fontSize: 13,
height: 40,
iconSize: 16 
},
  md: {
 fontSize: 14,
height: 48,
iconSize: 18 
},
  lg: {
 fontSize: 15,
height: 56,
iconSize: 20 
},
};

// ─── Animation config ─────────────────────────────────────────────────────────

const TIMING = { duration: 180 };

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AppInput — labeled text input with animated focus state.
 *
 * Touch heights: sm = 40 pt, md = 48 pt, lg = 56 pt.
 *
 * The border and label color transition smoothly when the field gains/loses focus.
 * Error state overrides focus color and persists until the error is cleared.
 *
 * @example
 * <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="user@example.com" />
 *
 * <AppInput label="Password" secureTextEntry error={errors.password?.message} value={pw} onChangeText={setPw} />
 *
 * <AppInput
 *   label="Amount"
 *   variant="filled"
 *   leftSlot={<Text style={{ color: Colors.textTertiary }}>$</Text>}
 *   keyboardType="decimal-pad"
 *   value={amount}
 *   onChangeText={setAmount}
 * />
 */
export const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      hint,
      variant = 'outlined',
      size = 'md',
      leftSlot,
      rightSlot,
      containerStyle,
      onFocus,
      onBlur,
      editable = true,
      ...textInputProps
    },
    ref,
  ) => {
    const colors = useAppColors();
    const styles = createStyles(colors);
    const internalRef = useRef<TextInput>(null);
    const inputRef = (ref as React.RefObject<TextInput>) ?? internalRef;

    const hasError = Boolean(error);
    const disabled = editable === false;
    const cfg = sizeConfig[size];

    // 0 = unfocused / idle, 1 = focused
    const focusProgress = useSharedValue(0);

    const animBorderStyle = useAnimatedStyle(() => {
      if (hasError) {
        return { borderColor: colors.error };
      }
      return {
        borderColor: interpolateColor(
          focusProgress.value,
          [0, 1],
          [colors.border, colors.primary],
        ),
      };
    });

    const animLabelStyle = useAnimatedStyle(() => {
      if (hasError) {
        return { color: colors.error };
      }
      return {
        color: interpolateColor(
          focusProgress.value,
          [0, 1],
          [colors.textSecondary, colors.primary],
        ),
      };
    });

    function handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
      focusProgress.value = withTiming(1, TIMING);
      onFocus?.(e);
    }

    function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
      focusProgress.value = withTiming(0, TIMING);
      onBlur?.(e);
    }

    const fieldBg = disabled
      ? colors.borderLight
      : variant === 'filled'
      ? colors.primaryFaded
      : colors.surface;

    return (
      <Pressable
        style={[styles.container, containerStyle]}
        onPress={() => inputRef.current?.focus()}
        accessibilityRole="none"
      >
        {label && (
          <Animated.Text style={[
styles.label,
animLabelStyle,
disabled && styles.labelDisabled
]}>
            {label}
          </Animated.Text>
        )}

        <Animated.View
          style={[
            styles.field,
            {
              height: cfg.height,
              backgroundColor: fieldBg,
              borderWidth: variant === 'outlined' ? 1.5 : 0,
              borderBottomWidth: 1.5,
            },
            animBorderStyle,
          ]}
        >
          {leftSlot && (
            <View style={[styles.slotLeft, { height: cfg.height }]}>{leftSlot}</View>
          )}

          <TextInput
            ref={inputRef}
            {...textInputProps}
            editable={editable}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input,
              {
                fontSize: cfg.fontSize,
                color: disabled ? colors.textTertiary : colors.textPrimary,
              },
            ]}
            placeholderTextColor={colors.textTertiary}
          />

          {rightSlot && (
            <View style={[styles.slotRight, { height: cfg.height }]}>{rightSlot}</View>
          )}
        </Animated.View>

        {(hasError || hint) && (
          <Text style={[styles.supportText, hasError ? styles.errorText : styles.hintText]}>
            {hasError ? error : hint}
          </Text>
        )}
      </Pressable>
    );
  },
);

AppInput.displayName = 'AppInput';

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.captionMedium,
  },
  labelDisabled: {
    color: colors.textTertiary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.sm,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    ...Typography.body,
    // paddingVertical is omitted intentionally — the fixed `height` on the
    // Animated.View parent controls the touch target. TextInput fills it
    // vertically via alignItems: 'center' on the parent.
    paddingVertical: 0,
  },
  slotLeft: {
    paddingLeft: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotRight: {
    paddingRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    ...Typography.small,
  },
  errorText: {
    color: colors.error,
  },
  hintText: {
    color: colors.textTertiary,
  },
  });
