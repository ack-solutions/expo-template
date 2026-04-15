# Design standards

This document defines the design system standards for the project.

The goal is to keep the UI clean, modern, consistent, reusable, and easy to scale across the application.

---

## 1. Core Principles

- Keep the interface clean and professional.
- Prefer consistency over one-off custom design.
- Reuse shared components and patterns wherever possible.
- Build UI that feels modern, simple, and customer-friendly.
- Focus on clarity, usability, and maintainability.
- Keep the design system lightweight and practical.

---

### Rules

- Use our as the base for common UI components.
- Make proper layout, spacing, responsiveness, and component styling.
- Do not overuse decorative effects or animations.
- Prefer simple and maintainable UI over flashy UI.

---

## 3. General Visual Style

The portal should feel:

- modern
- clean
- lightweight
- professional
- responsive
- easy to understand

### Guidelines

- Use enough whitespace.
- Keep layouts balanced and uncluttered.
- Use clear visual hierarchy.
- Avoid overly dense screens.
- Keep customer-facing screens easy to scan.

---

## 4. Color Rules

- Do not hardcode colors directly in feature components.
- Always use theme-based CSS custom properties (design tokens).
- Every color token must have both a light and dark variant defined in file.
- Keep color usage consistent across the application.
- Use color with purpose, not decoration.

### Recommended Usage

- primary color for main actions
- muted colors for secondary content
- destructive color for delete/remove/danger actions
- success/warning/error colors only where needed

### Rules

- Primary buttons should always look consistent.
- Status colors should be reused consistently.
- Text contrast must remain readable in both light and dark themes.
- Avoid adding random custom colors per page.
- Every new color must be defined as a token with light and dark values — never as a one-off raw value.

---

## 5. Typography Rules

- Keep typography simple and readable.
- Use a consistent heading and text scale across the project.
- Use font weight and size to create hierarchy.
- Avoid too many font sizes on one screen.

### Basic Hierarchy

- page title
- section title
- card title
- body text
- helper text
- table/meta text

### Rules

- Page headings should be clear and prominent.
- Secondary text should be visually softer than primary text.
- Helper text and descriptions should not compete with key content.
- Keep line length readable where possible.

---

## 6. Spacing Rules

- Use consistent spacing throughout the project.
- Prefer standard spacing steps instead of random values.
- Keep internal component spacing and page spacing predictable.

### Rules

- Use consistent gap, padding, and margin patterns.
- Similar layouts should use similar spacing.
- Cards, forms, tables, and sections should follow shared spacing rhythm.
- Avoid tight or crowded layouts.

---

## 7. Layout Rules

- Build responsive layouts by default.
- Keep page structure predictable.
- Use shared layout patterns across pages.

### Common Layout Pattern

- page header
- summary or actions area
- main content section
- supporting sections if needed

### Rules

- Use container widths consistently.
- Keep actions aligned clearly.
- Avoid unnecessary nested wrappers.
- Prefer simple layouts over overly complex structure.

---

## 8. Component Standards

- Reuse shared UI components wherever possible.
- Use standard variants for buttons, inputs, cards, badges, dialogs, and tables.
- Do not create multiple visual styles for the same type of component without a strong reason.

### Shared Components Should Stay Consistent

- buttons
- inputs
- selects
- textareas
- checkboxes
- radios
- dialogs
- drawers
- cards
- badges
- tabs
- tables
- dropdown menus
- pagination

---

## 9. Button Rules

- Use buttons consistently by purpose.
- Keep a clear hierarchy between primary, secondary, ghost, and destructive actions.

### Rules

- One main primary action per section where possible.
- Secondary actions should not compete visually with the main action.
- Destructive actions must be clearly distinguishable.
- Button sizes should remain consistent across similar screens.

---

## 10. Form Design Rules

- Forms must be clean, consistent, and easy to complete.
- Use shared field components across the project.
- Keep field spacing and alignment consistent.

### Every form should include

- label
- input control
- validation message
- optional help text when needed

### Rules

- Use React Hook Form-based shared field components.
- Keep labels clear and short.
- Show validation messages consistently.
- Group related fields logically.
- Do not create inconsistent one-off form layouts.

---

## 11. Card and Surface Rules

- Use cards and surfaces consistently for grouped content.
- Keep surface styling subtle and clean.
- Avoid heavy borders, shadows, or visual noise.

### Rules

- Similar card types should use similar padding and structure.
- Keep card titles and actions aligned consistently.
- Use cards to improve grouping, not to add unnecessary decoration.

---

## 13. Status and Feedback Rules

Use standard visual treatment for:

- loading states
- empty states
- success states
- warning states
- error states

### Rules

- Loading states should be subtle and consistent.
- Empty states should guide the user clearly.
- Success, warning, and error messages should be easy to understand.
- Do not use inconsistent alert styles across pages.

---

## 14. Dialog and Overlay Rules

- Use dialogs, drawers, dropdowns, and popovers consistently.
- Use overlays only when they improve the user flow.

### Rules

- Dialogs should be used for confirmation, focused forms, or critical actions.
- Destructive actions should use clear confirmation patterns.
- Keep modal content concise and structured.
- Avoid stacking too many overlay interactions.

---

## 15. Icons and Visual Elements

- Use icons only when they improve clarity.
- Keep icon usage consistent across navigation, actions, and statuses.
- Avoid decorative icon overuse.

### Rules

- Icons should support meaning, not replace labels where labels are needed.
- Use consistent icon sizing in similar contexts.
- Keep icon placement aligned with text and controls.

---

## 16. Motion and Effects

- Motion should be subtle and purposeful.
- Prefer small transition and interaction feedback.
- Avoid excessive animation.

### Rules

- Use Magic UI carefully and only where it adds value.
- Keep transitions smooth and minimal.
- Do not make animations a distraction.
- Prioritize performance and usability over effects.

---

## 17. Dark and Light Theme Rules

The portal supports light, dark, and system themes. System auto-detects from the user's OS/browser preference.

### Behavior

- On first visit, follow the user's OS preference (`prefers-color-scheme`).
- Provide a manual toggle (light / dark / system) in the header or settings.
- Persist the user's choice across sessions.
- Theme changes should be smooth with no flash of wrong theme on page load.

## 18. RTL and LTR Layout Rules

The portal supports LTR (English) and RTL (Hebrew) layouts, with the ability to add more languages in the future.

### Behavior

- The layout direction is set on the `<html>` element based on the active language.
- Hebrew activates `dir="rtl"`; English activates `dir="ltr"`.
- The entire UI flips automatically using CSS logical properties — no separate RTL layouts.

App direction must always come from the shared `getDirection()` / `isRtlLocale()` helper. Never hardcode `dir="rtl"` or `dir="ltr"` on the `<html>` element or on components unless required for isolated content.

When `dir="rtl"` is set, CSS logical properties and Tailwind logical utilities automatically flip the layout. No separate RTL stylesheet or layout is needed.

### CSS Logical Properties

Use logical utilities instead of physical directional utilities so layouts auto-flip:

| Physical (avoid)     | Logical (use)       |
| -------------------- | ------------------- |
| `pl-4` / `pr-4`      | `ps-4` / `pe-4`     |
| `ml-4` / `mr-4`      | `ms-4` / `me-4`     |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left`          | `text-start`        |
| `text-right`         | `text-end`          |
| `rounded-l-md`       | `rounded-s-md`      |
| `rounded-r-md`       | `rounded-e-md`      |
| `border-l`           | `border-s`          |
| `border-r`           | `border-e`          |

---

## 19. Internationalization Design Rules

All user-facing text must come from translation files, not hardcoded in components.

### Design Rules

- Design layouts to accommodate varying text lengths (Hebrew and English text lengths differ significantly).
- Allow buttons, labels, and menu items to grow with longer translations — do not set fixed widths on text containers.
- Do not depend on specific character counts for layout alignment.
- Truncation with tooltips is acceptable for very long translations in constrained spaces.
- Number formatting, date formatting, and currency display must respect the active locale.

### Component-Level Rules

- **Shared components** (buttons, inputs, cards, dialogs, tables, badges, navigation): must accept translated labels/placeholders via props or translation keys, use logical properties, and use theme tokens.
- **Forms**: labels, placeholders, helper text, and validation messages must come from translation files. Field alignment must adapt to RTL/LTR automatically.
- **Tables**: header labels, empty states, and action labels must be translated. Table alignment should use logical properties.
- **Navigation**: all menu items, breadcrumbs, and route titles must come from translation files. Navigation layout must work in both directions.

### Rules

- No visible string in the UI should be hardcoded.
- Empty states, loading text, error messages, and tooltips must also be translated.
- Placeholder text in inputs must be translated.

---

## 19.1. QA Checklists

### i18n Checklist

- [ ] All user-facing strings use translation keys (no hardcoded text).
- [ ] All locale files have identical key structures.
- [ ] Missing keys fall back to English gracefully.
- [ ] Interpolation and pluralization work in all supported languages.
- [ ] Date and number formatting respects the active locale.

### RTL Checklist

- [ ] Layout mirrors correctly in RTL mode.
- [ ] No physical left/right properties that break in RTL.
- [ ] Directional icons flip appropriately.
- [ ] Forms and inputs align correctly in RTL.
- [ ] Tables, cards, and lists align correctly in RTL.
- [ ] Scrollbars and overflow behave correctly in RTL.

### Theme Checklist

- [ ] All pages render correctly in light theme.
- [ ] All pages render correctly in dark theme.
- [ ] No hardcoded colors bypass theme tokens.
- [ ] Shadows, borders, and overlays adapt to the theme.
- [ ] No flash of wrong theme on page load.
- [ ] Theme toggle works and persists the preference.
- [ ] System preference detection works on first visit.

---

## 20. Responsive Design Rules

- All screens must work well on common desktop, tablet, and mobile sizes.
- Build mobile-friendly layouts even if desktop is the primary experience.

### Rules

- Avoid horizontal overflow.
- Keep actions accessible on smaller screens.
- Stack content cleanly when space becomes limited.
- Tables and dense data areas should degrade gracefully on smaller screens.

---

## 22. Reuse Rules

Before creating a new UI pattern, check whether the design system already has a usable solution.

Priority:

1. reuse existing component
2. extend shared component carefully
3. create a new shared component only when needed

Do not create duplicate visual patterns for the same problem.

---

## 23. Things to Avoid

- hardcoded colors in feature components
- hardcoded user-facing text in components
- physical directional CSS properties (left/right/pl/pr) where logical equivalents exist
- components that only work in one theme or one direction
- inconsistent spacing
- inconsistent button styles
- inconsistent form layouts
- dense and cluttered screens
- unnecessary animation
- multiple visual styles for the same component type
- decorative UI without functional value
- page-specific design decisions that break global consistency

---

## 24. Definition of Good UI in This Project

Good UI in this project should be:

- clean
- modern
- consistent
- readable
- responsive
- accessible
- reusable
- easy to maintain
- correct in both LTR and RTL
- correct in both light and dark themes
- fully translatable (no hardcoded text)

---

## 25. Final Rule

When in doubt:

- keep it simple
- reuse existing patterns
- follow theme styles
- prioritize clarity
- avoid visual noise
- design for consistency first
- verify all four combinations: Dark, Light,
