# CLAUDE.md

## Project context

## Primary goal

Deliver a scalable, maintainable, and consistent frontend aligned with approved designs and existing APIs.

## Hard rules

## Stack baseline

- react native expo
- TypeScript
- react native
- React Hook Form
- pnpm

## Cross-cutting requirements

- All user-facing text must use translation keys (never hardcoded strings).
- All layouts must use CSS logical properties for full RTL/LTR support.
- All components must work in both light and dark themes using theme tokens.

## Canonical standards (single source of truth)

- Coding standards: `docs/coding-standards.md`
- API standards: `docs/api-standards.md`
- Design standards: `docs/design-standards.md`
- Translation: `docs/translation-standards.md`

These files are authoritative for implementation rules. Keep this file focused on project context and guardrails.

## Delivery expectations

- Reusable components and module structure
- Typed API integration via service + React Query pattern
- Responsive and accessible customer-facing UI
- Consistent loading/error/empty states
- Minimal duplication and minimal off-scope change
- Full i18n: all text via translation keys, locale-aware formatting
- Full RTL/LTR: CSS logical properties, direction-aware layouts
- Full theming: light and dark mode working on every screen
