# Coding Standards

This document defines the coding standards for the project.

The goal is to keep the codebase clean, consistent, reusable, scalable, and easy to maintain.

---

## 1. General Principles

- Always write clean, readable, and maintainable code.
- Prefer consistency over personal preference.
- Follow existing project patterns before introducing a new approach.
- Avoid duplicate code.
- Never use emoji in code or UI — use `@expo/vector-icons/Ionicons` or images.
- Prefer reusable solutions over one-off implementations.
- Keep changes scoped to the actual requirement.
- Write production-ready code.
- Do not maintain legacy patterns unless explicitly asked. Update all usages to the current standard.

---

## 2. Tech Stack Standards

Use the approved project stack only:

- React native expo
- TypeScript
- React Native
- React Hook Form
- pnpm

---

## 3. TypeScript Standards

- Use TypeScript everywhere.
- Add proper types for:
  - component props
  - form values
  - API request payloads
  - API response models
  - hook return values
  - shared utilities
- Avoid `any`.
- Use `any` only when absolutely necessary and no better type is practical.
- Prefer explicit types when it improves clarity.
- Reuse shared types where possible instead of redefining similar types in multiple places.

---

## 4. Naming Standards

### File Names

- Use lowercase file names only.
- Use dash-separated file names.
- Do not use PascalCase file names.
- Do not use camelCase file names for files.

Examples:

- `customer-profile-form.tsx`
- `shipment-tracking-map.tsx`
- `invoice-service.ts`
- `use-customer-orders.ts`

### Variable and Function Names

- Use clear and descriptive names.
- Avoid short unclear names unless they are common and obvious.
- Prefer names based on purpose.

Examples:

- `customerOrders`
- `handleSubmitOrder`
- `invoiceSummary`
- `fetchShipmentTracking`

### Component Names

- Use PascalCase for React component names.

Examples:

- `CustomerProfileForm`
- `ShipmentTrackingMap`

### Hook Names

- Always start custom hooks with `use`.

Examples:

- `use-auth-user`
- `use-customer-orders`

### Service Names

- Name services based on domain or endpoint responsibility.

Examples:

- `order-service`
- `invoice-service`
- `customer-profile-service`

---

## 5. Folder Structure Standards

Organize code by responsibility.

Recommended structure:

- `components/` for shared reusable UI
- `sections/` for page-specific or feature-specific UI blocks
- `hooks/` for reusable custom hooks
- `services/` for API services
- `types/` for shared TypeScript types
- `context/` for React context and providers
- `utils/` for pure helper functions

Rules:

- Shared reusable code belongs in shared folders.
- Page-specific code should stay close to the page or feature.
- Do not place feature-only code in shared folders unless it is truly reusable.

---

## 6. Component Standards

- Keep components small and focused.
- One component should have one clear responsibility.
- Extract repeated UI into reusable components.
- Avoid putting too much business logic into UI components.
- Prefer composition over deeply nested conditional rendering.
- Keep props typed and meaningful.
- Do not create large monolithic components when smaller components are more maintainable.
- Use shared components wherever possible before creating new ones.

### UI Component authoring

- Never use raw `<Text>` for UI copy — use `<AppText>` from `src/components/ui`.
- Variants must be stored as `Record<VariantType, StyleObject>` lookup maps, not as `if/switch` chains.
- All colors, spacing, and radii come from `src/constants/theme.ts` tokens.
- Every interactive element must declare `accessibilityRole` and `accessibilityState`.
- New components must be exported from `src/components/ui/index.ts` and documented in `docs/components.md`.
- New components must have a demo section in `src/app/(tabs)/components.tsx`.

### Full component reference

See `docs/components.md` for all available components, props, variants, and usage examples.

---

## 6a. Utility / Helper Standards

- Do not write standalone exported functions in `src/utils/`.
- Group utilities as **static methods** on domain-specific classes:

| Class | File | Responsibility |
|-------|------|---------------|
| `FormatUtils` | `src/utils/format.ts` | Date, number, string, file size formatting |
| `ValidationUtils` | `src/utils/validation.ts` | Field validation (RHF-compatible) |

- Add new utility methods to the relevant existing class.
- Create a new class only when a method clearly belongs to a new, distinct domain.

```ts
// Correct
const label = FormatUtils.relativeTime(post.createdAt);
const error = ValidationUtils.email(emailValue);

// Wrong — do not write standalone util functions
export function formatDate(date: Date) { … }
```

---

## 7. Form Standards

- Always use React Hook Form for forms.
- Use reusable base field components first.
- Build reusable RHF-integrated field components on top of base fields.
- Reuse standard form field components across the project.

All forms should include:

- proper labels
- validation
- error messages
- default values where needed
- consistent field structure

Do not create one-off form handling patterns unless there is a strong reason.

---

## 8. API Standards

- Never call APIs directly inside pages or UI components.
- All API logic must go through the service layer.
- Services should be organized by module or domain.
- Use a shared Axios instance if Axios is used.
- Use a base service pattern if shared API logic is needed.

Examples:

- authentication service
- order service
- quote service
- invoice service

Keep API-related logic separate from presentation logic.

---

## 9. React Query Standards

- Use React Query for server state.
- Keep fetch and mutation logic inside query hooks or well-structured related files.
- Use React Query for:
  - data fetching
  - mutations
  - caching
  - invalidation
  - loading and error handling patterns

Do not mix raw API calls directly into render logic.

---

## 10. Table Standards

- Use a shared `data-table` component based on TanStack Table.
- Reuse the same standard table pattern across the project.
- Do not create multiple custom table implementations without a valid reason.

Table behavior should stay consistent where possible.

---

## 11. Context and Global State Standards

- Use React context and providers for shared app-level state.
- Keep auth state centralized.
- Shared cross-app behaviors should use provider-based patterns.

Examples:

- auth provider
- confirm dialog provider
- theme provider
- i18n provider
- app-level global providers

Do not scatter global logic across unrelated components.

---

## 12. Styling Standards

- Use stayling in a maintainable and consistent way.
- Reuse shared UI patterns and theme styles.
- Do not hardcode colors directly when theme-based styles should be used.
- Keep spacing, layout, and component styling consistent.
- Prefer reusable style patterns over repeated inline utility combinations when appropriate.
- Use stayling logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `text-start`, `text-end`) instead of physical directional properties (`pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left`, `text-right`) so layouts work in both LTR and RTL.
- Ensure all color usage references theme tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.) so both light and dark themes render correctly.

The UI should be:

- modern
- clean
- responsive
- customer-friendly
- consistent
- correct in both LTR and RTL directions
- correct in both light and dark themes

---

## 13. Reusability Standards

Before adding new code, always check whether similar logic or UI already exists.

Priority:

1. reuse existing component
2. reuse existing hook
3. reuse existing service
4. reuse existing type
5. create new code only when needed

Avoid:

- use emoji
- duplicate components
- duplicate API logic
- duplicate types
- duplicate form patterns
- duplicate table patterns

---

## 14. Code Quality Standards

- Follow ESLint rules.
- Keep code readable.
- Avoid unnecessary complexity.
- Avoid deeply nested logic where a clearer structure is possible.
- Separate concerns properly.
- Remove dead code when appropriate.
- Do not leave placeholder code in production work.
- Keep files reasonably sized and focused.

---

## 15. Documentation Standards

When relevant, update docs for:

- new features
- changed behavior
- important architectural decisions
- new reusable patterns

Important project documentation should remain aligned with implementation.

---

## 18. Things to Avoid

- duplicate code
- hardcoded colors
- hardcoded user-facing strings (use translation keys)
- physical directional CSS properties where logical equivalents exist
- direct API calls in components
- weak or missing types
- unnecessary `any`
- inconsistent naming
- inconsistent form handling
- inconsistent table implementations
- large unrelated refactors
- adding dependencies without need
- mixing business logic into presentational UI without reason
- components that only work in LTR or only in one theme

---

## 19. Definition of Good Code in This Project

Good code in this project should be:

- typed
- readable
- reusable
- modular
- consistent
- maintainable
- aligned with project architecture
- easy to extend later

---
