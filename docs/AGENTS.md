# AGENTS.md

## Mission

Help implement and maintain the RushHour Customer Portal frontend with clean, reusable, and production-ready output.

## Priority order

1. Read relevant docs before coding.
2. Keep work inside documented frontend scope.
3. Reuse existing patterns and avoid duplication.
4. Keep changes minimal and easy to review.
5. Preserve customer-data isolation requirements.

## Hard constraints

## Cross-cutting requirements

- All layouts must use CSS logical properties for RTL/LTR support.
- All components must use theme tokens for light/dark mode correctness.
- Avoid unnecessary `index.ts` barrel files and duplicate re-exports.

## Canonical standards (single source of truth)

- Coding: `docs/coding-standards.md`
- Forms (RHF + Zod): `docs/form-rhf-zod-standards.md`
- API and server-state: `docs/api-standards.md`
- Design and UI behavior: `docs/design-standards.md`
- Translation: `docs/translation-standards.md`

Use these files as authoritative standards. Do not duplicate or redefine those rules here.

## Expected workflow

1. Confirm route/module and scope from docs.
2. Check existing components/hooks/services/types before creating new code.
3. Implement smallest clean change aligned with standards.
4. Validate typing, consistency, and integration boundaries.
5. Summarize changed files, assumptions, and any follow-up needs.

## Output expectations

- Typed, reusable, maintainable code
- Consistent structure and naming
- Clear loading/error/empty states for UI changes
- No unrelated refactors
- All text via translation keys (no hardcoded strings)
- All forms use RHF + Zod (`zodResolver`) with shared UI fields
- No unwanted barrel exports (`index.ts`) when direct imports are clearer
- Logical CSS properties for direction-neutral layouts
- Theme tokens for all colors (no raw values)

## Security reminder

Customers must only view and act on their own records.
