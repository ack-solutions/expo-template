import { AppColors, Radii, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppText } from './app-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WINDOW_H = Dimensions.get('window').height;
/** Sheet starts this far below its rest position (slide up on open). */
const SHEET_SLIDE_PX = Math.min(420, Math.round(WINDOW_H * 0.5));

const BACKDROP_FADE_MS = 220;
const SHEET_SLIDE_IN_MS = 280;
const BACKDROP_FADE_OUT_MS = 200;
const SHEET_SLIDE_OUT_MS = 240;

export type ActionSheetRowEdge = 'default' | 'beforeDanger' | 'danger';

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Bottom sheet–style menu: backdrop fades in/out; sheet slides. Modal uses no system animation.
 */
export function ActionSheet({
  visible, onClose, title, subtitle, children
}: ActionSheetProps) {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Spacing.lg);
  const [renderModal, setRenderModal] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(SHEET_SLIDE_PX)).current;

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!renderModal) return;

    backdropOpacity.stopAnimation();
    sheetY.stopAnimation();

    if (visible) {
      backdropOpacity.setValue(0);
      sheetY.setValue(SHEET_SLIDE_PX);
      const id = requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: BACKDROP_FADE_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(sheetY, {
            toValue: 0,
            duration: SHEET_SLIDE_IN_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
      return () => cancelAnimationFrame(id);
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: BACKDROP_FADE_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetY, {
        toValue: SHEET_SLIDE_PX,
        duration: SHEET_SLIDE_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setRenderModal(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- backdropOpacity/sheetY are stable Animated.Values
  }, [renderModal, visible]);

  return (
    <Modal
      visible={renderModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.root} pointerEvents="box-none">
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} pointerEvents="none" />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Dismiss menu"
          accessibilityRole="button"
        />
        <Animated.View
          style={[
            styles.sheet,
            Shadows.xl,
            {
              paddingBottom: bottomPad,
              transform: [{ translateY: sheetY }]
            },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.handle} />
          <AppText style={styles.title}>{title}</AppText>
          {subtitle ? (
            <AppText style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </AppText>
          ) : null}
          <View style={styles.rows}>{children}</View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <AppText style={styles.cancelText}>Cancel</AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

interface ActionSheetRowProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
  edge?: ActionSheetRowEdge;
}

export function ActionSheetRow({
  icon,
  label,
  onPress,
  variant = 'default',
  edge = 'default',
}: ActionSheetRowProps) {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  const isDanger = variant === 'danger';
  const rowStyle: StyleProp<ViewStyle> = [
    styles.row,
    edge === 'default' && styles.rowBorderBottom,
    edge === 'beforeDanger' && styles.rowBeforeDanger,
    edge === 'danger' && styles.rowDanger,
  ];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        rowStyle,
        pressed && !isDanger && styles.rowPressedDefault,
        pressed && isDanger && styles.rowPressedDanger
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconCircle, isDanger ? styles.iconCircleDanger : styles.iconCircleDefault]}>
        {icon}
      </View>
      <AppText style={[styles.rowLabel, isDanger && styles.rowLabelDanger]}>{label}</AppText>
    </Pressable>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: Radii.xl,
      borderTopRightRadius: Radii.xl,
      paddingTop: Spacing.xs,
      maxWidth: 520,
      width: '100%',
      alignSelf: 'center',
    },
    handle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: Spacing.md,
    },
    title: {
      ...Typography.h3,
      color: colors.textPrimary,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      ...Typography.caption,
      color: colors.textSecondary,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    rows: {
      paddingHorizontal: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      minHeight: 52,
    },
    rowBorderBottom: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    rowBeforeDanger: {
      marginBottom: Spacing.xs,
    },
    rowDanger: {
      marginTop: Spacing.xs,
      paddingTop: Spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    rowPressedDefault: {
      backgroundColor: colors.primaryFaded,
    },
    rowPressedDanger: {
      backgroundColor: colors.errorFaded,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircleDefault: {
      backgroundColor: colors.primaryFaded,
    },
    iconCircleDanger: {
      backgroundColor: colors.errorFaded,
    },
    rowLabel: {
      ...Typography.bodyMedium,
      color: colors.textPrimary,
      flex: 1,
    },
    rowLabelDanger: {
      color: colors.error,
    },
    cancelBtn: {
      marginTop: Spacing.sm,
      marginHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      borderRadius: Radii.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      backgroundColor: colors.surface,
    },
    cancelBtnPressed: {
      backgroundColor: colors.borderLight,
    },
    cancelText: {
      ...Typography.bodyMedium,
      color: colors.textSecondary,
    },
  });
