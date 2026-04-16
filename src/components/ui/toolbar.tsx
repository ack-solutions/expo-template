import { Radii, Spacing, Typography } from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform, Pressable, StyleSheet, View, ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './app-text';

export interface ToolbarProps {
  /** Screen title */
  title: string;
  /** Shown under the title in small typography */
  subtitle?: string;
  /** Optional node before the title (e.g. icon) */
  titleStart?: React.ReactNode;
  /** Show back control. Default: false */
  showBack?: boolean;
  /** Custom back handler. Default: router.back() */
  onBack?: () => void;
  /** Replaces the entire left slot (back button area). Takes precedence over showBack */
  left?: React.ReactNode;
  /** Right-side actions (icons, buttons, menus) */
  right?: React.ReactNode;
  /**
   * Apply top safe area (status bar / notch / Dynamic Island).
   * When true, use parent `SafeScreen` with `topSafe={false}` to avoid double inset.
   * Default: true
   */
  safeAreaTop?: boolean;
  backgroundColor?: string;
  /** Optional custom container component (e.g. ScrollView). Default: View */
  containerComponent?: React.ElementType;
  /** Props passed to the custom container component. */
  containerProps?: Record<string, unknown>;
  /** Preferred style prop for the root container. */
  containerStyle?: ViewStyle;
}

/**
 * Top app bar: back / custom left, title, optional actions. Includes top safe-area inset by default.
 *
 * Place first in a column so it stays at the top; put scrolling content in a `ScrollView` with `flex: 1` below.
 *
 * @example Tab or root screen (toolbar owns top inset)
 * ```tsx
 * <SafeScreen topSafe={false} bottomSafe={false}>
 *   <Toolbar title="Home" right={<TouchableOpacity>...</TouchableOpacity>} />
 *   <ScrollView style={{ flex: 1 }}>...</ScrollView>
 * </SafeScreen>
 * ```
 */
export function Toolbar({
  title,
  subtitle,
  titleStart,
  showBack = false,
  onBack,
  left,
  right,
  safeAreaTop = true,
  backgroundColor,
  containerComponent: ContainerComponent = View,
  containerProps,
  containerStyle,
}: ToolbarProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasTitleCluster = Boolean(titleStart || subtitle);
  const resolvedBackgroundColor = backgroundColor ?? colors.background;
  const typedContainerProps = (containerProps ?? {}) as {
    style?: unknown;
  };
  const {
    style: containerComponentStyle,
    ...restContainerProps
  } = typedContainerProps;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const leftContent = left ? (
    <View style={styles.leftInner}>{left}</View>
  ) : showBack ? (
    <Pressable
      style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
      onPress={handleBack}
      hitSlop={{
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons
        name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
        size={22}
        color={colors.primary}
      />
    </Pressable>
  ) : null;

  return (
    <ContainerComponent
      {...restContainerProps}
      style={[
        containerComponentStyle,
        styles.root,
        {
          paddingTop: safeAreaTop ? insets.top : 0,
          backgroundColor: resolvedBackgroundColor,
        },
        containerStyle,
      ]}
    >
      <View style={[styles.bar, hasTitleCluster && styles.barTall]}>
        <View style={styles.left}>{leftContent}</View>

        {hasTitleCluster ? (
          <View style={styles.centerCluster}>
            {titleStart ? <View style={styles.titleStart}>{titleStart}</View> : null}
            <View style={styles.titleBlock}>
              <AppText style={[styles.titleBase, styles.titleClustered]} numberOfLines={1}>
                {title}
              </AppText>
              {subtitle ? (
                <AppText style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </AppText>
              ) : null}
            </View>
          </View>
        ) : (
          <AppText style={[styles.titleBase, styles.titleCentered]} numberOfLines={1}>
            {title}
          </AppText>
        )}

        <View style={styles.right}>{right}</View>
      </View>
    </ContainerComponent>
  );
}

const createStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    root: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
      paddingHorizontal: Spacing.sm,
    },
    barTall: {
      minHeight: 56,
      paddingVertical: Spacing.xs,
    },
    left: {
      width: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    leftInner: {
      minWidth: 36,
      minHeight: 36,
      justifyContent: 'center',
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: Radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backBtnPressed: {
      opacity: 0.6,
    },
    centerCluster: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 0,
      marginHorizontal: Spacing.xs,
    },
    titleStart: {
      marginRight: Spacing.sm,
    },
    titleBlock: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    titleBase: {
      ...Typography.h2,
      color: colors.textPrimary,
    },
    titleCentered: {
      flex: 1,
      textAlign: 'center',
      marginHorizontal: Spacing.xs,
    },
    titleClustered: {
      flexShrink: 1,
      textAlign: 'left',
    },
    subtitle: {
      ...Typography.small,
      color: colors.textSecondary,
      marginTop: 1,
    },
    right: {
      minWidth: 44,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  });
