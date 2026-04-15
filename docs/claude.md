# CLAUDE.md

## Project context

Expo React Native template — a production-ready base for mobile apps. It provides a complete infrastructure layer (navigation, database, error tracking, OTA updates) and a design system so that new features can be built without repeated setup work.

## Primary goal

Deliver a scalable, maintainable, and consistent frontend aligned with approved designs and existing APIs.

---

## Hard rules

1. **No emoji** anywhere in UI or code. Use `@expo/vector-icons/Ionicons` or images instead.
2. **No hardcoded colors.** Always use tokens from `src/constants/theme.ts`.
3. **No hardcoded user-facing strings.** All labels come from props or translation keys.
4. **No legacy patterns.** Update usage everywhere unless explicitly told to maintain backward compatibility.
5. **No raw `<Text>` for UI copy.** Use the `AppText` component from `src/components/ui`.
6. **Utility/helper code lives in static classes** in `src/utils/`. Do not scatter standalone functions.

---

## Stack baseline

| Tool | Version / Note |
|------|---------------|
| Expo | 54 (SDK 54) |
| React Native | 0.81 |
| React | 19 |
| TypeScript | 5.9 |
| Expo Router | 6 (file-based routing) |
| React Hook Form | 7 (all forms) |
| Zod + `@hookform/resolvers` | Required for form validation |
| Drizzle ORM + Expo SQLite | local database |
| pnpm | package manager |

---

## Cross-cutting requirements

- All user-facing text must use translation keys (never hardcoded strings).
- All layouts must use CSS logical properties for full RTL/LTR support.
- All components must work in both light and dark themes using theme tokens.
- Every interactive element must have `accessibilityRole` and `accessibilityState`.

---

## Design system

### Design tokens — `src/constants/theme.ts`

| Export | Contains |
|--------|---------|
| `Colors` | 41 semantic color tokens |
| `Spacing` | 10 spacing steps (xxs → massive) |
| `Radii` | 6 border-radius values (sm → pill) |
| `Typography` | 13 text scale styles |
| `Shadows` | 5 shadow levels (none → xl) |

**Never** import raw color hex values into feature components. Always go through `Colors.*`.

### Component library — `src/components/ui/`

All shared UI components. Import from the single barrel:

```tsx
import { Button, AppInput, Badge, Avatar, EmptyState } from '@/components/ui';
```

Full reference: `docs/components.md`

Live playground: **UI Kit** tab in the running app (`src/app/(tabs)/components.tsx`)

### Component authoring checklist

When adding a new component:
- Props typed with a `interface ComponentNameProps` block
- Variant styles stored as `Record<Variant, Style>` lookup maps
- All colors and spacing from theme tokens only
- `accessibilityRole` set on interactive elements
- Exported from `src/components/ui/index.ts`
- Documented in `docs/components.md`
- Demo section added in `src/app/(tabs)/components.tsx`

---

## Utility classes

Static helper classes in `src/utils/`:

| Class | File | Purpose |
|-------|------|---------|
| `FormatUtils` | `format.ts` | Date, number, string, file size formatting |
| `ValidationUtils` | `validation.ts` | Field validation — returns `true` or error string (RHF-compatible) |

Add new utilities as **static methods on the relevant class**, not as standalone exported functions.

---

## Folder structure

```
src/
├── app/                   # Expo Router screens
│   └── (tabs)/            # Tab-based navigation
├── components/
│   └── ui/                # Shared design system components
├── constants/
│   └── theme.ts           # ALL design tokens
├── database/              # Drizzle ORM + Expo SQLite
├── hooks/                 # Shared custom hooks
├── modules/               # Feature modules (one folder per domain)
│   └── <feature>/
│       ├── components/
│       ├── services/
│       └── hooks/
├── shared/                # Cross-cutting infrastructure (updates, etc.)
├── types/                 # Shared TypeScript types
└── utils/                 # Static utility classes
```

---

## Canonical standards (single source of truth)

- Project overview (fill when forking): `docs/project-overview.md`
- Component reference: `docs/components.md`
- Coding standards: `docs/coding-standards.md`
- Form standards (RHF + Zod): `docs/form-rhf-zod-standards.md`
- API standards: `docs/api-standards.md`
- Design standards: `docs/design-standards.md`
- Translation / copy: `docs/translation-standards.md`
- App updates (EAS / store): `docs/app-updates.md`
- Docs index: `docs/README.md`

These files are authoritative for implementation rules.

---

## Delivery expectations

- Reusable components and module structure
- Typed API integration via service + React Query pattern
- Consistent loading (`Skeleton`), error (`FeedbackDialog`), and empty (`EmptyState`) states on every list/data screen
- Minimal duplication and minimal off-scope change
- Full i18n: all text via translation keys, locale-aware formatting
- Full RTL/LTR: CSS logical properties, direction-aware layouts
- Full theming: light and dark mode working on every screen

---

## Screen implementation pattern

```tsx
import { SafeScreen, Toolbar, EmptyState, Skeleton } from '@/components/ui';

export default function MyScreen() {
  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="My Screen" />
      <ScrollView style={{ flex: 1 }}>
        {isLoading && <SkeletonList />}
        {!isLoading && items.length === 0 && (
          <EmptyState
            icon={<Ionicons name="folder-open-outline" size={48} color={Colors.textTertiary} />}
            title="No items"
            description="Create your first item to get started."
            action={{ label: 'Create', onPress: handleCreate }}
          />
        )}
        {!isLoading && items.map((item) => <ItemRow key={item.id} item={item} />)}
      </ScrollView>
    </SafeScreen>
  );
}
```
