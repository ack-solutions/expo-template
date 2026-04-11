import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';

interface SafeScreenProps {
  children: React.ReactNode;
  /** Apply top safe area inset (status bar). Default: true */
  topSafe?: boolean;
  /** Apply bottom safe area inset (home indicator). Default: true */
  bottomSafe?: boolean;
  /** Background color. Default: Colors.background */
  backgroundColor?: string;
  /** Additional container style */
  style?: ViewStyle;
}

/**
 * A reusable safe-area wrapper for screens.
 *
 * - **Tab screens** → use with both `topSafe` and `bottomSafe` (defaults).
 * - **Stack screens** → use with `topSafe={false}` since the native header
 *   already accounts for the status bar.
 *
 * Handles iOS notch, Android status bar, and bottom home indicator on both platforms.
 */
export function SafeScreen({
  children,
  topSafe = true,
  bottomSafe = true,
  backgroundColor = Colors.background,
  style,
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: topSafe ? insets.top : 0,
          paddingBottom: bottomSafe ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
