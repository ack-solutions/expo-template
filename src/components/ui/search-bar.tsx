import {
 Radii, Spacing, Typography
} from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { forwardRef } from 'react';
import {
 Pressable, StyleSheet, TextInput, TextInputProps, ViewStyle 
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  /** Clears the input when tapped. Should call onChangeText('') in handler. */
  onClear?: () => void;
  /** Container style override. */
  style?: ViewStyle;
}

// ─── Animation config ─────────────────────────────────────────────────────────

const TIMING = { duration: 200 };

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SearchBar — pre-styled search input with animated focus state.
 *
 * - Border and icon color transition smoothly when the field gains/loses focus.
 * - Clear button appears when the input has a value.
 * - Height is 48 pt for a comfortable touch target.
 *
 * @example
 * const [query, setQuery] = useState('');
 *
 * <SearchBar
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search items…"
 *   onClear={() => setQuery('')}
 * />
 */
export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({
 onClear, style, onFocus, onBlur, value, ...textInputProps 
}, ref) => {
    const { colors } = useAppTheme();
    const styles = useThemedStyle(createStyles);
    const hasValue = Boolean(value && String(value).length > 0);

    // 0 = idle, 1 = focused
    const focusProgress = useSharedValue(0);

    const animContainerStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        [colors.borderLight, colors.surface],
      ),
      borderColor: interpolateColor(
        focusProgress.value,
        [0, 1],
        ['transparent', colors.primary],
      ),
    }));

    const animIconStyle = useAnimatedStyle(() => ({
      opacity: withTiming(focusProgress.value === 1 ? 1 : 0.55, TIMING),
    }));

    function handleFocus(e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) {
      focusProgress.value = withTiming(1, TIMING);
      onFocus?.(e);
    }

    function handleBlur(e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) {
      focusProgress.value = withTiming(0, TIMING);
      onBlur?.(e);
    }

    return (
      <Animated.View style={[
styles.container,
animContainerStyle,
style
]}>
        <Animated.View style={[styles.iconWrap, animIconStyle]}>
          <Ionicons
name="search"
size={18}
color={colors.primary} />
        </Animated.View>

        <TextInput
          ref={ref}
          value={value}
          {...textInputProps}
          style={styles.input}
          placeholderTextColor={colors.textTertiary}
          returnKeyType="search"
          clearButtonMode="never"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {hasValue && onClear && (
          <Pressable
            onPress={onClear}
            hitSlop={{
 top: 10,
bottom: 10,
left: 10,
right: 10 
}}
            style={styles.clearBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
name="close-circle"
size={18}
color={colors.textTertiary} />
          </Pressable>
        )}
      </Animated.View>
    );
  },
);

SearchBar.displayName = 'SearchBar';

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  iconWrap: {
    marginRight: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    marginLeft: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  });
