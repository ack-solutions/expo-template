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
| Variant-driven | Every component exposes a `variant` prop for visual styles |
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
| [SafeScreen](#safescreen) | `safe-screen.tsx` | Screen |
| [Toolbar](#toolbar) | `toolbar.tsx` | Screen |
| [ScreenHeader](#screenheader) | `screen-header.tsx` | Screen |
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
  <Badge label="Active" variant="success" />
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
  <Button title="Save" variant="primary" onPress={onSave} style={{ flex: 1 }} />
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
| `style` | `TextStyle` | — | Style override |
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

Primary action component with five visual variants and three sizes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Button label |
| `onPress` | `() => void` | — | Tap handler |
| `variant` | `ButtonVariant` | `'primary'` | Visual style |
| `size` | `ButtonSize` | `'md'` | Size |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `icon` | `ReactNode` | — | Icon rendered before the label |
| `fullWidth` | `boolean` | `false` | Stretches to container width |
| `style` | `ViewStyle` | — | Container style override |
| `textStyle` | `TextStyle` | — | Label style override |

### Variants (`ButtonVariant`)

| Variant | Use case |
|---------|----------|
| `primary` | Main CTA — one per section |
| `secondary` | Muted accent CTA |
| `outline` | Bordered, no fill |
| `ghost` | Text-only, no border |
| `danger` | Destructive actions (delete, remove) |

### Sizes (`ButtonSize`)

`sm` · `md` · `lg`

### Example

```tsx
<Button title="Save" onPress={handleSave} variant="primary" />
<Button title="Cancel" onPress={handleCancel} variant="ghost" />
<Button title="Delete" onPress={handleDelete} variant="danger" />
<Button title="Loading…" loading onPress={() => {}} />
<Button
  title="Add item"
  icon={<Ionicons name="add" size={16} color="#fff" />}
  onPress={handleAdd}
  fullWidth
/>
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

// With error (from React Hook Form)
const { register, formState } = useForm();
<AppInput
  label="Password"
  secureTextEntry
  error={formState.errors.password?.message}
  value={pw}
  onChangeText={setPw}
/>

// With icon slots
<AppInput
  label="Amount"
  variant="filled"
  leftSlot={<Text>$</Text>}
  rightSlot={<Ionicons name="calculator-outline" size={18} color={Colors.textTertiary} />}
  keyboardType="decimal-pad"
  value={amount}
  onChangeText={setAmount}
/>
```

---

## AppSelect

Styled select field that opens a searchable bottom sheet. The trigger is visually identical to `AppInput` (same label, error, hint, variant, size system).

- Sheet slides up with a Reanimated spring; backdrop fades in.
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

// With React Hook Form
const { watch, setValue, formState: { errors } } = useForm();

<AppSelect
  label="Category"
  value={watch('category')}
  onChange={(opt) => setValue('category', opt.value, { shouldValidate: true })}
  error={errors.category?.message}
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

Compact status indicator. Supports text labels or dot-only indicators.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Display text |
| `variant` | `BadgeVariant` | `'neutral'` | Color style |
| `size` | `BadgeSize` | `'md'` | Size |
| `dot` | `boolean` | `false` | Render as a small colored dot (no text) |
| `style` | `ViewStyle` | — | Container style override |

### Variants (`BadgeVariant`)

`primary` · `success` · `error` · `warning` · `neutral`

### Example

```tsx
<Badge label="Active" variant="success" />
<Badge label="3 new" variant="error" size="sm" />
<Badge label="Pending" variant="warning" />
<Badge label="" variant="error" dot />          // notification dot
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

Compact label used for filter selection, tags, or categorisation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Display text |
| `variant` | `ChipVariant` | `'outlined'` | Visual style |
| `size` | `ChipSize` | `'md'` | Size |
| `selected` | `boolean` | `false` | Highlighted selection state |
| `onPress` | `() => void` | — | Makes the chip tappable |
| `onRemove` | `() => void` | — | Shows an × remove button |
| `leftIcon` | `ReactNode` | — | Icon before the label |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `style` | `ViewStyle` | — | Container style override |

### Variants (`ChipVariant`)

`filled` · `outlined` · `ghost`

### Example

```tsx
// Filter chip
const [active, setActive] = useState(false);
<Chip label="Design" selected={active} onPress={() => setActive(!active)} />

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
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
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
| `onPress` | `() => void` | — | Makes the row tappable |
| `showDivider` | `boolean` | `false` | Bottom hairline divider |
| `disabled` | `boolean` | `false` | Prevents interaction, dims content |
| `style` | `ViewStyle` | — | Container style override |

### Example

```tsx
<ListItem
  title="Account"
  subtitle="Manage your profile"
  left={<Ionicons name="person-circle-outline" size={22} color={Colors.primary} />}
  accessory="arrow"
  onPress={() => router.push('/account')}
  showDivider
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
| `style` | `ViewStyle` | — | Container style override |

### Example

```tsx
<Toolbar
  title="Profile"
  showBack
  right={
    <TouchableOpacity onPress={openMenu}>
      <Ionicons name="ellipsis-vertical" size={22} color={Colors.textPrimary} />
    </TouchableOpacity>
  }
/>
```

---

## ScreenHeader

Identical to `Toolbar` but with `safeAreaTop={false}` pre-set. Use when the parent `SafeScreen` owns the top inset.

---

## ProgressBar

Animated linear progress indicator.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Progress 0–100 |
| `variant` | `ProgressBarVariant` | `'primary'` | Fill color variant |
| `size` | `ProgressBarSize` | `'md'` | Bar height |
| `showLabel` | `boolean` | `false` | Show percentage label |
| `label` | `string` | — | Custom label text (overrides percentage) |
| `animated` | `boolean` | `true` | Animate the fill on value change |
| `style` | `ViewStyle` | — | Container style override |

### Variants (`ProgressBarVariant`)

`primary` · `success` · `warning` · `error`

### Example

```tsx
<ProgressBar value={uploadPercent} variant="primary" showLabel />
<ProgressBar value={(step / total) * 100} variant="success" size="sm" />
<ProgressBar value={100} variant="error" label="Upload failed" showLabel />
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

Modal that prompts the user to confirm or cancel an action.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Controls visibility |
| `title` | `string` | — | Dialog title |
| `message` | `string` | — | Explanatory message |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `variant` | `'danger' \| 'primary'` | `'danger'` | Confirm button style |
| `onConfirm` | `() => void` | — | Confirm callback |
| `onCancel` | `() => void` | — | Cancel / dismiss callback |

### Example

```tsx
<ConfirmDialog
  visible={deleteVisible}
  title="Delete item"
  message="This action cannot be undone."
  confirmLabel="Delete"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setDeleteVisible(false)}
/>
```

---

## FeedbackDialog

Single-action modal for success, error, info, or warning messages.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | — | Controls visibility |
| `variant` | `FeedbackVariant` | `'info'` | Color and icon style |
| `title` | `string` | — | Dialog title (auto-derived from variant if omitted) |
| `message` | `string` | — | Message body |
| `confirmLabel` | `string` | `'OK'` | Dismiss button label |
| `onDismiss` | `() => void` | — | Dismiss callback |

### Variants (`FeedbackVariant`)

`success` · `error` · `info` · `warning`

### Example

```tsx
<FeedbackDialog
  visible={successVisible}
  variant="success"
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
| `variant` | `'default' \| 'danger'` | `'default'` | Color style |
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
    variant="danger"
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

```tsx
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MyVariant = 'default' | 'accent';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MyComponentProps {
  variant?: MyVariant;
  style?: ViewStyle;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantBg: Record<MyVariant, string> = {
  default: Colors.surface,
  accent: Colors.primaryFaded,
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MyComponent — brief description.
 *
 * @example
 * <MyComponent variant="accent" />
 */
export function MyComponent({ variant = 'default', style }: MyComponentProps) {
  return (
    <View style={[styles.container, { backgroundColor: variantBg[variant] }, style]}>
      {/* … */}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.md,
    padding: Spacing.lg,
  },
});
```
