import { Colors, Radii, Shadows, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Shadow level applied. Default: 'sm' */
  shadow?: ShadowLevel;
  /** Disable padding. Default: false */
  noPadding?: boolean;
  /**
   * When true, renders an outer shadow wrapper and an inner surface.
   * This avoids shadow clipping/ugliness when borders are present (esp. Android).
   * Default: true
   */
  avoidShadowClipping?: boolean;
}

export function AppCard({
  children,
  style,
  shadow = 'none',
  noPadding = false,
}: AppCardProps) {
  const shadowStyle = shadow === 'none' ? undefined : Shadows[shadow];
  const contentStyle: StyleProp<ViewStyle> = [styles.card, noPadding && styles.noPadding, shadowStyle, style];

  return <View style={contentStyle}>{children}</View>;
}

interface AppPressableCardProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: ShadowLevel;
  noPadding?: boolean;
  avoidShadowClipping?: boolean;
}

export function AppPressableCard({
  children,
  style,
  shadow = 'none',
  noPadding = false,
  ...pressableProps
}: AppPressableCardProps) {
  const shadowStyle = shadow === 'none' ? undefined : Shadows[shadow];
  const contentStyle: StyleProp<ViewStyle> = [styles.card, noPadding && styles.noPadding, style];

  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }) => [
        contentStyle,
        shadowStyle,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function CardHeader({ title, subtitle, right }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noPadding: {
    padding: 0,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xxs,
  },
});
