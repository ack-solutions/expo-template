import { Spacing, Typography } from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useThemedStyle } from '@/theme/use-themed-styles';
import React from 'react';
import {
 Pressable, StyleSheet, View, ViewStyle 
} from 'react-native';

import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RadioGroupProps {
  options: RadioOption[];
  /** Currently selected value. */
  value: string;
  /** Called with the newly selected value. */
  onChange: (value: string) => void;
  /** Stack direction. Default: 'vertical' */
  direction?: 'vertical' | 'horizontal';
  style?: ViewStyle;
}

// ─── Sub-component ────────────────────────────────────────────────────────────

interface RadioItemProps extends RadioOption {
  selected: boolean;
  onSelect: () => void;
}

function RadioItem({
 label, value, description, disabled = false, selected, onSelect 
}: RadioItemProps) {
  const styles = useThemedStyle(createStyles);
  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      style={({ pressed }) => [
        styles.item,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="radio"
      accessibilityState={{
 checked: selected,
disabled 
}}
      accessibilityLabel={label}
    >
      <View style={[styles.radio, selected ? styles.radioSelected : styles.radioUnselected]}>
        {selected && <View style={styles.radioDot} />}
      </View>

      <View style={styles.textBlock}>
        <AppText style={[styles.label, disabled && styles.textDisabled]}>{label}</AppText>
        {description && (
          <AppText style={[styles.description, disabled && styles.textDisabled]}>{description}</AppText>
        )}
      </View>
    </Pressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * RadioGroup — accessible single-select option group.
 *
 * @example
 * const [plan, setPlan] = useState('monthly');
 *
 * <RadioGroup
 *   value={plan}
 *   onChange={setPlan}
 *   options={[
 *     { label: 'Monthly', value: 'monthly', description: 'Billed every month' },
 *     { label: 'Annual', value: 'annual', description: 'Save 20% with yearly billing' },
 *     { label: 'Lifetime', value: 'lifetime', disabled: true },
 *   ]}
 * />
 */
export function RadioGroup({
  options,
  value,
  onChange,
  direction = 'vertical',
  style,
}: RadioGroupProps) {
  const styles = useThemedStyle(createStyles);
  return (
    <View
      style={[
        styles.group,
        direction === 'horizontal' && styles.groupHorizontal,
        style,
      ]}
      accessibilityRole="radiogroup"
    >
      {options.map((option) => (
        <RadioItem
          key={option.value}
          {...option}
          selected={option.value === value}
          onSelect={() => !option.disabled && onChange(option.value)}
        />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const RADIO_SIZE = 20;
const DOT_SIZE = 10;

const createStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
  group: {
    gap: Spacing.md,
  },
  groupHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  radio: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  radioUnselected: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  radioSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  radioDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.primary,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xxs,
  },
  label: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
  },
  description: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  textDisabled: {
    color: colors.textTertiary,
  },
  });
