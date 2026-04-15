# AGENTS.md

Guidance for AI agents and contributors working in this **expo-template** repository (Expo SDK 54, React Native, TypeScript).

## Mission

Implement and maintain features using the template’s patterns: typed, reusable, production-ready code aligned with the docs listed below.

## Priority order

1. Read the relevant doc(s) for the task before coding.
2. Match existing patterns in `src/` (components, modules, services).
3. Keep diffs minimal and reviewable; avoid unrelated refactors.
4. Preserve security and data-handling expectations of the product that uses this template.

## Hard constraints

- No emoji in UI or source (use `@expo/vector-icons` or images).
- No raw `<Text>` for UI copy — use `AppText` from `src/components/ui`.
- No hardcoded colors in feature code — use `src/constants/theme.ts` tokens.
- No standalone utility functions in `src/utils/` — use static methods on `FormatUtils`, `ValidationUtils`, or add a new domain class (see `docs/coding-standards.md`).
- No direct HTTP calls from screens — services + React Query (see `docs/api-standards.md`).

## Cross-cutting requirements

- User-facing strings: translation keys or props from translated parents (`docs/translation-standards.md`).
- **Web:** CSS logical properties for LTR/RTL. **Native:** start/end and direction-aware layout; avoid fixed left/right where it breaks RTL (`docs/design-standards.md`).
- Light and dark themes: all colors from tokens.
- Interactive controls: `accessibilityRole` and `accessibilityState` where applicable.

## Canonical standards (single source of truth)

- Overview template: `docs/project-overview.md`
- Coding: `docs/coding-standards.md`
- Design: `docs/design-standards.md`
- UI components: `docs/components.md`
- Forms (RHF + Zod): `docs/form-rhf-zod-standards.md`
- API and server state: `docs/api-standards.md`
- Translation / copy: `docs/translation-standards.md`
- OTA / store updates: `docs/app-updates.md`

Do not duplicate those rule sets here; link to them.

## Expected workflow

1. Confirm scope (routes, modules, APIs) from product docs or `docs/project-overview.md`.
2. Search for existing components, hooks, services, and types.
3. Implement the smallest change that fits the standards.
4. Run `pnpm run lint` and fix issues.
5. Summarize changed files, assumptions, and follow-ups.

## Output expectations

- Typed, consistent naming (files: kebab-case; components: PascalCase; hooks: `useCamelCase` in code, `use-kebab-case.ts` on disk).
- Loading / error / empty states for data-driven UI.
- Forms: Zod schema + `zodResolver` + shared `RHF*` fields when applicable.
- No unnecessary barrel `index.ts` files when direct imports are clearer.

## Security reminder

Treat API credentials, tokens, and user data according to your app’s policies. Never log secrets; follow least privilege for keys stored in the client.
