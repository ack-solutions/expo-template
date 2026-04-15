import { Radii, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
 Pressable, StyleSheet, Text, View, ViewStyle 
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ChipVariant = 'filled' | 'outlined' | 'ghost';
export type ChipSize = 'sm' | 'md';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  /** Visual style. Default: 'outlined' */
  variant?: ChipVariant;
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

function resolveContainerStyle(
  variant: ChipVariant,
  selected: boolean,
  size: ChipSize,
  colors: ReturnType<typeof useAppColors>,
): ViewStyle {
  const paddingH = size === 'sm' ? Spacing.sm : Spacing.md;
  const paddingV = size === 'sm' ? Spacing.xxs + 2 : Spacing.xs + 1;

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
backgroundColor: selected ? colors.primary : colors.primaryFaded 
};
  }
  if (variant === 'outlined') {
    return {
      ...base,
      backgroundColor: selected ? colors.primaryFaded12 : 'transparent',
      borderWidth: 1.5,
      borderColor: selected ? colors.primary : colors.border,
    };
  }
  // ghost
  return {
 ...base,
backgroundColor: selected ? colors.primaryFaded : 'transparent' 
};
}

function resolveTextColor(
  variant: ChipVariant,
  selected: boolean,
  colors: ReturnType<typeof useAppColors>,
): string {
  if (variant === 'filled') return selected ? colors.textInverse : colors.primary;
  return selected ? colors.primary : colors.textSecondary;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Chip — compact interactive or informational label with spring press animation.
 *
 * @example
 * // Filter chip
 * <Chip label="Design" selected={active} onPress={toggle} variant="outlined" />
 *
 * // Removable tag
 * <Chip label="React Native" onRemove={() => removeTag()} variant="filled" />
 */
export function Chip({
  label,
  variant = 'outlined',
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

  const containerStyle = resolveContainerStyle(variant, selected, size, colors);
  const textColor = resolveTextColor(variant, selected, colors);
  const textStyle = size === 'sm' ? Typography.small : Typography.captionMedium;
  const iconSize = size === 'sm' ? 12 : 14;

  const innerContent = (
    <>
      {leftIcon && <View style={styles.iconSlot}>{leftIcon}</View>}
      <Text
style={[
textStyle,
{
 color: textColor,
fontWeight: '500' 
}
]}
numberOfLines={1}>
        {label}
      </Text>
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
