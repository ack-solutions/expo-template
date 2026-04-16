import {
 Radii, Shadows, Spacing, Typography 
} from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

import { AppText } from './app-text';
import { Button } from './button';

// ─── Types ────────────────────────────────────────────────────────────────────

type PickerVariant = 'outlined' | 'filled';
type PickerSize = 'sm' | 'md' | 'lg';

type DateRangeValue = {
  startDate: Date | null;
  endDate: Date | null;
};

type BasePickerProps = {
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  variant?: PickerVariant;
  size?: PickerSize;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
};

export type AppDatePickerProps = BasePickerProps & {
  value: Date | null;
  onChange: (value: Date) => void;
};

export type AppDateTimePickerProps = BasePickerProps & {
  value: Date | null;
  onChange: (value: Date) => void;
};

export type AppDateRangePickerProps = Omit<BasePickerProps, 'minimumDate' | 'maximumDate'> & {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
};

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeConfig: Record<PickerSize, { height: number; fontSize: number }> = {
  sm: {
 height: 40,
fontSize: 13 
},
  md: {
 height: 48,
fontSize: 14 
},
  lg: {
 height: 56,
fontSize: 15 
},
};

// ─── Animation constants ──────────────────────────────────────────────────────

const SPRING_SHEET = {
 damping: 20,
stiffness: 300,
mass: 0.8 
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value: Date | null): string {
  if (!value) return '';
  return dayjs(value).format('MMM DD, YYYY');
}

function formatDateTime(value: Date | null): string {
  if (!value) return '';
  return dayjs(value).format('MMM DD, YYYY hh:mm A');
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function usePickerStyles() {
  return useThemedStyle(createStyles);
}

/**
 * Builds fully themed calendar styles that match the app's design tokens.
 * Overrides all color-related defaults from react-native-ui-datepicker.
 */
function usePickerCalendarStyles() {
  const { colors, resolvedColorScheme } = useAppTheme();
  const defaultStyles = useDefaultStyles(resolvedColorScheme);

  return useMemo(
    () => ({
      ...defaultStyles,
      // Day grid
      day: {
 ...defaultStyles.day,
borderRadius: Radii.sm 
},
      day_label: {
 ...defaultStyles.day_label,
color: colors.textPrimary 
},
      // Header selectors
      month_selector_label: {
        ...defaultStyles.month_selector_label,
        color: colors.textPrimary,
        fontWeight: '600' as const,
      },
      year_selector_label: {
        ...defaultStyles.year_selector_label,
        color: colors.textPrimary,
        fontWeight: '600' as const,
      },
      time_selector_label: {
        ...defaultStyles.time_selector_label,
        color: colors.textPrimary,
        fontWeight: '600' as const,
      },
      // Weekday labels
      weekday_label: {
 ...defaultStyles.weekday_label,
color: colors.textSecondary 
},
      // Month / year grids
      month: {
 ...defaultStyles.month,
borderColor: colors.border 
},
      month_label: {
 ...defaultStyles.month_label,
color: colors.textPrimary 
},
      year: {
 ...defaultStyles.year,
borderColor: colors.border 
},
      year_label: {
 ...defaultStyles.year_label,
color: colors.textPrimary 
},
      // Range fill (between start and end)
      range_fill: { backgroundColor: colors.primaryFaded },
      // Time picker
      time_label: {
 ...defaultStyles.time_label,
color: colors.textPrimary 
},
      time_selected_indicator: {
 ...defaultStyles.time_selected_indicator,
backgroundColor: colors.primaryFaded 
},
      // Single / range selection
      selected: { backgroundColor: colors.primary },
      selected_label: { color: colors.textInverse },
      range_start_label: { color: colors.textInverse },
      range_end_label: { color: colors.textInverse },
      range_middle: { backgroundColor: 'transparent' as const },
      range_middle_label: { color: colors.textPrimary },
      // Today
      today: {
 ...defaultStyles.today,
backgroundColor: colors.primaryFaded 
},
      today_label: {
 color: colors.primary,
fontWeight: '600' as const 
},
      // Outside current month / disabled
      outside_label: { color: colors.textTertiary },
      disabled_label: {
 color: colors.textTertiary,
opacity: 0.5 
},
      // Selected month / year cells
      selected_month: {
 backgroundColor: colors.primary,
borderColor: colors.primary 
},
      selected_month_label: { color: colors.textInverse },
      selected_year: {
 backgroundColor: colors.primary,
borderColor: colors.primary 
},
      selected_year_label: { color: colors.textInverse },
      active_year: {
 ...defaultStyles.active_year,
backgroundColor: colors.primaryFaded,
borderColor: colors.primaryFaded 
},
      active_year_label: { color: colors.primary },
    }),
    [colors, defaultStyles],
  );
}

// ─── PickerField (trigger) ────────────────────────────────────────────────────

function PickerField({
  label,
  valueText,
  placeholder,
  disabled = false,
  variant = 'outlined',
  size = 'md',
  error,
  hint,
  onPress,
  containerStyle,
}: {
  label?: string;
  valueText: string;
  placeholder: string;
  disabled?: boolean;
  variant?: PickerVariant;
  size?: PickerSize;
  error?: string;
  hint?: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
}) {
  const { colors } = useAppTheme();
  const styles = usePickerStyles();
  const hasError = Boolean(error);
  const cfg = sizeConfig[size];

  const borderColor = hasError ? colors.error : colors.border;
  const fieldBg = disabled
    ? colors.borderLight
    : variant === 'filled'
      ? colors.primaryFaded
      : colors.surface;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, containerStyle]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      {label ? (
        <AppText
          style={[
            styles.label,
            hasError && styles.labelError,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          {
            height: cfg.height,
            backgroundColor: fieldBg,
            borderWidth: variant === 'outlined' ? 1.5 : 0,
            borderBottomWidth: 1.5,
            borderColor,
          },
        ]}
      >
        <AppText
          style={[
            styles.valueText,
            { fontSize: cfg.fontSize },
            !valueText && styles.placeholder,
            disabled && styles.valueDisabled,
          ]}
          numberOfLines={1}
        >
          {valueText || placeholder}
        </AppText>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={disabled ? colors.textTertiary : colors.textSecondary}
        />
      </View>

      {(hasError || hint) && (
        <AppText
          style={[styles.supportText, hasError ? styles.errorText : styles.hintText]}
        >
          {hasError ? error : hint}
        </AppText>
      )}
    </Pressable>
  );
}

// ─── PickerSheet (bottom sheet) ───────────────────────────────────────────────

interface PickerSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  children: React.ReactNode;
}

function PickerSheet({
  visible,
  title,
  onClose,
  onConfirm,
  confirmLabel = 'Done',
  confirmDisabled = false,
  children,
}: PickerSheetProps) {
  const styles = usePickerStyles();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Spacing.lg);

  const [rendered, setRendered] = useState(visible);
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(600);

  useEffect(() => {
    if (visible) setRendered(true);
  }, [visible]);

  useEffect(() => {
    if (!rendered) return;

    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, SPRING_SHEET);
    } else {
      Keyboard.dismiss();
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(600, { duration: 260 }, (finished) => {
        if (finished) setRendered(false);
      });
    }
  }, [
backdropOpacity,
rendered,
translateY,
visible
]);

  const animBackdrop = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const animSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!rendered) return null;

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.sheetOverlay} pointerEvents="box-none">
        {/* Backdrop — visual only */}
        <Animated.View
          style={[
StyleSheet.absoluteFill,
styles.backdrop,
animBackdrop
]}
          pointerEvents="none"
        />
        {/* Dismiss area */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Sheet */}
        <Animated.View
          style={[
styles.sheet,
{ paddingBottom: bottomPad },
Shadows.xl,
animSheet
]}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.pickerHeader}>
            <AppText style={styles.pickerTitle}>{title}</AppText>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={{
 top: 8,
bottom: 8,
left: 8,
right: 8 
}}
            >
              <Ionicons
name="close"
size={20}
color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Calendar content */}
          <View style={styles.sheetBody}>{children}</View>

          {/* Footer actions */}
          <View style={styles.sheetFooter}>
            <Button
              title="Cancel"
              variant="ghost"
              size="md"
              onPress={onClose}
              style={styles.footerBtn}
            />
            <Button
              title={confirmLabel}
              variant="contained"
              size="md"
              onPress={onConfirm}
              disabled={confirmDisabled}
              style={styles.footerBtn}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── AppDatePicker ─────────────────────────────────────────────────────────────

/**
 * Date field with a themed calendar sheet.
 *
 * @example
 * <AppDatePicker
 *   label="Start Date"
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Select a date"
 * />
 */
export function AppDatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  hint,
  disabled = false,
  variant = 'outlined',
  size = 'md',
  minimumDate,
  maximumDate,
  containerStyle,
}: AppDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | null>(value);
  const calendarStyles = usePickerCalendarStyles();

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <>
      <PickerField
        label={label}
        valueText={formatDate(value)}
        placeholder={placeholder}
        disabled={disabled}
        variant={variant}
        size={size}
        error={error}
        hint={hint}
        onPress={() => setOpen(true)}
        containerStyle={containerStyle}
      />

      <PickerSheet
        visible={open}
        title={label ?? 'Select date'}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          if (draft) onChange(draft);
          setOpen(false);
        }}
        confirmDisabled={!draft}
      >
        <DateTimePicker
          mode="single"
          date={draft ? dayjs(draft) : undefined}
          minDate={minimumDate ? dayjs(minimumDate) : undefined}
          maxDate={maximumDate ? dayjs(maximumDate) : undefined}
          onChange={({ date }) => {
            if (date) setDraft(dayjs(date as Parameters<typeof dayjs>[0]).toDate());
          }}
          styles={calendarStyles}
        />
      </PickerSheet>
    </>
  );
}

// ─── AppDateTimePicker ────────────────────────────────────────────────────────

/**
 * Date + time field with a themed calendar and time picker sheet.
 *
 * @example
 * <AppDateTimePicker
 *   label="Appointment"
 *   value={datetime}
 *   onChange={setDatetime}
 * />
 */
export function AppDateTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date and time',
  error,
  hint,
  disabled = false,
  variant = 'outlined',
  size = 'md',
  minimumDate,
  maximumDate,
  containerStyle,
}: AppDateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | null>(value);
  const calendarStyles = usePickerCalendarStyles();

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <>
      <PickerField
        label={label}
        valueText={formatDateTime(value)}
        placeholder={placeholder}
        disabled={disabled}
        variant={variant}
        size={size}
        error={error}
        hint={hint}
        onPress={() => setOpen(true)}
        containerStyle={containerStyle}
      />

      <PickerSheet
        visible={open}
        title={label ?? 'Select date and time'}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          if (draft) onChange(draft);
          setOpen(false);
        }}
        confirmDisabled={!draft}
      >
        <DateTimePicker
          mode="single"
          timePicker
          date={draft ? dayjs(draft) : undefined}
          minDate={minimumDate ? dayjs(minimumDate) : undefined}
          maxDate={maximumDate ? dayjs(maximumDate) : undefined}
          onChange={({ date }) => {
            if (date) setDraft(dayjs(date as Parameters<typeof dayjs>[0]).toDate());
          }}
          styles={calendarStyles}
        />
      </PickerSheet>
    </>
  );
}

// ─── AppDateRangePicker ───────────────────────────────────────────────────────

/**
 * Date range field with a themed calendar sheet supporting start + end selection.
 *
 * @example
 * <AppDateRangePicker
 *   label="Date Range"
 *   value={{ startDate: null, endDate: null }}
 *   onChange={setRange}
 * />
 */
export function AppDateRangePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date range',
  error,
  hint,
  disabled = false,
  variant = 'outlined',
  size = 'md',
  containerStyle,
}: AppDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState<Date | null>(value.startDate);
  const [draftEnd, setDraftEnd] = useState<Date | null>(value.endDate);
  const calendarStyles = usePickerCalendarStyles();

  useEffect(() => {
    if (open) {
      setDraftStart(value.startDate);
      setDraftEnd(value.endDate);
    }
  }, [
open,
value.startDate,
value.endDate
]);

  const displayText = useMemo(() => {
    if (!value.startDate && !value.endDate) return '';
    if (value.startDate && !value.endDate) return `${formatDate(value.startDate)} →`;
    if (!value.startDate && value.endDate) return `→ ${formatDate(value.endDate)}`;
    return `${formatDate(value.startDate)} – ${formatDate(value.endDate)}`;
  }, [value.startDate, value.endDate]);

  return (
    <>
      <PickerField
        label={label}
        valueText={displayText}
        placeholder={placeholder}
        disabled={disabled}
        variant={variant}
        size={size}
        error={error}
        hint={hint}
        onPress={() => setOpen(true)}
        containerStyle={containerStyle}
      />

      <PickerSheet
        visible={open}
        title={label ?? 'Select date range'}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onChange({
 startDate: draftStart,
endDate: draftEnd 
});
          setOpen(false);
        }}
        confirmDisabled={!draftStart}
      >
        <DateTimePicker
          mode="range"
          startDate={draftStart ? dayjs(draftStart) : undefined}
          endDate={draftEnd ? dayjs(draftEnd) : undefined}
          onChange={({ startDate, endDate }) => {
            setDraftStart(startDate ? dayjs(startDate as Parameters<typeof dayjs>[0]).toDate() : null);
            setDraftEnd(endDate ? dayjs(endDate as Parameters<typeof dayjs>[0]).toDate() : null);
          }}
          styles={calendarStyles}
        />
      </PickerSheet>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    // ── Trigger field ──
    container: {
      gap: Spacing.xs,
    },
    label: {
      ...Typography.captionMedium,
      color: colors.textSecondary,
    },
    labelError: {
      color: colors.error,
    },
    labelDisabled: {
      color: colors.textTertiary,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: Radii.sm,
      paddingHorizontal: Spacing.md,
      overflow: 'hidden',
    },
    valueText: {
      flex: 1,
      ...Typography.body,
      color: colors.textPrimary,
    },
    placeholder: {
      color: colors.textTertiary,
    },
    valueDisabled: {
      color: colors.textTertiary,
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

    // ── Sheet ──
    sheetOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: Radii.xl,
      borderTopRightRadius: Radii.xl,
      width: '100%',
      alignSelf: 'center',
      maxWidth: 560,
    },
    handle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    pickerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    pickerTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
      flex: 1,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: Radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetBody: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    sheetFooter: {
      flexDirection: 'row',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
    },
    footerBtn: {
      flex: 1,
    },
  });
