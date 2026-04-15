# Translation and Copy Standards

This document defines how user-visible text and localization should work in projects based on this template. It complements `docs/coding-standards.md` and `docs/design-standards.md`.

---

## 1. Principles

- **No hardcoded user-facing strings** in components or validation messages that ship to users. Use translation keys (or props passed from a translated parent) consistently.
- **Stable keys** — Prefer hierarchical keys such as `screen.feature.label` or `validation.field.rule` so files stay organized.
- **Parity across locales** — Every locale file should expose the same key set; missing keys should fall back in a predictable way (e.g. default language) once i18n is wired.

---

## 2. Validation and forms

- Zod (and RHF) messages should store **keys**, not literal copy: `{ message: 'validation.email.invalid' }`.
- In the UI, map keys through your `t()` (or equivalent) helper before passing to inputs and dialogs — see `docs/form-rhf-zod-standards.md`.

---

## 3. Formatting

- Dates, numbers, and currencies should respect the active locale when you add i18n (use `Intl` or locale-aware helpers; reuse patterns from `FormatUtils` in `src/utils/format.ts` where applicable).

---

## 4. RTL and copy

- Do not bake directional words (“left”, “right”) into strings when layout is mirrored; describe actions neutrally or use separate keys per direction only if unavoidable.

---

## 5. When this template has no i18n library yet

Projects may introduce `i18next`, `expo-localization` + a custom catalog, or another stack. Until then, **still use key-shaped strings** or a thin `t()` stub so migrating to real translations is mechanical rather than a string hunt.
