import {
 AppColors, Radii, Shadows, Spacing, Typography 
} from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import React, { useMemo } from 'react';
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// ─── Types ───────────────────────────────────────────────────────────────────

type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// ─── AppCard ──────────────────────────────────────────────────────────────────

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Shadow level. Default: 'none' */
  shadow?: ShadowLevel;
  /** Remove default padding. Default: false */
  noPadding?: boolean;
}

/**
 * AppCard — static content container.
 *
 * @example
 * <AppCard shadow="sm">
 *   <CardHeader title="Recent activity" />
 *   <AppText variant="body" color="secondary">Body content.</AppText>
 * </AppCard>
 */
export function AppCard({
 children, style, shadow = 'none', noPadding = false 
}: AppCardProps) {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const shadowStyle = shadow === 'none' ? undefined : Shadows[shadow];
  return (
    <View style={[
styles.card,
noPadding && styles.noPadding,
shadowStyle,
style
]}>
      {children}
    </View>
  );
}

// ─── AppPressableCard ─────────────────────────────────────────────────────────

interface AppPressableCardProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: ShadowLevel;
  noPadding?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * AppPressableCard — tappable card with a spring scale press animation.
 *
 * @example
 * <AppPressableCard shadow="md" onPress={() => router.push('/detail')}>
 *   <CardHeader title="Tap me" subtitle="Navigates on press" />
 * </AppPressableCard>
 */
export function AppPressableCard({
  children,
  style,
  shadow = 'none',
  noPadding = false,
  ...pressableProps
}: AppPressableCardProps) {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shadowStyle = shadow === 'none' ? undefined : Shadows[shadow];

  return (
    <AnimatedPressable
      {...pressableProps}
      onPressIn={(e) => {
        scale.value = withSpring(0.975, {
 damping: 20,
stiffness: 300 
});
        pressableProps.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, {
 damping: 20,
stiffness: 300 
});
        pressableProps.onPressOut?.(e);
      }}
      style={[
        styles.card,
        noPadding && styles.noPadding,
        shadowStyle,
        animStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * CardHeader — standardised title row for cards.
 *
 * @example
 * <CardHeader title="Settings" subtitle="Manage your preferences" right={<Badge label="3" variant="error" />} />
 */
export function CardHeader({
 title, subtitle, right, style 
}: CardHeaderProps) {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noPadding: {
    padding: 0,
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
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: colors.textSecondary,
    marginTop: Spacing.xxs,
  },
  });
