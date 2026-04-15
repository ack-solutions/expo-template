---
name: Project UI system design decisions
description: What was built in the component library, file locations, and design decisions
type: project
---

Built a complete MUI-style variant-based component system in `src/components/ui/`.

**Why:** Establish a single source of truth for UI so any change in a base component propagates everywhere, and AI agents can reliably generate consistent code.

**How to apply:** Always import from `src/components/ui/index.ts`. Check `docs/components.md` for full API. Run UI Kit tab in app for visual reference.

## Components added (Apr 2026)

- `AppText` — typography with 12 variants and 8 color tokens
- `Badge` — status indicators (primary/success/error/warning/neutral, 3 sizes, dot mode)
- `Avatar` — image or initials with stable color derivation, 5 sizes, 2 shapes
- `Chip` — filter/tag chips (filled/outlined/ghost, selectable, removable)
- `Divider` — horizontal/vertical with optional label
- `AppInput` — labeled text input (outlined/filled, 3 sizes, error/hint, icon slots)
- `SearchBar` — search input with clear button
- `AppCheckbox` — accessible checkbox with label/description/indeterminate
- `AppSwitch` — labeled native Switch wrapper
- `RadioGroup` — single-select with vertical/horizontal layout
- `ListItem` — standard list row (arrow/custom accessory, divider, left/right slots)
- `EmptyState` — no-data guide with icon, title, description, primary+secondary actions
- `Skeleton / SkeletonText / SkeletonCard` — animated loading placeholders
- `ProgressBar` — animated linear progress (4 variants, 3 sizes, label)

## Utility classes added

- `FormatUtils` (`src/utils/format.ts`) — date, number, currency, string, file size
- `ValidationUtils` (`src/utils/validation.ts`) — RHF-compatible validators

## Demo screen

`src/app/(tabs)/components.tsx` — "UI Kit" tab shows every component with all variants.

## Animation system (Apr 2026)

All interactive components use `react-native-reanimated` (v4). Standard patterns:
- Press/scale feedback: `withSpring({ damping: 18, stiffness: 280, mass: 0.6 })`
- Color transitions: `interpolateColor` + `withTiming({ duration: 180 })`
- Never use legacy `react-native` Animated API for new components

Components with animations: Button (scale), AppPressableCard (scale), Chip (scale), AppCheckbox (box color + icon spring), AppInput (border+label color), SearchBar (border+bg color)

## Touch target standard (Apr 2026)

All interactive components meet 44 pt minimum (Apple HIG):
- Button: sm=40, md=48, lg=56
- AppInput: sm=40, md=48, lg=56
- SearchBar: 48 pt
- Checkbox/Switch rows: 44 pt min

## Stack layout component (Apr 2026)

`Stack`, `VStack`, `HStack` in `src/components/ui/stack.tsx`.
- `gap` accepts raw numbers OR Spacing token keys (`'sm'`, `'md'`, `'lg'`, etc.)
- `padding`, `paddingH`, `paddingV` same token system
- Replaces ad-hoc `flexDirection` + `gap` + `marginBottom` patterns everywhere

## Key file locations

- Design tokens: `src/constants/theme.ts`
- Barrel export: `src/components/ui/index.ts`
- Component docs: `docs/components.md`
- Project guardrails: `docs/CLAUDE.md`
