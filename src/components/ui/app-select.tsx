import {
 Radii, Shadows, Spacing, Typography
} from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, {
 useCallback, useEffect, useMemo, useState 
} from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardEvent,
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
import { AppText } from './app-text';
import { SearchBar } from './search-bar';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
  /** Optional secondary text shown below the label. */
  description?: string;
  disabled?: boolean;
}

export type SelectVariant = 'outlined' | 'filled';
export type SelectSize = 'sm' | 'md' | 'lg';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppSelectProps {
  /** Available options. */
  options: SelectOption[];
  /** Currently selected value. */
  value?: string;
  /** Called when the user selects an option. */
  onChange: (option: SelectOption) => void;
  /** Label shown above the trigger field. */
  label?: string;
  /** Placeholder shown when no option is selected. */
  placeholder?: string;
  /** Error message — puts the trigger in error state. */
  error?: string;
  /** Helper text shown below the trigger (hidden when error is present). */
  hint?: string;
  /** Visual variant. Default: `'outlined'` */
  variant?: SelectVariant;
  /**
   * Size. Default: `'md'`
   * sm → 40 pt · md → 48 pt · lg → 56 pt
   */
  size?: SelectSize;
  disabled?: boolean;
  /**
   * Show a search bar inside the picker.
   * Defaults to `true` when `options.length > 5`.
   */
  searchable?: boolean;
  /** Title displayed at the top of the picker. Falls back to `label`. */
  sheetTitle?: string;
  /** Placeholder for the search bar. Default: `'Search…'` */
  searchPlaceholder?: string;
  /**
   * How the picker opens.
   * - `'sheet'`  — slides up from the bottom (default)
   * - `'dialog'` — appears as a centered modal with scale animation
   */
  mode?: 'sheet' | 'dialog';
  containerStyle?: ViewStyle;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WINDOW_H = Dimensions.get('window').height;
const MAX_SHEET_HEIGHT = Math.round(WINDOW_H * 0.72);

const SPRING_SHEET = {
 damping: 28,
stiffness: 320,
mass: 0.8 
};
const SPRING_DIALOG = {
 damping: 20,
stiffness: 300,
mass: 0.7 
};

const sizeConfig: Record<SelectSize, { height: number; fontSize: number }> = {
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

function useKeyboardHeight(enabled: boolean) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setKeyboardHeight(0);
      return;
    }

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardHeight(Math.max(0, event.endCoordinates.height));
    };

    const handleKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled]);

  return keyboardHeight;
}

// ─── OptionRow ────────────────────────────────────────────────────────────────

function OptionRow({
  option,
  selected,
  onPress,
}: {
  option: SelectOption;
  selected: boolean;
  onPress: (o: SelectOption) => void;
}) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle(createStyles);

  return (
    <Pressable
      onPress={() => onPress(option)}
      disabled={option.disabled}
      style={({ pressed }) => [
        styles.optionRow,
        pressed && !option.disabled && styles.optionPressed,
        option.disabled && styles.optionDisabled,
      ]}
      accessibilityRole="menuitem"
      accessibilityState={{
 selected,
disabled: option.disabled 
}}
    >
      <View style={styles.optionText}>
        <AppText
          style={[styles.optionLabel, selected && styles.optionLabelSelected]}
          numberOfLines={1}
        >
          {option.label}
        </AppText>
        {option.description && (
          <AppText style={styles.optionDescription} numberOfLines={2}>
            {option.description}
          </AppText>
        )}
      </View>

      {selected && (
        <Ionicons
name="checkmark"
size={18}
color={colors.primary}
style={styles.optionCheck} />
      )}
    </Pressable>
  );
}

// ─── SelectBody (shared content) ─────────────────────────────────────────────

interface SelectBodyProps {
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (option: SelectOption) => void;
  onClose: () => void;
  searchable: boolean;
  searchPlaceholder: string;
  /** Render the drag-handle strip above the header (sheet mode only). */
  showHandle?: boolean;
  query: string;
  onQueryChange: (q: string) => void;
}

function SelectBody({
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  searchable,
  searchPlaceholder,
  showHandle = false,
  query,
  onQueryChange,
}: SelectBodyProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle(createStyles);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const lower = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(lower) ||
        o.description?.toLowerCase().includes(lower),
    );
  }, [options, query]);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (!option.disabled) onSelect(option);
    },
    [onSelect],
  );

  return (
    <>
      {showHandle && <View style={styles.handle} />}

      {/* Header */}
      <View style={styles.pickerHeader}>
        <AppText style={styles.pickerTitle} numberOfLines={1}>
          {title}
        </AppText>
        <Pressable
          onPress={onClose}
          hitSlop={{
 top: 10,
bottom: 10,
left: 10,
right: 10 
}}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons
name="close"
size={20}
color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Search */}
      {searchable && (
        <View style={styles.searchWrap}>
          <SearchBar
            value={query}
            onChangeText={onQueryChange}
            placeholder={searchPlaceholder}
            onClear={() => onQueryChange('')}
            autoFocus={false}
          />
        </View>
      )}

      {/* Options */}
      <FlatList
        data={filteredOptions}
        keyExtractor={(item) => item.value}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons
              name="search-outline"
              size={32}
              color={colors.textTertiary}
              style={styles.emptyIcon}
            />
            <AppText style={styles.emptyTitle}>No results</AppText>
            <AppText style={styles.emptyDesc}>Nothing matched &ldquo;{query}&rdquo;</AppText>
          </View>
        }
        renderItem={({ item }) => (
          <OptionRow
            option={item}
            selected={item.value === selectedValue}
            onPress={handleSelect}
          />
        )}
      />
    </>
  );
}

// ─── Internal picker props ────────────────────────────────────────────────────

interface PickerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (option: SelectOption) => void;
  searchable: boolean;
  searchPlaceholder: string;
}

// ─── SelectSheet (bottom sheet) ───────────────────────────────────────────────

function SelectSheet({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  searchable,
  searchPlaceholder,
}: PickerProps) {
  const styles = useThemedStyle(createStyles);
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Spacing.lg);

  const [rendered, setRendered] = useState(visible);
  const [query, setQuery] = useState('');
  const keyboardHeight = useKeyboardHeight(rendered);
  const keyboardInset = Math.max(0, keyboardHeight - insets.bottom);
  const sheetMaxHeight = Math.max(
    260,
    Math.min(MAX_SHEET_HEIGHT, WINDOW_H - insets.top - keyboardInset - Spacing.lg),
  );

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(MAX_SHEET_HEIGHT);

  useEffect(() => {
    if (visible) setRendered(true);
  }, [visible]);

  useEffect(() => {
    if (!rendered) return;

    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, SPRING_SHEET);
    } else {
      setQuery('');
      Keyboard.dismiss();
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(MAX_SHEET_HEIGHT, { duration: 260 }, (finished) => {
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
      <View style={styles.kav}>
        <View style={styles.sheetOverlay} pointerEvents="box-none">
          {/* Backdrop — visual only, no touch handling */}
          <Animated.View
            style={[
StyleSheet.absoluteFill,
styles.backdrop,
animBackdrop
]}
            pointerEvents="none"
          />
          {/* Dismiss area — full screen, behind the sheet */}
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

          {/* Sheet — above the dismiss Pressable in z-order */}
          <Animated.View
            style={[
              styles.sheet,
              {
                paddingBottom: bottomPad,
                marginBottom: keyboardInset,
                maxHeight: sheetMaxHeight,
              },
              Shadows.xl,
              animSheet,
            ]}
          >
            <SelectBody
              title={title}
              options={options}
              selectedValue={selectedValue}
              onSelect={onSelect}
              onClose={onClose}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              showHandle
              query={query}
              onQueryChange={setQuery}
            />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

// ─── SelectDialog (centered modal) ───────────────────────────────────────────

function SelectDialog({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  searchable,
  searchPlaceholder,
}: PickerProps) {
  const styles = useThemedStyle(createStyles);
  const insets = useSafeAreaInsets();
  const [rendered, setRendered] = useState(visible);
  const [query, setQuery] = useState('');
  const keyboardHeight = useKeyboardHeight(rendered);
  const keyboardInset = Math.max(0, keyboardHeight - insets.bottom);
  const dialogMaxHeight = Math.max(
    260,
    Math.min(
      MAX_SHEET_HEIGHT,
      WINDOW_H - insets.top - insets.bottom - keyboardInset - Spacing.xl * 2,
    ),
  );

  const backdropOpacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) setRendered(true);
  }, [visible]);

  useEffect(() => {
    if (!rendered) return;

    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 220 });
      scale.value = withSpring(1, SPRING_DIALOG);
      opacity.value = withTiming(1, { duration: 180 });
    } else {
      setQuery('');
      Keyboard.dismiss();
      backdropOpacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.92, { duration: 180 });
      opacity.value = withTiming(0, { duration: 180 }, (finished) => {
        if (finished) setRendered(false);
      });
    }
  }, [
backdropOpacity,
opacity,
rendered,
scale,
visible
]);

  const animBackdrop = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const animDialog = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
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
      <View
        style={[
          styles.kav,
          {
            paddingBottom: keyboardInset,
          },
        ]}
      >
        <View style={styles.dialogOverlay} pointerEvents="box-none">
          {/* Backdrop */}
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

          {/* Dialog card */}
          <Animated.View style={[
styles.dialog,
{ maxHeight: dialogMaxHeight },
Shadows.xl,
animDialog
]}>
            <SelectBody
              title={title}
              options={options}
              selectedValue={selectedValue}
              onSelect={onSelect}
              onClose={onClose}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              query={query}
              onQueryChange={setQuery}
            />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

// ─── AppSelect ────────────────────────────────────────────────────────────────

/**
 * AppSelect — styled select field that opens a searchable picker.
 *
 * The trigger looks identical to `AppInput`. Two picker styles are available
 * via the `mode` prop:
 * - `'sheet'` (default) — spring slide-up bottom sheet
 * - `'dialog'` — centered modal with scale + opacity animation
 *
 * The search bar inside the picker is automatically keyboard-safe: results
 * stay visible above the keyboard on both iOS and Android.
 *
 * @example
 * // Basic
 * const [country, setCountry] = useState('');
 * <AppSelect
 *   label="Country"
 *   value={country}
 *   onChange={(opt) => setCountry(opt.value)}
 *   options={countryOptions}
 * />
 *
 * // Dialog mode
 * <AppSelect
 *   label="Category"
 *   mode="dialog"
 *   value={watch('category')}
 *   onChange={(opt) => setValue('category', opt.value)}
 *   options={categories}
 *   error={errors.category?.message}
 * />
 *
 * // Large searchable list
 * <AppSelect
 *   label="Timezone"
 *   value={tz}
 *   onChange={(opt) => setTz(opt.value)}
 *   options={timezones}
 *   searchable
 *   searchPlaceholder="Search timezones…"
 *   sheetTitle="Select timezone"
 * />
 */
export function AppSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  hint,
  variant = 'outlined',
  size = 'md',
  disabled = false,
  searchable,
  sheetTitle,
  searchPlaceholder = 'Search…',
  mode = 'sheet',
  containerStyle,
}: AppSelectProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle(createStyles);
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasError = Boolean(error);
  const cfg = sizeConfig[size];
  const selectedOption = options.find((o) => o.value === value);
  const isSearchable = searchable ?? options.length > 5;

  let borderColor: string = colors.border;
  if (hasError) borderColor = colors.error;
  else if (pickerOpen) borderColor = colors.primary;

  const fieldBg = disabled
    ? colors.borderLight
    : variant === 'filled'
    ? colors.primaryFaded
    : colors.surface;

  function handleOpen() {
    if (!disabled) setPickerOpen(true);
  }

  function handleSelect(option: SelectOption) {
    onChange(option);
    setPickerOpen(false);
  }

  const pickerProps: PickerProps = {
    visible: pickerOpen,
    onClose: () => setPickerOpen(false),
    title: sheetTitle ?? label ?? 'Select',
    options,
    selectedValue: value,
    onSelect: handleSelect,
    searchable: isSearchable,
    searchPlaceholder,
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        style={[styles.container, containerStyle]}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{
 disabled,
expanded: pickerOpen 
}}
        accessibilityLabel={label}
      >
        {/* Label */}
        {label && (
          <AppText
            style={[
              styles.label,
              pickerOpen && !hasError && styles.labelOpen,
              hasError && styles.labelError,
              disabled && styles.labelDisabled,
            ]}
          >
            {label}
          </AppText>
        )}

        {/* Trigger field */}
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
              !selectedOption && styles.placeholder,
              disabled && styles.valueDisabled,
            ]}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </AppText>

          <Ionicons
            name={pickerOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={disabled ? colors.textTertiary : colors.textSecondary}
            style={styles.chevron}
          />
        </View>

        {/* Support text */}
        {(hasError || hint) && (
          <AppText style={[styles.supportText, hasError ? styles.errorText : styles.hintText]}>
            {hasError ? error : hint}
          </AppText>
        )}
      </Pressable>

      {mode === 'dialog' ? (
        <SelectDialog {...pickerProps} />
      ) : (
        <SelectSheet {...pickerProps} />
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = ({ colors }: AppTheme) => StyleSheet.create({
  // ── Trigger ──
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.captionMedium,
    color: colors.textSecondary,
  },
  labelOpen: {
    color: colors.primary,
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
  chevron: {
    marginLeft: Spacing.xs,
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

  // ── Shared ──
  kav: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: colors.overlay,
  },

  // ── Sheet ──
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: MAX_SHEET_HEIGHT,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 560,
  },

  // ── Dialog ──
  dialogOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: Radii.xl,
    maxHeight: MAX_SHEET_HEIGHT,
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden',
  },

  // ── Handle ──
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },

  // ── Picker header ──
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
    backgroundColor: colors.borderLight,
    marginLeft: Spacing.sm,
  },
  searchWrap: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },

  // ── Options ──
  list: {
    flexGrow: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  optionPressed: {
    backgroundColor: colors.primaryFaded,
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  optionLabel: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  optionDescription: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  optionCheck: {
    marginLeft: Spacing.md,
    flexShrink: 0,
  },

  // ── Empty state ──
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    ...Typography.h3,
    color: colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyDesc: {
    ...Typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
