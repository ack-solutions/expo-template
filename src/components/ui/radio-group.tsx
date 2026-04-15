import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

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

function RadioItem({ label, value, description, disabled = false, selected, onSelect }: RadioItemProps) {
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
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={label}
    >
      <View style={[styles.radio, selected ? styles.radioSelected : styles.radioUnselected]}>
        {selected && <View style={styles.radioDot} />}
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.label, disabled && styles.textDisabled]}>{label}</Text>
        {description && (
          <Text style={[styles.description, disabled && styles.textDisabled]}>{description}</Text>
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

const styles = StyleSheet.create({
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
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  radioSelected: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  radioDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.primary,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xxs,
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  textDisabled: {
    color: Colors.textTertiary,
  },
});
