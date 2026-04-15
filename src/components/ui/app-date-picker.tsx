import {
  AppColors,
  Radii,
  Spacing,
  Typography,
} from '@/constants/theme';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal, Platform, Pressable, StyleSheet, Text, View, ViewStyle
} from 'react-native';

type DateTimePickerEvent = {
  type: 'set' | 'dismissed' | 'neutralButtonPressed';
};

const DateTimePickerNative: React.ComponentType<{
  value: Date;
  mode: 'date' | 'time';
  display?: 'default' | 'spinner';
  minimumDate?: Date;
  maximumDate?: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  style?: ViewStyle;
  themeVariant?: 'light' | 'dark';
  accentColor?: string;
  textColor?: string;
}> | null = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-community/datetimepicker');
    return (mod.default ?? mod) as React.ComponentType<{
      value: Date;
      mode: 'date' | 'time';
      display?: 'default' | 'spinner';
      minimumDate?: Date;
      maximumDate?: Date;
      onChange: (event: DateTimePickerEvent, date?: Date) => void;
      style?: ViewStyle;
      themeVariant?: 'light' | 'dark';
      accentColor?: string;
      textColor?: string;
    }>;
  } catch {
    return null;
  }
})();

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

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfToday(): Date {
  return toDateOnly(new Date());
}

function formatDate(value: Date | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(value);
}

function formatDateTime(value: Date | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function isDatePickerSet(event: DateTimePickerEvent): boolean {
  return event.type === 'set' || Platform.OS === 'ios';
}

function useNativePickerThemeProps() {
  const { colors, resolvedColorScheme } = useAppTheme();

  return useMemo(() => {
    if (Platform.OS === 'ios') {
      return {
        themeVariant: resolvedColorScheme,
        accentColor: colors.primary,
        textColor: colors.textPrimary,
      };
    }

    return {};
  }, [
colors.primary,
colors.textPrimary,
resolvedColorScheme
]);
}

function useDatePickerStyles() {
  return useThemedStyle((theme) => createStyles(theme.colors));
}

function DatePickerUnavailableNotice() {
  const styles = useDatePickerStyles();
  return (
    <View style={styles.unavailableWrap}>
      <Text style={styles.unavailableText}>
        Date picker is not available in this build. Install native dependencies and rebuild the app.
      </Text>
    </View>
  );
}

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
  const styles = useDatePickerStyles();
  const hasError = Boolean(error);
  const cfg = sizeConfig[size];

  let borderColor: string = colors.border;
  if (hasError) borderColor = colors.error;

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
        <Text style={[
          styles.label,
          hasError && styles.labelError,
          disabled && styles.labelDisabled
        ]}>
          {label}
        </Text>
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
        <Text
          style={[
            styles.valueText,
            { fontSize: cfg.fontSize },
            !valueText && styles.placeholder,
            disabled && styles.valueDisabled,
          ]}
          numberOfLines={1}
        >
          {valueText || placeholder}
        </Text>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={disabled ? colors.textTertiary : colors.textSecondary}
        />
      </View>

      {(hasError || hint) && (
        <Text style={[styles.supportText, hasError ? styles.errorText : styles.hintText]}>
          {hasError ? error : hint}
        </Text>
      )}
    </Pressable>
  );
}

function ModalShell({
  visible,
  title,
  children,
  onCancel,
  onConfirm,
  confirmLabel = 'Done',
  confirmDisabled = false,
}: {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
}) {
  const styles = useDatePickerStyles();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <View style={styles.modalBody}>{children}</View>

          <View style={styles.modalFooter}>
            <Pressable style={styles.footerBtn} onPress={onCancel}>
              <Text style={styles.footerBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.footerBtn,
                styles.footerBtnPrimary,
                confirmDisabled && styles.footerBtnDisabled
              ]}
              disabled={confirmDisabled}
              onPress={onConfirm}
            >
              <Text style={styles.footerBtnPrimaryText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
  const styles = useDatePickerStyles();
  const nativePickerThemeProps = useNativePickerThemeProps();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(value ?? startOfToday());

  useEffect(() => {
    if (open) {
      setDraft(value ?? startOfToday());
    }
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

      <ModalShell
        visible={open}
        title={label ?? 'Select date'}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onChange(toDateOnly(draft));
          setOpen(false);
        }}
      >
        {DateTimePickerNative ? (
          <DateTimePickerNative
            value={draft}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            {...nativePickerThemeProps}
            onChange={(event, picked) => {
              if (!picked || !isDatePickerSet(event)) return;
              setDraft(picked);
            }}
            style={styles.picker}
          />
        ) : (
          <DatePickerUnavailableNotice />
        )}
      </ModalShell>
    </>
  );
}

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
  const styles = useDatePickerStyles();
  const nativePickerThemeProps = useNativePickerThemeProps();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(value ?? new Date());
  const [phase, setPhase] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (open) {
      setDraft(value ?? new Date());
      setPhase('date');
    }
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

      <ModalShell
        visible={open}
        title={label ?? 'Select date and time'}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          if (phase === 'date') {
            setPhase('time');
            return;
          }
          onChange(draft);
          setOpen(false);
        }}
        confirmLabel={phase === 'date' ? 'Next' : 'Done'}
      >
        <View style={styles.phaseTabs}>
          <Pressable
            style={[styles.phaseTab, phase === 'date' && styles.phaseTabActive]}
            onPress={() => setPhase('date')}
          >
            <Text style={[styles.phaseTabText, phase === 'date' && styles.phaseTabTextActive]}>Date</Text>
          </Pressable>
          <Pressable
            style={[styles.phaseTab, phase === 'time' && styles.phaseTabActive]}
            onPress={() => setPhase('time')}
          >
            <Text style={[styles.phaseTabText, phase === 'time' && styles.phaseTabTextActive]}>Time</Text>
          </Pressable>
        </View>

        {DateTimePickerNative ? (
          <DateTimePickerNative
            value={draft}
            mode={phase}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={phase === 'date' ? minimumDate : undefined}
            maximumDate={phase === 'date' ? maximumDate : undefined}
            {...nativePickerThemeProps}
            onChange={(event, picked) => {
              if (!picked || !isDatePickerSet(event)) return;
              setDraft(picked);
            }}
            style={styles.picker}
          />
        ) : (
          <DatePickerUnavailableNotice />
        )}
      </ModalShell>
    </>
  );
}

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
  const styles = useDatePickerStyles();
  const nativePickerThemeProps = useNativePickerThemeProps();
  const [open, setOpen] = useState(false);
  const [activeField, setActiveField] = useState<'start' | 'end'>('start');
  const [draftStart, setDraftStart] = useState<Date>(value.startDate ?? startOfToday());
  const [draftEnd, setDraftEnd] = useState<Date>(value.endDate ?? value.startDate ?? startOfToday());

  useEffect(() => {
    if (open) {
      setDraftStart(value.startDate ?? startOfToday());
      setDraftEnd(value.endDate ?? value.startDate ?? startOfToday());
      setActiveField('start');
    }
  }, [
    open,
    value.endDate,
    value.startDate
  ]);

  const displayText = useMemo(() => {
    if (!value.startDate && !value.endDate) return '';
    if (value.startDate && !value.endDate) return `${formatDate(value.startDate)} -`;
    if (!value.startDate && value.endDate) return `- ${formatDate(value.endDate)}`;
    return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
  }, [value.endDate, value.startDate]);

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

      <ModalShell
        visible={open}
        title={label ?? 'Select date range'}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          const startDate = toDateOnly(draftStart);
          const endDate = toDateOnly(draftEnd);
          onChange({
            startDate,
            endDate: endDate < startDate ? startDate : endDate,
          });
          setOpen(false);
        }}
      >
        <View style={styles.phaseTabs}>
          <Pressable
            style={[styles.phaseTab, activeField === 'start' && styles.phaseTabActive]}
            onPress={() => setActiveField('start')}
          >
            <Text style={[styles.phaseTabText, activeField === 'start' && styles.phaseTabTextActive]}>
              Start
            </Text>
          </Pressable>
          <Pressable
            style={[styles.phaseTab, activeField === 'end' && styles.phaseTabActive]}
            onPress={() => setActiveField('end')}
          >
            <Text style={[styles.phaseTabText, activeField === 'end' && styles.phaseTabTextActive]}>
              End
            </Text>
          </Pressable>
        </View>

        {DateTimePickerNative ? (
          <DateTimePickerNative
            value={activeField === 'start' ? draftStart : draftEnd}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={activeField === 'end' ? draftStart : undefined}
            {...nativePickerThemeProps}
            onChange={(event, picked) => {
              if (!picked || !isDatePickerSet(event)) return;
              if (activeField === 'start') {
                setDraftStart(picked);
                if (draftEnd < picked) setDraftEnd(picked);
              } else {
                setDraftEnd(picked);
              }
            }}
            style={styles.picker}
          />
        ) : (
          <DatePickerUnavailableNotice />
        )}

        <View style={styles.rangePreview}>
          <Text style={styles.rangePreviewText}>
            {formatDate(draftStart)} - {formatDate(draftEnd)}
          </Text>
        </View>
      </ModalShell>
    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
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
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    ...Typography.h3,
    color: colors.textPrimary,
  },
  modalBody: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  picker: {
    alignSelf: 'stretch',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  footerBtn: {
    minWidth: 92,
    height: 40,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: colors.surface,
  },
  footerBtnText: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
  },
  footerBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footerBtnDisabled: {
    opacity: 0.5,
  },
  footerBtnPrimaryText: {
    ...Typography.bodyMedium,
    color: colors.textInverse,
  },
  phaseTabs: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  phaseTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  phaseTabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  phaseTabText: {
    ...Typography.captionMedium,
    color: colors.textSecondary,
  },
  phaseTabTextActive: {
    color: colors.primary,
  },
  rangePreview: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  rangePreviewText: {
    ...Typography.captionMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  unavailableWrap: {
    paddingVertical: Spacing.lg,
  },
  unavailableText: {
    ...Typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
