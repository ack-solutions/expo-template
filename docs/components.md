# Component Library

All shared UI components live in `src/components/ui/` and are exported from the barrel file `src/components/ui/index.ts`.

Import any component from the single entry point:

```tsx
import { Button, AppInput, Badge, Avatar } from '@/components/ui';
```

A live visual reference for every component is available on the **UI Kit** tab in the running app (`src/app/(tabs)/components.tsx`).

---

## Design Principles

| Principle | Rule |
|-----------|------|
| Variant + color separation | `variant` = visual style (contained/outlined/soft/ghost); `color` = semantic meaning (primary/danger/success…). Never mix them in a single prop. |
| Token-only styling | Colors, spacing, radii come exclusively from `src/constants/theme.ts` |
| No hardcoded strings | Labels and placeholder text always come from props |
| Composable | Components accept `children`, slot props (`left`, `right`), and `style` overrides |
| Accessible | `accessibilityRole` and `accessibilityState` are set on every interactive element |
| No emoji | Use icon components (`@expo/vector-icons/Ionicons`) instead |
| Touch targets | Interactive components meet the 44 pt minimum (Apple HIG / Material Design) |
| Smooth animations | Animations use Reanimated spring/timing — never janky or skipped |

---

## Animation System

All animations use **react-native-reanimated** (v4). Never use the legacy `react-native` `Animated` API for new interactive components.

### Animation constants (copy-paste for new components)

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

// Spring — for physical press/scale feedback
const SPRING = { damping: 18, stiffness: 280, mass: 0.6 };

// Timing — for color transitions (focus, selection)
const TIMING = { duration: 180 };
```

### Patterns used across the library

| Interaction | Animation | Components |
|-------------|-----------|------------|
| Button press | scale 1 → 0.96 via `withSpring` | `Button` |
| Card press | scale 1 → 0.975 via `withSpring` | `AppPressableCard` |
| Chip press | scale 1 → 0.93 via `withSpring` | `Chip` |
| Checkbox toggle | box background + icon scale via `withTiming` / `withSpring` | `AppCheckbox` |
| Input focus | border color + label color via `interpolateColor` + `withTiming` | `AppInput` |
| SearchBar focus | background + border color via `interpolateColor` | `SearchBar` |

### Rules

- Use `withSpring` for press/release — gives physical, tactile feel.
- Use `withTiming` + `interpolateColor` for state color changes (focus, selection).
- Always use native driver (`useNativeDriver` is implicit in Reanimated — transform/opacity run on UI thread).
- Color animations (`interpolateColor`) run on the JS thread but are smooth enough for state transitions.
- Do not animate if the result looks worse than no animation. Keep it or skip it — no compromises.

---

## Touch Target Standard

All interactive components meet the **44 pt minimum touch target** guideline.

| Component | Touch Height |
|-----------|-------------|
| `Button sm` | 40 pt |
| `Button md` | 48 pt (default) |
| `Button lg` | 56 pt |
| `AppInput sm` | 40 pt |
| `AppInput md` | 48 pt (default) |
| `AppInput lg` | 56 pt |
| `SearchBar` | 48 pt |
| `AppCheckbox` row | 44 pt min |
| `AppSwitch` row | 44 pt min |
| `AppSelect sm` | 40 pt |
| `AppSelect md` | 48 pt (default) |
| `AppSelect lg` | 56 pt |
| `AppDatePicker sm` | 40 pt |
| `AppDatePicker md` | 48 pt (default) |
| `AppDatePicker lg` | 56 pt |
| `ListItem` row | 52 pt min |
| `Chip sm` | 32 pt |
| `Chip md` | 36 pt |

---

## Component Index

| Component | File | Category |
|-----------|------|----------|
| [Stack / VStack / HStack](#stack--vstack--hstack) | `stack.tsx` | Layout |
| [AppText](#apptext) | `app-text.tsx` | Typography |
| [Button](#button) | `button.tsx` | Actions |
| [AppInput](#appinput) | `app-input.tsx` | Forms |
| [AppSelect](#appselect) | `app-select.tsx` | Forms |
| [AppDatePicker / AppDateTimePicker / AppDateRangePicker](#appdatepicker--appdatetimepicker--appdaterangepicker) | `app-date-picker.tsx` | Forms |
| [SearchBar](#searchbar) | `search-bar.tsx` | Forms |
| [AppCheckbox](#appcheckbox) | `app-checkbox.tsx` | Forms |
| [AppSwitch](#appswitch) | `app-switch.tsx` | Forms |
| [RadioGroup](#radiogroup) | `radio-group.tsx` | Forms |
| [Badge](#badge) | `badge.tsx` | Data Display |
| [Avatar](#avatar) | `avatar.tsx` | Data Display |
| [Chip](#chip) | `chip.tsx` | Data Display |
| [Divider](#divider) | `divider.tsx` | Layout |
| [AppCard / AppPressableCard / CardHeader](#cards) | `card.tsx` | Layout |
| [ListItem](#listitem) | `list-item.tsx` | Layout |
| [Container](#container) | `container.tsx` | Screen |
| [SafeScreen](#safescreen) | `safe-screen.tsx` | Screen |
| [Toolbar](#toolbar) | `toolbar.tsx` | Screen |
| [ProgressBar](#progressbar) | `progress-bar.tsx` | Feedback |
| [Skeleton / SkeletonText / SkeletonCard](#skeleton) | `skeleton.tsx` | Feedback |
| [EmptyState](#emptystate) | `empty-state.tsx` | Feedback |
| [ConfirmDialog](#confirmdialog) | `confirm-dialog.tsx` | Overlays |
| [FeedbackDialog](#feedbackdialog) | `feedback-dialog.tsx` | Overlays |
| [ActionSheet / ActionSheetRow](#actionsheet) | `action-sheet.tsx` | Overlays |

---

## Stack / VStack / HStack

Layout primitives for consistent, token-based spacing. Replace ad-hoc `gap`, `flexDirection`, and `marginBottom` patterns.

- `Stack` — vertical by default (alias of `VStack`)
- `VStack` — explicit vertical stack
- `HStack` — horizontal stack

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'column'` | `'column'` | Layout axis (`Stack`/`VStack` only) |
| `gap` | `number \| SpacingKey` | `'md'` (10) | Gap between children |
| `align` | `FlexAlignType` | `'stretch'` (Stack/VStack) · `'flex-start'` (HStack) | Cross-axis alignment (`alignItems`) |
| `justify` | `JustifyContent` | `'flex-start'` | Main-axis distribution (`justifyContent`) |
| `wrap` | `boolean` | `false` | Allow children to wrap (`flexWrap`) |
| `flex` | `number` | — | `flex` value on the container |
| `padding` | `number \| SpacingKey` | — | Padding on all sides |
| `paddingH` | `number \| SpacingKey` | — | Horizontal padding (overrides `padding`) |
| `paddingV` | `number \| SpacingKey` | — | Vertical padding (overrides `padding`) |
| `style` | `ViewStyle` | — | Style override |

`SpacingKey` = `'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'huge' | 'massive'`

### Example

```tsx
// Form fields — vertical with large gap
<Stack gap="lg">
  <AppInput label="First name" value={name} onChangeText={setName} />
  <AppInput label="Last name" value={last} onChangeText={setLast} />
  <Button title="Submit" onPress={handleSubmit} fullWidth />
</Stack>

// Label + value row
<HStack justify="space-between" align="center">
  <AppText variant="body" color="secondary">Status</AppText>
  <Badge label="Active" color="success" />
</HStack>

// Icon + text inline
<HStack gap="sm" align="center">
  <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
  <AppText variant="bodyMedium">Verified</AppText>
</HStack>

// Full-height centered section
<Stack flex={1} justify="center" align="center" padding="xxl" gap="xl">
  <EmptyState title="No data" description="Add your first item." />
</Stack>

// Two-button row
<HStack gap="sm">
  <Button title="Cancel" variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
  <Button title="Save" variant="contained" onPress={onSave} style={{ flex: 1 }} />
</HStack>

// Wrapping chip row
<HStack gap="sm" wrap>
  {tags.map((tag) => <Chip key={tag} label={tag} />)}
</HStack>
```

---

## AppText

Variant-based typography component. Always use this instead of raw `<Text>` to guarantee type scale consistency.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `TextVariant` | `'body'` | Typography scale |
| `color` | `TextColor` | `'primary'` | Semantic color token |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `children` | `ReactNode` | — | Text content |
| `style` | `StyleProp<TextStyle>` | — | Style override (accepts arrays and conditional styles) |
| `numberOfLines` | `number` | — | Line clamp |
| `nowrap` | `boolean` | `false` | Prevent wrapping |

### Variants (`TextVariant`)

`hero` · `displayLarge` · `h1` · `h2` · `h3` · `body` · `bodyMedium` · `bodySemibold` · `caption` · `captionMedium` · `small` · `smallMedium`

### Colors (`TextColor`)

`primary` · `secondary` · `tertiary` · `inverse` · `error` · `success` · `warning` · `accent`

### Example

```tsx
<AppText variant="h2" color="primary">Section Title</AppText>
<AppText variant="body" color="secondary">Supporting paragraph text</AppText>
<AppText variant="caption" color="tertiary" align="center">Helper text</AppText>
<AppText variant="body" color="error">Validation message</AppText>
```

---

## Button

Primary action component. `variant` controls the visual style; `color` controls the semantic meaning. Icon `size` and `color` are injected automatically — no need to pass them.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Button label |
| `onPress` | `() => void` | — | Tap handler |
| `variant` | `ButtonVariant` | `'contained'` | Visual style |
| `color` | `ButtonColor` | `'primary'` | Semantic color |
| `size` | `ButtonSize` | `'md'` | Size |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `startIcon` | `ReactNode` | — | Icon before the label (size + color auto-injected) |
| `endIcon` | `ReactNode` | — | Icon after the label (size + color auto-injected) |
| `fullWidth` | `boolean` | `false` | Stretches to container width |
| `style` | `ViewStyle` | — | Container style override |
| `textStyle` | `TextStyle` | — | Label style override |

### Variants (`ButtonVariant`)

| Variant | Description |
|---------|-------------|
| `contained` | Solid filled background — main CTA |
| `outlined` | Transparent background with border |
| `soft` | Faded/tinted background, no border |
| `ghost` | Fully transparent, no border — text only |

### Colors (`ButtonColor`)

| Color | Use case |
|-------|----------|
| `primary` | Brand action (default) |
| `secondary` | Neutral secondary action |
| `danger` | Destructive actions (delete, remove) |
| `success` | Confirmation or positive action |
| `warning` | Caution or irreversible action |
| `neutral` | Low-emphasis action |

### Sizes (`ButtonSize`)

| Size | Min height | Use case |
|------|------------|----------|
| `sm` | 40 pt | Toolbars, table rows |
| `md` | 48 pt (default) | Standard buttons |
| `lg` | 56 pt | Prominent CTAs |

### Icon auto-sizing

Icons passed via `startIcon` / `endIcon` automatically receive `size` and `color` props via `React.cloneElement`. Pass the icon node without any props:

```tsx
startIcon={<Ionicons name="add" />}   // size and color injected automatically
```

Icon sizes: `sm=14 · md=16 · lg=18`

### Example

```tsx
// Main CTA
<Button title="Save" onPress={handleSave} />

// Destructive
<Button title="Delete" onPress={handleDelete} variant="contained" color="danger" />

// Soft secondary
<Button title="Cancel" onPress={handleCancel} variant="soft" />

// Outlined
<Button title="Learn more" onPress={handleMore} variant="outlined" />

// Ghost
<Button title="Skip" onPress={handleSkip} variant="ghost" />

// With icons — size and color are auto-injected
<Button
  title="Add item"
  startIcon={<Ionicons name="add" />}
  endIcon={<Ionicons name="chevron-forward" />}
  onPress={handleAdd}
  fullWidth
/>

// Loading state
<Button title="Saving…" loading onPress={() => {}} />
```

---

## AppInput

Labeled text input with variants, validation states, and icon slots.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Floating label |
| `value` | `string` | — | Controlled value |
| `onChangeText` | `(text: string) => void` | — | Change handler |
| `variant` | `InputVariant` | `'outlined'` | Visual style |
| `size` | `InputSize` | `'md'` | Height/font size |
| `error` | `string` | — | Error message (puts field in error state) |
| `hint` | `string` | — | Helper text below field |
| `leftSlot` | `ReactNode` | — | Node rendered at the leading edge |
| `rightSlot` | `ReactNode` | — | Node rendered at the trailing edge |
| `containerStyle` | `ViewStyle` | — | Outer container style |
| `editable` | `boolean` | `true` | Set `false` to disable |
| _`...TextInputProps`_ | — | — | All standard TextInput props are forwarded |

### Variants (`InputVariant`)

| Variant | Description |
|---------|-------------|
| `outlined` | Bordered field with white background |
| `filled` | Lightly tinted background, no border (except bottom accent) |

### Example

```tsx
// Basic controlled input
<AppInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="user@example.com"
  keyboardType="email-address"
/>

// With error (from React Hook Form + Zod)
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
});
<AppInput
  label="Password"
  secureTextEntry
  error={form.formState.errors.password?.message}
  value={pw}
  onChangeText={setPw}
/>

// With icon slots
<AppInput
  label="Amount"
  variant="filled"
  leftSlot={<AppText variant="body" color="tertiary">$</AppText>}
  rightSlot={<Ionicons name="calculator-outline" size={18} color={Colors.textTertiary} />}
  keyboardType="decimal-pad"
  value={amount}
  onChangeText={setAmount}
/>
```

---

## AppSelect

Styled select field that opens a searchable picker. The trigger is visually identical to `AppInput` (same label, error, hint, variant, size system).

- `mode="sheet"` (default) — slides up from the bottom with a Reanimated spring; backdrop fades in.
- `mode="dialog"` — centered modal with scale + fade animation (useful for tablets or short option lists).
- `searchable` shows a `SearchBar` inside the sheet for filtering options.
  Auto-enabled when `options.length > 5`.
- Empty-state is shown when the search query returns no results.
- Option rows are 52 pt tall (touch-target compliant).
- Chevron icon indicates open/closed state.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | — | All available options |
| `value` | `string` | — | Currently selected value |
| `onChange` | `(option: SelectOption) => void` | — | Called with the full option object on select |
| `label` | `string` | — | Label above the trigger |
| `placeholder` | `string` | `'Select an option'` | Shown when no value is selected |
| `error` | `string` | — | Error message (puts field in error state) |
| `hint` | `string` | — | Helper text below field |
| `variant` | `SelectVariant` | `'outlined'` | Visual style of the trigger |
| `size` | `SelectSize` | `'md'` | Height of the trigger (40 / 48 / 56 pt) |
| `disabled` | `boolean` | `false` | Prevents opening the sheet |
| `mode` | `'sheet' \| 'dialog'` | `'sheet'` | Presentation style — bottom sheet or centered dialog |
| `searchable` | `boolean` | auto (`options.length > 5`) | Show search bar in the sheet |
| `sheetTitle` | `string` | falls back to `label` | Title shown at the top of the sheet |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder for the search bar |
| `containerStyle` | `ViewStyle` | — | Outer container style override |

### `SelectOption`

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display text |
| `value` | `string` | Unique identifier stored on selection |
| `description` | `string` | Optional secondary text shown below the label |
| `disabled` | `boolean` | Dims the row and prevents selection |

### Example

```tsx
// Basic — auto search disabled (4 options)
const [priority, setPriority] = useState('');

<AppSelect
  label="Priority"
  value={priority}
  onChange={(opt) => setPriority(opt.value)}
  placeholder="Choose priority"
  options={[
    { label: 'Low',      value: 'low',      description: 'Handle when possible' },
    { label: 'Medium',   value: 'medium',   description: 'Normal priority' },
    { label: 'High',     value: 'high',     description: 'Address soon' },
    { label: 'Critical', value: 'critical', description: 'Drop everything' },
  ]}
/>

// Large searchable list — search bar auto-enabled (> 5 options)
<AppSelect
  label="Timezone"
  value={tz}
  onChange={(opt) => setTz(opt.value)}
  placeholder="Select timezone"
  searchPlaceholder="Search timezones…"
  sheetTitle="Select timezone"
  options={timezoneOptions}   // can be hundreds of options
/>

// With React Hook Form + Zod
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
});

<AppSelect
  label="Category"
  value={form.watch('category')}
  onChange={(opt) => form.setValue('category', opt.value, { shouldValidate: true })}
  error={form.formState.errors.category?.message}
  options={categoryOptions}
/>

// Filled variant, lg size
<AppSelect
  label="Status"
  variant="filled"
  size="lg"
  value={status}
  onChange={(opt) => setStatus(opt.value)}
  options={statusOptions}
/>
```

---

## AppDatePicker / AppDateTimePicker / AppDateRangePicker

Themed date picker fields backed by [`react-native-ui-datepicker`](https://github.com/farhoudshapouran/react-native-ui-datepicker) — a pure-JS calendar with full light/dark theme support. No native rebuild required.

- Trigger field is visually identical to `AppInput` (same label, error, hint, variant, size system).
- Tapping the field opens a bottom sheet with a calendar grid.
- All calendar colors are driven by the app's design tokens (`colors.primary`, `colors.textPrimary`, etc.) via `useAppTheme()`.
- Automatically adapts to light and dark mode.
- Sheet slides up with a Reanimated spring; backdrop fades in.

### AppDatePicker — single date

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | — | Controlled selected date |
| `onChange` | `(value: Date) => void` | — | Called when the user confirms a date |
| `label` | `string` | — | Label above the trigger |
| `placeholder` | `string` | `'Select date'` | Shown when no date is selected |
| `error` | `string` | — | Error message (puts field in error state) |
| `hint` | `string` | — | Helper text below field |
| `variant` | `PickerVariant` | `'outlined'` | Visual style of the trigger (`'outlined'` \| `'filled'`) |
| `size` | `PickerSize` | `'md'` | Height of the trigger (`'sm'` \| `'md'` \| `'lg'`) |
| `disabled` | `boolean` | `false` | Prevents opening the picker |
| `minimumDate` | `Date` | — | Earliest selectable date |
| `maximumDate` | `Date` | — | Latest selectable date |
| `containerStyle` | `ViewStyle` | — | Outer container style override |

### AppDateTimePicker — date + time

Same props as `AppDatePicker`. Shows a calendar and a time-wheel picker in the same sheet.

### AppDateRangePicker — date range

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `{ startDate: Date \| null; endDate: Date \| null }` | — | Controlled range |
| `onChange` | `(value: DateRangeValue) => void` | — | Called when the user confirms a range |
| _…same as AppDatePicker_ | | | (without `minimumDate` / `maximumDate`) |

### Example

```tsx
// Single date
const [date, setDate] = useState<Date | null>(null);

<AppDatePicker
  label="Start Date"
  value={date}
  onChange={setDate}
  placeholder="Select a date"
  minimumDate={new Date()}
/>

// Date + time
<AppDateTimePicker
  label="Appointment"
  value={datetime}
  onChange={setDatetime}
  error={errors.datetime?.message}
/>

// Date range
const [range, setRange] = useState({ startDate: null, endDate: null });

<AppDateRangePicker
  label="Booking Period"
  value={range}
  onChange={setRange}
  hint="Select check-in and check-out dates"
/>

// With React Hook Form + Zod
<AppDatePicker
  label="Due Date"
  value={form.watch('dueDate')}
  onChange={(date) => form.setValue('dueDate', date, { shouldValidate: true })}
  error={form.formState.errors.dueDate?.message}
/>
```

---

## SearchBar

Pre-styled search input with leading search icon and clear button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `onChangeText` | `(text: string) => void` | — | Change handler |
| `onClear` | `() => void` | — | Called when clear button is tapped |
| `placeholder` | `string` | — | Placeholder text |
| `style` | `ViewStyle` | — | Container style override |
| _`...TextInputProps`_ | — | — | All standard TextInput props are forwarded |

### Example

```tsx
const [query, setQuery] = useState('');

<SearchBar
  value={query}
  onChangeText={setQuery}
  placeholder="Search items…"
  onClear={() => setQuery('')}
/>
```

---

## AppCheckbox

Accessible checkbox with optional label and description.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | Checked state |
| `onPress` | `() => void` | — | Toggle handler |
| `label` | `string` | — | Primary label |
| `description` | `string` | — | Supporting text below label |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `indeterminate` | `boolean` | `false` | Shows dash for partial selection |
| `style` | `ViewStyle` | — | Row style override |

### Example

```tsx
const [agreed, setAgreed] = useState(false);

<AppCheckbox
  checked={agreed}
  onPress={() => setAgreed(!agreed)}
  label="I agree to the terms and conditions"
  description="By checking this box you confirm you have read the terms"
/>
```

---

## AppSwitch

Labeled toggle that wraps the native `Switch` control. Tapping anywhere in the row toggles the switch.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `boolean` | — | On/off state |
| `onValueChange` | `(value: boolean) => void` | — | Toggle handler |
| `label` | `string` | — | Primary label |
| `description` | `string` | — | Supporting text below label |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `switchSide` | `'left' \| 'right'` | `'right'` | Position of the toggle |
| `style` | `ViewStyle` | — | Row style override |

### Example

```tsx
<AppSwitch
  value={notificationsEnabled}
  onValueChange={setNotificationsEnabled}
  label="Push notifications"
  description="Receive alerts for new activity"
/>
```

---

## RadioGroup

Single-select group of radio options.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `RadioOption[]` | — | Array of options |
| `value` | `string` | — | Selected value |
| `onChange` | `(value: string) => void` | — | Selection handler |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout axis |
| `style` | `ViewStyle` | — | Container style override |

### `RadioOption`

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Display text |
| `value` | `string` | Option identifier |
| `description` | `string` | Supporting text (optional) |
| `disabled` | `boolean` | Disables this option only (optional) |

### Example

```tsx
const [plan, setPlan] = useState('monthly');

<RadioGroup
  value={plan}
  onChange={setPlan}
  options={[
    { label: 'Monthly', value: 'monthly', description: 'Billed every month' },
    { label: 'Annual', value: 'annual', description: 'Save 20% — billed yearly' },
    { label: 'Lifetime', value: 'lifetime', disabled: true },
  ]}
/>
```

---

## Badge

Compact status indicator. `variant` controls visual style; `color` controls semantic meaning.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Display text |
| `variant` | `BadgeVariant` | `'soft'` | Visual style |
| `color` | `BadgeColor` | `'neutral'` | Semantic color |
| `size` | `BadgeSize` | `'md'` | Size |
| `dot` | `boolean` | `false` | Render as a small colored dot (no text) |
| `style` | `ViewStyle` | — | Container style override |

### Variants (`BadgeVariant`)

| Variant | Description |
|---------|-------------|
| `soft` | Faded background, colored text (default) |
| `filled` | Solid background, inverse text |
| `outlined` | Transparent background, colored border + text |

### Colors (`BadgeColor`)

`primary` · `success` · `error` · `warning` · `neutral`

### Example

```tsx
// Soft (default)
<Badge label="Active" color="success" />
<Badge label="3 new" color="error" size="sm" />

// Filled
<Badge label="Beta" variant="filled" color="primary" />

// Outlined
<Badge label="Pending" variant="outlined" color="warning" />

// Notification dot
<Badge label="" color="error" dot />
```

---

## Avatar

Displays a user image or derives initials from a name. Initials get a stable color derived from the name string.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | — | Image URI |
| `name` | `string` | `''` | Full name for initials fallback |
| `size` | `AvatarSize` | `'md'` | Dimension variant |
| `shape` | `AvatarShape` | `'circle'` | Shape variant |
| `style` | `ViewStyle` | — | Container style override |

### Sizes (`AvatarSize`)

| Size | Dimension |
|------|-----------|
| `xs` | 24 px |
| `sm` | 32 px |
| `md` | 40 px |
| `lg` | 52 px |
| `xl` | 72 px |

### Example

```tsx
<Avatar source={user.avatarUrl} size="md" />
<Avatar name="Jane Doe" size="lg" />
<Avatar name="Support Team" shape="rounded" size="sm" />
```

---

## Chip

Compact label used for filter selection, tags, or categorisation. `variant` controls visual style; `color` controls semantic meaning.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Display text |
| `variant` | `ChipVariant` | `'outlined'` | Visual style |
| `color` | `ChipColor` | `'primary'` | Semantic color |
| `size` | `ChipSize` | `'md'` | Size |
| `selected` | `boolean` | `false` | Highlighted selection state |
| `onPress` | `() => void` | — | Makes the chip tappable |
| `onRemove` | `() => void` | — | Shows an × remove button |
| `leftIcon` | `ReactNode` | — | Icon before the label |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `style` | `ViewStyle` | — | Container style override |

### Variants (`ChipVariant`)

| Variant | Description |
|---------|-------------|
| `outlined` | Transparent background with border (default) |
| `filled` | Solid/faded background, no border |
| `ghost` | Fully transparent, no border |

### Colors (`ChipColor`)

`primary` · `success` · `error` · `warning` · `neutral`

### Example

```tsx
// Filter chip
const [active, setActive] = useState(false);
<Chip label="Design" selected={active} onPress={() => setActive(!active)} />

// Status chip (no interaction)
<Chip label="Active" variant="filled" color="success" />

// Danger chip
<Chip label="Overdue" variant="filled" color="error" />

// Removable tag
<Chip label="React Native" variant="filled" onRemove={() => removeTag('react-native')} />
```

---

## Divider

Thin visual separator between sections or items.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis |
| `label` | `string` | — | Label centered on the divider |
| `color` | `string` | `Colors.border` | Line color |
| `style` | `ViewStyle` | — | Container style override |

### Example

```tsx
<Divider />
<Divider label="or continue with" />

// Vertical divider inside a row
<View style={{ flexDirection: 'row', height: 24, alignItems: 'center' }}>
  <AppText variant="body">Left</AppText>
  <Divider orientation="vertical" />
  <AppText variant="body">Right</AppText>
</View>
```

---

## Cards

### AppCard

Non-interactive container that groups related content.

```tsx
interface AppCardProps {
  children: ReactNode;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';  // Default: 'none'
  noPadding?: boolean;                            // Default: false
  style?: ViewStyle;
}
```

### AppPressableCard

Tappable card variant. Accepts all `Pressable` props in addition to card props.

```tsx
interface AppPressableCardProps extends PressableProps {
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  noPadding?: boolean;
  style?: ViewStyle;
}
```

### CardHeader

Standardised card title row with optional subtitle and trailing slot.

```tsx
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}
```

### Example

```tsx
<AppCard shadow="sm">
  <CardHeader title="Recent activity" subtitle="Last 7 days" right={<Badge label="New" />} />
  <AppText variant="body" color="secondary">Card body content.</AppText>
</AppCard>

<AppPressableCard shadow="md" onPress={handlePress}>
  <AppText variant="h3">Tappable card</AppText>
</AppPressableCard>

// Full-bleed card with list items
<AppCard noPadding shadow="sm">
  <View style={{ padding: Spacing.lg }}>
    <CardHeader title="Settings" />
  </View>
  <Divider />
  <ListItem title="Account" accessory="arrow" onPress={() => {}} showDivider />
  <ListItem title="Privacy" accessory="arrow" onPress={() => {}} />
</AppCard>
```

---

## ListItem

Standard list row for settings, navigation, and data lists.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Primary text |
| `subtitle` | `string` | — | Secondary text below title |
| `left` | `ReactNode` | — | Leading slot (icon, avatar, etc.) |
| `right` | `ReactNode` | — | Trailing slot (badge, custom node). Overrides `accessory` |
| `accessory` | `'arrow' \| 'none'` | `'none'` | Built-in trailing accessory |
| `color` | `ListItemColor` | `'default'` | Semantic color applied to the title |
| `onPress` | `() => void` | — | Makes the row tappable |
| `showDivider` | `boolean` | `false` | Bottom hairline divider |
| `disabled` | `boolean` | `false` | Prevents interaction, dims content |
| `style` | `ViewStyle` | — | Container style override |

### Colors (`ListItemColor`)

| Color | Use case |
|-------|----------|
| `default` | Normal navigation or info row |
| `danger` | Destructive action (delete, remove) |
| `success` | Confirmation or positive state |
| `warning` | Caution or irreversible action |

### Example

```tsx
// Navigation row
<ListItem
  title="Account"
  subtitle="Manage your profile"
  left={<Ionicons name="person-circle-outline" size={22} color={colors.primary} />}
  accessory="arrow"
  onPress={() => router.push('/account')}
  showDivider
/>

// Destructive row
<ListItem
  title="Delete account"
  color="danger"
  left={<Ionicons name="trash-outline" size={22} color={colors.error} />}
  accessory="arrow"
  onPress={handleDelete}
/>

// Static info row
<ListItem
  title="App version"
  right={<AppText variant="caption" color="tertiary">1.0.0</AppText>}
/>
```

---

## SafeScreen

Safe-area wrapper for full-screen layouts. Handles iOS notch, Dynamic Island, and Android status bar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `topSafe` | `boolean` | `true` | Apply top safe area inset |
| `bottomSafe` | `boolean` | `true` | Apply bottom safe area inset |
| `backgroundColor` | `string` | `Colors.background` | Background color |
| `style` | `ViewStyle` | — | Container style override |

### Example

```tsx
// Standard tab screen (Toolbar owns top inset)
<SafeScreen topSafe={false} bottomSafe={false}>
  <Toolbar title="Home" />
  <ScrollView style={{ flex: 1 }}>{/* content */}</ScrollView>
</SafeScreen>
```

---

## Toolbar

Top app bar with title, optional back button, left slot, and right actions.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Screen title |
| `subtitle` | `string` | — | Shown below the title |
| `titleStart` | `ReactNode` | — | Node before the title (icon, avatar) |
| `showBack` | `boolean` | `false` | Show platform back button |
| `onBack` | `() => void` | — | Custom back handler (default: `router.back()`) |
| `left` | `ReactNode` | — | Replaces the entire left slot |
| `right` | `ReactNode` | — | Right-side actions |
| `safeAreaTop` | `boolean` | `true` | Apply top safe area inset |
| `backgroundColor` | `string` | `Colors.background` | Background color |
| `containerStyle` | `ViewStyle` | — | Container style override |

### Example

```tsx
<Toolbar title="Profile" showBack />

// With right actions
<Toolbar
  title="Settings"
  showBack
  right={
    <Pressable onPress={openMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Ionicons name="ellipsis-vertical" size={22} color={Colors.textPrimary} />
    </Pressable>
  }
/>

// With subtitle and leading avatar
<Toolbar
  title="Jane Doe"
  subtitle="Administrator"
  titleStart={<Avatar name="Jane Doe" size="sm" />}
  right={<Button title="Edit" variant="ghost" size="sm" onPress={handleEdit} />}
/>
```

---

### Inset ownership

- Use default `Toolbar` (`safeAreaTop={true}`) when the bar should include top inset.
- Use `Toolbar safeAreaTop={false}` when parent `SafeScreen` already handles top inset.

---

## Container

Flexible full-screen content wrapper. Defaults to a `View` with `flex: 1` and `backgroundColor: colors.background`. Pass `scrollable` to swap the wrapper to a `ScrollView`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Screen content |
| `scrollable` | `boolean` | `false` | Use `ScrollView` instead of `View` |
| `component` | `React.ElementType` | — | Custom wrapper (overrides `scrollable`) |
| `style` | `StyleProp<ViewStyle>` | — | Wrapper style |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | — | ScrollView `contentContainerStyle` (when scrollable) |
| `componentProps` | `object` | — | Extra props forwarded to the wrapper component |

### Example

```tsx
// Static full-screen layout
<SafeScreen>
  <Container>
    <AppText variant="h2">Hello</AppText>
  </Container>
</SafeScreen>

// Scrollable content area
<SafeScreen topSafe={false} bottomSafe={false}>
  <Toolbar title="Profile" />
  <Container scrollable contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.lg }}>
    <ProfileCard />
    <ActivityList />
  </Container>
</SafeScreen>
```

---

## ProgressBar

Animated linear progress indicator. Use `color` for semantic meaning.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Progress 0–100 |
| `color` | `ProgressBarColor` | `'primary'` | Semantic fill color |
| `size` | `ProgressBarSize` | `'md'` | Bar height |
| `showLabel` | `boolean` | `false` | Show percentage label at end |
| `label` | `string` | — | Custom label text (overrides percentage) |
| `animated` | `boolean` | `true` | Animate the fill on value change |
| `style` | `ViewStyle` | — | Container style override |

### Colors (`ProgressBarColor`)

`primary` · `success` · `warning` · `error`

### Example

```tsx
<ProgressBar value={uploadPercent} color="primary" showLabel />
<ProgressBar value={(step / total) * 100} color="success" size="sm" />
<ProgressBar value={100} color="error" label="Upload failed" showLabel />
```

---

## Skeleton

Animated pulsing placeholder for loading states.

### Skeleton

Single block placeholder.

```tsx
<Skeleton width={120} height={120} borderRadius={60} />   // Avatar shape
<Skeleton height={20} />                                   // Title line
<Skeleton height={14} width="70%" />                       // Partial line
```

### SkeletonText

Stack of lines that mimics a paragraph.

```tsx
<SkeletonText lines={4} />
<SkeletonText lines={2} lineHeight={18} gap={10} />
```

### SkeletonCard

Pre-built card skeleton with avatar and text lines.

```tsx
{isLoading ? <SkeletonCard /> : <RealCard />}
```

---

## EmptyState

Guides the user when a list or section has no content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Icon or illustration |
| `title` | `string` | — | Primary heading |
| `description` | `string` | — | Supporting description |
| `action` | `{ label, onPress, variant? }` | — | Primary CTA |
| `secondaryAction` | `{ label, onPress, variant? }` | — | Secondary CTA |
| `style` | `ViewStyle` | — | Container style override |

### Example

```tsx
<EmptyState
  icon={<Ionicons name="folder-open-outline" size={48} color={Colors.textTertiary} />}
  title="No documents"
  description="Upload or create your first document to get started."
  action={{ label: 'Upload document', onPress: handleUpload }}
  secondaryAction={{ label: 'Learn more', onPress: openHelp, variant: 'ghost' }}
/>
```

---

## ConfirmDialog

Modal that prompts the user to confirm or cancel an action. `color` controls the semantic meaning of the confirm button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Controls visibility |
| `title` | `string` | — | Dialog title |
| `message` | `string` | — | Explanatory message |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `color` | `ConfirmDialogColor` | `'danger'` | Semantic color of the confirm button |
| `onConfirm` | `() => void` | — | Confirm callback |
| `onCancel` | `() => void` | — | Cancel / dismiss callback |

### Colors (`ConfirmDialogColor`)

`primary` · `danger` · `success` · `warning`

### Example

```tsx
// Destructive confirmation
<ConfirmDialog
  visible={deleteVisible}
  title="Delete item"
  message="This action cannot be undone."
  confirmLabel="Delete"
  color="danger"
  onConfirm={handleDelete}
  onCancel={() => setDeleteVisible(false)}
/>

// Positive confirmation
<ConfirmDialog
  visible={publishVisible}
  title="Publish post?"
  message="This will make the post visible to all users."
  confirmLabel="Publish"
  color="success"
  onConfirm={handlePublish}
  onCancel={() => setPublishVisible(false)}
/>
```

---

## FeedbackDialog

Single-action modal for success, error, info, or warning feedback messages. `color` controls the icon and semantic meaning.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Controls visibility |
| `color` | `FeedbackColor` | `'info'` | Semantic color — drives icon and title |
| `title` | `string` | — | Dialog title (auto-derived from `color` if omitted) |
| `message` | `string` | — | Message body |
| `confirmLabel` | `string` | `'OK'` | Dismiss button label |
| `onDismiss` | `() => void` | — | Dismiss callback |

### Colors (`FeedbackColor`)

| Color | Auto title | Icon |
|-------|-----------|------|
| `success` | "Success" | checkmark-circle |
| `error` | "Error" | close-circle |
| `info` | "Notice" | information-circle |
| `warning` | "Attention" | warning |

### useToast hook

```tsx
const { toast, showToast, hideToast } = useToast();

showToast('Your data was saved.', 'success');
showToast('Something went wrong.', 'error');

<FeedbackDialog {...toast} onDismiss={hideToast} />
```

### Example

```tsx
<FeedbackDialog
  visible={successVisible}
  color="success"
  title="Payment complete"
  message="Your payment has been processed successfully."
  onDismiss={() => setSuccessVisible(false)}
/>
```

---

## ActionSheet

Bottom sheet–style action menu with animated slide-in/out.

### ActionSheet Props

| Prop | Type | Description |
|------|------|-------------|
| `visible` | `boolean` | Controls visibility |
| `onClose` | `() => void` | Dismiss callback |
| `title` | `string` | Sheet title |
| `subtitle` | `string` | Optional subtitle |
| `children` | `ReactNode` | `ActionSheetRow` elements |

### ActionSheetRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Leading icon |
| `label` | `string` | — | Row label |
| `onPress` | `() => void` | — | Tap handler |
| `color` | `ActionSheetRowColor` | `'default'` | Semantic color (`'default'` or `'danger'`) |
| `edge` | `ActionSheetRowEdge` | `'default'` | Border treatment |

### `ActionSheetRowEdge`

| Value | Effect |
|-------|--------|
| `default` | Bottom hairline divider |
| `beforeDanger` | Extra bottom margin before the danger row |
| `danger` | Top border to visually separate destructive action |

### Example

```tsx
<ActionSheet
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  title="Document actions"
>
  <ActionSheetRow
    icon={<Ionicons name="pencil-outline" size={20} color={Colors.primary} />}
    label="Edit"
    onPress={handleEdit}
    edge="default"
  />
  <ActionSheetRow
    icon={<Ionicons name="share-outline" size={20} color={Colors.primary} />}
    label="Share"
    onPress={handleShare}
    edge="beforeDanger"
  />
  <ActionSheetRow
    icon={<Ionicons name="trash-outline" size={20} color={Colors.error} />}
    label="Delete"
    onPress={handleDelete}
    color="danger"
    edge="danger"
  />
</ActionSheet>
```

---

## Adding a New Component

Follow this checklist when adding a component to the library:

1. Create `src/components/ui/<name>.tsx`
2. Define a TypeScript `interface` for all props
3. Use only `Colors`, `Spacing`, `Radii`, `Typography`, `Shadows` from `@/constants/theme`
4. Map visual variants to `Record<Variant, Style>` lookup objects
5. Set `accessibilityRole` and `accessibilityState` on all interactive elements
6. Export the component and its types from `src/components/ui/index.ts`
7. Add a section to `docs/components.md`
8. Add a demo section to `src/app/(tabs)/components.tsx`

### Template

Follow the **variant + color separation** principle: `variant` = visual style, `color` = semantic meaning. Never encode semantic meaning inside `variant`.

```tsx
import { Radii, Spacing } from '@/constants/theme';
import { AppTheme } from '@/theme/types';
import { useAppTheme } from '@/theme/use-app-theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from './app-text';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Visual style of the component. */
export type MyVariant = 'filled' | 'outlined' | 'soft';

/** Semantic color of the component. */
export type MyColor = 'primary' | 'success' | 'danger' | 'warning' | 'neutral';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MyComponentProps {
  /** Visual style. Default: 'filled' */
  variant?: MyVariant;
  /** Semantic color. Default: 'primary' */
  color?: MyColor;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MyComponent — brief description.
 *
 * @example
 * <MyComponent variant="soft" color="success" />
 */
export function MyComponent({ variant = 'filled', color = 'primary', style }: MyComponentProps) {
  const { colors } = useAppTheme();
  const styles = useThemedStyle(createStyles);

  // 2-D style map: variant × color
  const bgMap: Record<MyVariant, Record<MyColor, string>> = {
    filled: {
      primary: colors.primary,
      success: colors.success,
      danger: colors.error,
      warning: colors.warning,
      neutral: colors.borderLight,
    },
    soft: {
      primary: colors.primaryFaded,
      success: colors.successFaded,
      danger: colors.errorFaded,
      warning: colors.warningFaded,
      neutral: colors.borderLight,
    },
    outlined: {
      primary: 'transparent',
      success: 'transparent',
      danger: 'transparent',
      warning: 'transparent',
      neutral: 'transparent',
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: bgMap[variant][color] }, style]}>
      <AppText variant="body">{/* … */}</AppText>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: Radii.md,
      padding: Spacing.lg,
    },
  });
```
