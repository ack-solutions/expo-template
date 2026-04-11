import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
  /** Screen title displayed in the toolbar */
  title: string;
  /** Small line under the title. Shown in toolbar typography.small. */
  subtitle?: string;
  /** Optional node before the title. Use with subtitle for a compact header. */
  titleStart?: React.ReactNode;
  /** Show a back arrow button. Default: false */
  showBack?: boolean;
  /** Custom back handler. If not provided, uses router.back() */
  onBack?: () => void;
  /** Optional right-side action element (button, icon, etc.) */
  right?: React.ReactNode;
}

/**
 * Reusable screen header / toolbar.
 *
 * Place it inside a `<SafeScreen>` so the top safe-area inset is
 * automatically applied above this bar.
 *
 * Usage:
 * ```tsx
 * <SafeScreen>
 *   <ScreenHeader title="Workspace" />
 *   {/* rest of screen content *\/}
 * </SafeScreen>
 *
 * // Detail screen with back button
 * <SafeScreen>
 *   <ScreenHeader title="Detail" showBack />
 *   {/* ... *\/}
 * </SafeScreen>
 * ```
 */
export function ScreenHeader({
  title,
  subtitle,
  titleStart,
  showBack = false,
  onBack,
  right,
}: ScreenHeaderProps) {
  const router = useRouter();
  const hasTitleCluster = Boolean(titleStart || subtitle);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, hasTitleCluster && styles.containerTall]}>
      {/* Left: back button or spacer */}
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Center: title only, or icon + title + optional subtitle */}
      {hasTitleCluster ? (
        <View style={styles.centerCluster}>
          {titleStart ? <View style={styles.titleStart}>{titleStart}</View> : null}
          <View style={styles.titleBlock}>
            <Text style={[styles.titleBase, styles.titleClustered]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      ) : (
        <Text style={[styles.titleBase, styles.titleCentered]} numberOfLines={1}>
          {title}
        </Text>
      )}

      {/* Right: optional action */}
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  containerTall: {
    minHeight: 56,
    paddingVertical: Spacing.xs,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
    marginTop: 1,
  },
  right: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
});
