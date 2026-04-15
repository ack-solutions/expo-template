/**
 * Component Playground — visual reference for all UI components.
 *
 * Every shared component is rendered with all variants and states.
 * Interactive components show live animation feedback.
 * Tap the overlay buttons to open dialogs and action sheets.
 */

import {
  ActionSheet,
  ActionSheetRow,
  AppCard,
  AppCheckbox,
  AppInput,
  AppPressableCard,
  AppSelect,
  AppSwitch,
  AppText,
  Avatar,
  Badge,
  Button,
  CardHeader,
  Chip,
  ConfirmDialog,
  Divider,
  EmptyState,
  FeedbackDialog,
  HStack,
  ListItem,
  ProgressBar,
  RadioGroup,
  SafeScreen,
  SearchBar,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  Stack,
  Toolbar,
  VStack,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="md">
      <AppText
        variant="h3"
        color="primary"
        style={styles.sectionTitle}
      >
        {title}
      </AppText>
      {children}
    </Stack>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ComponentsScreen() {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [selectLargeValue, setSelectLargeValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [radioValue, setRadioValue] = useState('option_a');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  function toggleChip(key: string) {
    setSelectedChips((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="UI Kit" subtitle="Component reference" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stack Layout ────────────────────────────────────────────────── */}
        <Section title="Stack / HStack / VStack">
          <AppText variant="captionMedium" color="secondary">
            VStack (vertical, gap=md)
          </AppText>
          <AppCard>
            <VStack gap="md">
              <AppText variant="bodyMedium">Row one</AppText>
              <AppText variant="bodyMedium">Row two</AppText>
              <AppText variant="bodyMedium">Row three</AppText>
            </VStack>
          </AppCard>

          <AppText variant="captionMedium" color="secondary">
            HStack (horizontal, gap=sm, align=center)
          </AppText>
          <AppCard>
            <HStack gap="sm" align="center">
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <AppText variant="bodyMedium">Verified account</AppText>
              <Badge label="Pro" variant="primary" size="sm" />
            </HStack>
          </AppCard>

          <AppText variant="captionMedium" color="secondary">
            HStack — space-between
          </AppText>
          <AppCard>
            <HStack justify="space-between" align="center">
              <AppText variant="bodyMedium">Label</AppText>
              <Badge label="Active" variant="success" />
            </HStack>
          </AppCard>

          <AppText variant="captionMedium" color="secondary">
            Stack — form fields (gap=lg)
          </AppText>
          <Stack gap="lg">
            <AppInput
              label="First name"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Jane"
            />
            <AppInput
              label="Last name"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Doe"
            />
            <Button title="Submit" onPress={() => {}} fullWidth />
          </Stack>
        </Section>

        <Divider />

        {/* ── Typography ──────────────────────────────────────────────────── */}
        <Section title="Typography">
          <VStack gap="sm">
            <AppText variant="hero">Hero</AppText>
            <AppText variant="displayLarge">Display Large</AppText>
            <AppText variant="h1">Heading 1</AppText>
            <AppText variant="h2">Heading 2</AppText>
            <AppText variant="h3">Heading 3</AppText>
            <AppText variant="body">Body — default weight</AppText>
            <AppText variant="bodyMedium">Body Medium</AppText>
            <AppText variant="bodySemibold">Body Semibold</AppText>
            <AppText variant="caption" color="secondary">Caption</AppText>
            <AppText variant="captionMedium" color="secondary">Caption Medium</AppText>
            <AppText variant="small" color="tertiary">Small</AppText>
            <AppText variant="smallMedium" color="tertiary">Small Medium</AppText>
          </VStack>
          <HStack gap="md" wrap>
            <AppText variant="body" color="error">error</AppText>
            <AppText variant="body" color="success">success</AppText>
            <AppText variant="body" color="warning">warning</AppText>
            <AppText variant="body" color="accent">accent</AppText>
          </HStack>
        </Section>

        <Divider />

        {/* ── Buttons ─────────────────────────────────────────────────────── */}
        <Section title="Buttons">
          <AppText variant="captionMedium" color="secondary">Variants (tap for spring animation)</AppText>
          <VStack gap="sm">
            {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
              <Button
                key={v}
                title={v.charAt(0).toUpperCase() + v.slice(1)}
                variant={v}
                onPress={() => {}}
              />
            ))}
          </VStack>

          <AppText variant="captionMedium" color="secondary">Sizes (sm / md / lg)</AppText>
          <VStack gap="sm">
            <Button title="Small — 40 pt" size="sm" onPress={() => {}} />
            <Button title="Medium — 48 pt" size="md" onPress={() => {}} />
            <Button title="Large — 56 pt" size="lg" onPress={() => {}} />
          </VStack>

          <AppText variant="captionMedium" color="secondary">States</AppText>
          <HStack gap="sm">
            <Button title="Loading" loading onPress={() => {}} />
            <Button title="Disabled" disabled onPress={() => {}} />
          </HStack>
          <Button
            title="With icon"
            icon={<Ionicons name="add" size={17} color={Colors.textInverse} />}
            onPress={() => {}}
          />
          <Button title="Full Width" fullWidth onPress={() => {}} />
        </Section>

        <Divider />

        {/* ── Inputs ──────────────────────────────────────────────────────── */}
        <Section title="Inputs">
          <AppText variant="captionMedium" color="secondary">
            Tap any field to see animated focus (border + label color)
          </AppText>
          <Stack gap="lg">
            <AppInput
              label="Outlined (default) — 48 pt"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Tap to focus…"
            />
            <AppInput
              label="Filled variant"
              variant="filled"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Filled input"
            />
            <AppInput
              label="Error state"
              value=""
              onChangeText={() => {}}
              error="This field is required"
            />
            <AppInput
              label="With hint"
              value={inputValue}
              onChangeText={setInputValue}
              hint="We will never share your email"
              placeholder="user@example.com"
            />
            <AppInput
              label="Icon slots"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Search…"
              leftSlot={<Ionicons name="search" size={18} color={Colors.textTertiary} />}
              rightSlot={<Ionicons name="mic-outline" size={18} color={Colors.textTertiary} />}
            />
            <AppInput
              label="Disabled"
              value="Cannot edit this"
              onChangeText={() => {}}
              editable={false}
            />
          </Stack>

          <AppText variant="captionMedium" color="secondary">Sizes</AppText>
          <Stack gap="md">
            <AppInput label="Small — 40 pt" size="sm" value={inputValue} onChangeText={setInputValue} placeholder="sm" />
            <AppInput label="Medium — 48 pt" size="md" value={inputValue} onChangeText={setInputValue} placeholder="md" />
            <AppInput label="Large — 56 pt" size="lg" value={inputValue} onChangeText={setInputValue} placeholder="lg" />
          </Stack>

          <AppInput
            label="Multiline"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter a long description…"
            multiline
            numberOfLines={4}
          />
        </Section>

        <Divider />

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <Section title="Search Bar">
          <AppText variant="captionMedium" color="secondary">
            Tap to see icon + border animate (48 pt touch target)
          </AppText>
          <SearchBar
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search items…"
            onClear={() => setSearchValue('')}
          />
        </Section>

        <Divider />

        {/* ── Select ──────────────────────────────────────────────────────── */}
        <Section title="Select">
          <AppText variant="captionMedium" color="secondary">
            Small list — no search bar (auto-disabled when 5 or fewer options)
          </AppText>
          <AppSelect
            label="Priority"
            value={selectValue}
            onChange={(opt) => setSelectValue(opt.value)}
            placeholder="Choose priority"
            options={[
              { label: 'Low', value: 'low', description: 'Non-urgent, handle when possible' },
              { label: 'Medium', value: 'medium', description: 'Normal priority' },
              { label: 'High', value: 'high', description: 'Address as soon as possible' },
              { label: 'Critical', value: 'critical', description: 'Drop everything' },
            ]}
          />

          <AppText variant="captionMedium" color="secondary">
            Large list — search bar auto-enabled (more than 5 options)
          </AppText>
          <AppSelect
            label="Timezone"
            value={selectLargeValue}
            onChange={(opt) => setSelectLargeValue(opt.value)}
            placeholder="Select timezone"
            searchPlaceholder="Search timezones…"
            sheetTitle="Select timezone"
            options={TIMEZONE_OPTIONS}
          />

          <AppText variant="captionMedium" color="secondary">
            Dialog mode — opens centered picker (with optional search)
          </AppText>
          <Stack gap="md">
            <AppSelect
              label="Category (dialog)"
              mode="dialog"
              value={selectValue}
              onChange={(opt) => setSelectValue(opt.value)}
              placeholder="Select category"
              searchable={false}
              options={[
                { label: 'Product', value: 'product' },
                { label: 'Service', value: 'service' },
                { label: 'Billing', value: 'billing' },
                { label: 'Support', value: 'support' },
              ]}
            />
            <AppSelect
              label="Timezone (dialog + search)"
              mode="dialog"
              value={selectLargeValue}
              onChange={(opt) => setSelectLargeValue(opt.value)}
              placeholder="Select timezone"
              searchable
              searchPlaceholder="Search timezones…"
              sheetTitle="Select timezone"
              options={TIMEZONE_OPTIONS}
            />
          </Stack>

          <AppText variant="captionMedium" color="secondary">Variants and sizes</AppText>
          <Stack gap="md">
            <AppSelect
              label="Filled variant"
              variant="filled"
              value={selectValue}
              onChange={(opt) => setSelectValue(opt.value)}
              placeholder="Choose one"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
              ]}
            />
            <AppSelect
              label="Small — 40 pt"
              size="sm"
              value={selectValue}
              onChange={(opt) => setSelectValue(opt.value)}
              placeholder="sm"
              options={[{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]}
            />
            <AppSelect
              label="Large — 56 pt"
              size="lg"
              value={selectValue}
              onChange={(opt) => setSelectValue(opt.value)}
              placeholder="lg"
              options={[{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]}
            />
            <AppSelect
              label="With error"
              value=""
              onChange={() => {}}
              error="Please select an option"
              options={[{ label: 'One', value: '1' }]}
            />
            <AppSelect
              label="With hint"
              value={selectValue}
              onChange={(opt) => setSelectValue(opt.value)}
              hint="This setting can be changed later"
              placeholder="Choose one"
              options={[{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }]}
            />
            <AppSelect
              label="Disabled"
              value="a"
              onChange={() => {}}
              disabled
              options={[{ label: 'Option A', value: 'a' }]}
            />
          </Stack>
        </Section>

        <Divider />

        {/* ── Badge ───────────────────────────────────────────────────────── */}
        <Section title="Badge">
          <AppText variant="captionMedium" color="secondary">Variants</AppText>
          <HStack gap="sm" wrap>
            {(['primary', 'success', 'error', 'warning', 'neutral'] as const).map((v) => (
              <Badge key={v} label={v} variant={v} />
            ))}
          </HStack>

          <AppText variant="captionMedium" color="secondary">Sizes</AppText>
          <HStack gap="sm" align="center">
            <Badge label="sm" variant="primary" size="sm" />
            <Badge label="md" variant="primary" size="md" />
            <Badge label="lg" variant="primary" size="lg" />
          </HStack>

          <AppText variant="captionMedium" color="secondary">Dot mode</AppText>
          <HStack gap="md" align="center">
            {(['primary', 'success', 'error', 'warning'] as const).map((v) => (
              <Badge key={v} label="" variant={v} dot />
            ))}
          </HStack>
        </Section>

        <Divider />

        {/* ── Avatar ──────────────────────────────────────────────────────── */}
        <Section title="Avatar">
          <AppText variant="captionMedium" color="secondary">Sizes with initials</AppText>
          <HStack gap="md" align="center">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <Avatar key={s} name="John Doe" size={s} />
            ))}
          </HStack>

          <AppText variant="captionMedium" color="secondary">Stable colors from name</AppText>
          <HStack gap="sm">
            {['Alice Baker', 'Bob Chen', 'Carol Davis', 'David Evans'].map((name) => (
              <Avatar key={name} name={name} size="md" />
            ))}
          </HStack>

          <AppText variant="captionMedium" color="secondary">Rounded shape</AppText>
          <HStack gap="sm">
            <Avatar name="Support" shape="rounded" size="lg" />
            <Avatar name="Admin User" shape="rounded" size="lg" />
          </HStack>
        </Section>

        <Divider />

        {/* ── Chip ────────────────────────────────────────────────────────── */}
        <Section title="Chip">
          <AppText variant="captionMedium" color="secondary">
            Variants (tap filter chips — spring scale animation)
          </AppText>
          <HStack gap="sm" wrap>
            <Chip label="Outlined" variant="outlined" />
            <Chip label="Filled" variant="filled" />
            <Chip label="Ghost" variant="ghost" />
          </HStack>

          <AppText variant="captionMedium" color="secondary">Filter chips</AppText>
          <HStack gap="sm" wrap>
            {(['Design', 'Engineering', 'Product', 'Marketing'] as const).map((label) => (
              <Chip
                key={label}
                label={label}
                variant="outlined"
                selected={selectedChips.includes(label)}
                onPress={() => toggleChip(label)}
              />
            ))}
          </HStack>

          <AppText variant="captionMedium" color="secondary">With remove</AppText>
          <HStack gap="sm" wrap>
            <Chip label="React Native" variant="filled" onRemove={() => {}} />
            <Chip label="TypeScript" variant="filled" onRemove={() => {}} />
          </HStack>
        </Section>

        <Divider />

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <Section title="Divider">
          <AppText variant="captionMedium" color="secondary">Default</AppText>
          <Divider />
          <AppText variant="captionMedium" color="secondary">With label</AppText>
          <Divider label="or continue with" />
          <AppText variant="captionMedium" color="secondary">Vertical (inside HStack)</AppText>
          <HStack align="center" style={{ height: 24 }}>
            <AppText variant="caption">Left</AppText>
            <Divider orientation="vertical" />
            <AppText variant="caption">Middle</AppText>
            <Divider orientation="vertical" />
            <AppText variant="caption">Right</AppText>
          </HStack>
        </Section>

        <Divider />

        {/* ── Checkbox ────────────────────────────────────────────────────── */}
        <Section title="Checkbox">
          <AppText variant="captionMedium" color="secondary">
            Tap to toggle — box and checkmark animate
          </AppText>
          <VStack gap="md">
            <AppCheckbox
              checked={checked}
              onPress={() => setChecked(!checked)}
              label="Simple checkbox"
            />
            <AppCheckbox
              checked={checked}
              onPress={() => setChecked(!checked)}
              label="With description"
              description="Tap to toggle this option on or off"
            />
            <AppCheckbox
              checked={false}
              indeterminate
              onPress={() => {}}
              label="Indeterminate state"
            />
            <AppCheckbox checked={false} onPress={() => {}} label="Disabled" disabled />
            <AppCheckbox checked onPress={() => {}} label="Disabled checked" disabled />
          </VStack>
        </Section>

        <Divider />

        {/* ── Switch ──────────────────────────────────────────────────────── */}
        <Section title="Switch">
          <VStack gap="md">
            <AppSwitch
              value={switchOn}
              onValueChange={setSwitchOn}
              label="Notifications"
              description="Receive push notifications"
            />
            <AppSwitch value={true} onValueChange={() => {}} label="Disabled on" disabled />
            <AppSwitch value={false} onValueChange={() => {}} label="Disabled off" disabled />
            <AppSwitch
              value={switchOn}
              onValueChange={setSwitchOn}
              label="Switch on the left"
              switchSide="left"
            />
          </VStack>
        </Section>

        <Divider />

        {/* ── Radio Group ─────────────────────────────────────────────────── */}
        <Section title="Radio Group">
          <RadioGroup
            value={radioValue}
            onChange={setRadioValue}
            options={[
              { label: 'Option A', value: 'option_a', description: 'First choice' },
              { label: 'Option B', value: 'option_b', description: 'Second choice' },
              { label: 'Option C — disabled', value: 'option_c', disabled: true },
            ]}
          />
          <AppText variant="captionMedium" color="secondary">Horizontal layout</AppText>
          <RadioGroup
            value={radioValue}
            onChange={setRadioValue}
            direction="horizontal"
            options={[
              { label: 'Yes', value: 'option_a' },
              { label: 'No', value: 'option_b' },
              { label: 'Maybe', value: 'option_c' },
            ]}
          />
        </Section>

        <Divider />

        {/* ── Cards ───────────────────────────────────────────────────────── */}
        <Section title="Cards">
          <VStack gap="md">
            <AppCard>
              <CardHeader title="Default Card" subtitle="No shadow, border only" />
              <AppText variant="body" color="secondary">Card body content goes here.</AppText>
            </AppCard>

            <AppCard shadow="sm">
              <CardHeader title="Shadow sm" />
              <AppText variant="body" color="secondary">Subtle depth for list cards.</AppText>
            </AppCard>

            <AppCard shadow="md">
              <CardHeader
                title="Shadow md"
                right={<Badge label="New" variant="primary" size="sm" />}
              />
              <AppText variant="body" color="secondary">Medium shadow for elevated panels.</AppText>
            </AppCard>

            <AppPressableCard shadow="sm" onPress={() => {}}>
              <CardHeader title="Pressable Card" subtitle="Tap — spring scale animation" />
              <AppText variant="body" color="secondary">Press to feel the scale animation.</AppText>
            </AppPressableCard>

            <AppCard noPadding shadow="sm">
              <View style={{ padding: Spacing.lg }}>
                <CardHeader title="No Padding Card" subtitle="Full-bleed list items below" />
              </View>
              <Divider />
              <ListItem
                title="List inside card"
                subtitle="Full bleed"
                accessory="arrow"
                onPress={() => {}}
                showDivider
              />
              <ListItem title="Another row" accessory="arrow" onPress={() => {}} />
            </AppCard>
          </VStack>
        </Section>

        <Divider />

        {/* ── List Item ───────────────────────────────────────────────────── */}
        <Section title="List Item">
          <AppCard noPadding shadow="sm">
            <ListItem
              title="Icon + arrow"
              subtitle="Navigation row"
              left={<Ionicons name="person-circle-outline" size={22} color={Colors.primary} />}
              accessory="arrow"
              onPress={() => {}}
              showDivider
            />
            <ListItem
              title="With badge"
              left={<Ionicons name="notifications-outline" size={22} color={Colors.primary} />}
              right={<Badge label="5" variant="error" size="sm" />}
              onPress={() => {}}
              showDivider
            />
            <ListItem
              title="Subtitle only"
              subtitle="Supporting description text"
              accessory="arrow"
              onPress={() => {}}
              showDivider
            />
            <ListItem
              title="Disabled"
              left={<Ionicons name="lock-closed-outline" size={22} color={Colors.textTertiary} />}
              accessory="arrow"
              disabled
              showDivider
            />
            <ListItem
              title="Static info"
              right={<AppText variant="caption" color="tertiary">v1.0.0</AppText>}
            />
          </AppCard>
        </Section>

        <Divider />

        {/* ── Progress Bar ────────────────────────────────────────────────── */}
        <Section title="Progress Bar">
          <AppText variant="captionMedium" color="secondary">Variants</AppText>
          <VStack gap="md">
            <ProgressBar value={70} variant="primary" showLabel />
            <ProgressBar value={85} variant="success" showLabel />
            <ProgressBar value={45} variant="warning" showLabel />
            <ProgressBar value={30} variant="error" showLabel />
          </VStack>

          <AppText variant="captionMedium" color="secondary">Sizes (sm / md / lg)</AppText>
          <VStack gap="md">
            <ProgressBar value={60} size="sm" />
            <ProgressBar value={60} size="md" />
            <ProgressBar value={60} size="lg" />
          </VStack>

          <ProgressBar value={100} variant="error" label="Upload failed" showLabel />
        </Section>

        <Divider />

        {/* ── Skeleton ────────────────────────────────────────────────────── */}
        <Section title="Skeleton">
          <AppText variant="captionMedium" color="secondary">Blocks</AppText>
          <HStack gap="md" align="center">
            <Skeleton width={64} height={64} borderRadius={32} />
            <VStack gap="sm" flex={1}>
              <Skeleton height={16} width="60%" />
              <Skeleton height={13} />
            </VStack>
          </HStack>

          <AppText variant="captionMedium" color="secondary">Text paragraph</AppText>
          <SkeletonText lines={4} />

          <AppText variant="captionMedium" color="secondary">Card skeleton</AppText>
          <AppCard noPadding>
            <SkeletonCard />
            <Divider />
            <SkeletonCard />
          </AppCard>
        </Section>

        <Divider />

        {/* ── Empty State ─────────────────────────────────────────────────── */}
        <Section title="Empty State">
          <AppCard>
            <EmptyState
              icon={<Ionicons name="folder-open-outline" size={48} color={Colors.textTertiary} />}
              title="No items yet"
              description="Create your first item to get started with the list."
              action={{ label: 'Create item', onPress: () => {} }}
              secondaryAction={{ label: 'Learn more', onPress: () => {}, variant: 'ghost' }}
            />
          </AppCard>
        </Section>

        <Divider />

        {/* ── Overlays ────────────────────────────────────────────────────── */}
        <Section title="Overlays and Dialogs">
          <VStack gap="sm">
            <Button
              title="Open Confirm Dialog"
              variant="outline"
              onPress={() => setConfirmVisible(true)}
            />
            <Button
              title="Open Feedback Dialog"
              variant="outline"
              onPress={() => setFeedbackVisible(true)}
            />
            <Button
              title="Open Action Sheet"
              variant="outline"
              onPress={() => setActionSheetVisible(true)}
            />
          </VStack>
        </Section>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* ── Modals ── */}
      <ConfirmDialog
        visible={confirmVisible}
        title="Delete item"
        message="This action cannot be undone. Are you sure you want to delete this item?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => setConfirmVisible(false)}
        onCancel={() => setConfirmVisible(false)}
      />

      <FeedbackDialog
        visible={feedbackVisible}
        variant="success"
        title="Changes saved"
        message="Your changes have been saved successfully."
        onDismiss={() => setFeedbackVisible(false)}
      />

      <ActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        title="Actions"
        subtitle="Choose an action to perform"
      >
        <ActionSheetRow
          icon={<Ionicons name="pencil-outline" size={20} color={Colors.primary} />}
          label="Edit"
          onPress={() => setActionSheetVisible(false)}
          edge="default"
        />
        <ActionSheetRow
          icon={<Ionicons name="share-outline" size={20} color={Colors.primary} />}
          label="Share"
          onPress={() => setActionSheetVisible(false)}
          edge="beforeDanger"
        />
        <ActionSheetRow
          icon={<Ionicons name="trash-outline" size={20} color={Colors.error} />}
          label="Delete"
          onPress={() => setActionSheetVisible(false)}
          variant="danger"
          edge="danger"
        />
      </ActionSheet>
    </SafeScreen>
  );
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const TIMEZONE_OPTIONS = [
  { label: 'UTC', value: 'UTC', description: 'Coordinated Universal Time' },
  { label: 'America/New_York', value: 'America/New_York', description: 'Eastern Time (ET)' },
  { label: 'America/Chicago', value: 'America/Chicago', description: 'Central Time (CT)' },
  { label: 'America/Denver', value: 'America/Denver', description: 'Mountain Time (MT)' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles', description: 'Pacific Time (PT)' },
  { label: 'America/Anchorage', value: 'America/Anchorage', description: 'Alaska Time' },
  { label: 'Pacific/Honolulu', value: 'Pacific/Honolulu', description: 'Hawaii Time' },
  { label: 'Europe/London', value: 'Europe/London', description: 'Greenwich Mean Time (GMT)' },
  { label: 'Europe/Paris', value: 'Europe/Paris', description: 'Central European Time (CET)' },
  { label: 'Europe/Berlin', value: 'Europe/Berlin', description: 'Central European Time (CET)' },
  { label: 'Europe/Helsinki', value: 'Europe/Helsinki', description: 'Eastern European Time (EET)' },
  { label: 'Europe/Istanbul', value: 'Europe/Istanbul', description: 'Turkey Time (TRT)' },
  { label: 'Asia/Dubai', value: 'Asia/Dubai', description: 'Gulf Standard Time (GST)' },
  { label: 'Asia/Karachi', value: 'Asia/Karachi', description: 'Pakistan Standard Time (PKT)' },
  { label: 'Asia/Kolkata', value: 'Asia/Kolkata', description: 'India Standard Time (IST)' },
  { label: 'Asia/Dhaka', value: 'Asia/Dhaka', description: 'Bangladesh Standard Time (BST)' },
  { label: 'Asia/Bangkok', value: 'Asia/Bangkok', description: 'Indochina Time (ICT)' },
  { label: 'Asia/Singapore', value: 'Asia/Singapore', description: 'Singapore Time (SGT)' },
  { label: 'Asia/Shanghai', value: 'Asia/Shanghai', description: 'China Standard Time (CST)' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo', description: 'Japan Standard Time (JST)' },
  { label: 'Asia/Seoul', value: 'Asia/Seoul', description: 'Korea Standard Time (KST)' },
  { label: 'Australia/Sydney', value: 'Australia/Sydney', description: 'Australian Eastern Time (AET)' },
  { label: 'Australia/Perth', value: 'Australia/Perth', description: 'Australian Western Time (AWT)' },
  { label: 'Pacific/Auckland', value: 'Pacific/Auckland', description: 'New Zealand Time (NZT)' },
  { label: 'America/Sao_Paulo', value: 'America/Sao_Paulo', description: 'Brasilia Time (BRT)' },
  { label: 'America/Buenos_Aires', value: 'America/Buenos_Aires', description: 'Argentina Time (ART)' },
  { label: 'Africa/Cairo', value: 'Africa/Cairo', description: 'Eastern European Time (EET)' },
  { label: 'Africa/Lagos', value: 'Africa/Lagos', description: 'West Africa Time (WAT)' },
  { label: 'Africa/Nairobi', value: 'Africa/Nairobi', description: 'East Africa Time (EAT)' },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.xl,
  },
  sectionTitle: {
    paddingBottom: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  bottomPad: {
    height: Spacing.huge,
  },
});
