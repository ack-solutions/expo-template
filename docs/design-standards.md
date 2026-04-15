# Design Standards

This document defines the design system standards for this Expo / React Native template and any app built from it.

The goal is to keep the UI clean, modern, consistent, reusable, and easy to scale across the application.

---

## 1. Core Principles

- Keep the interface clean and professional.
- Prefer consistency over one-off custom design.
- Reuse shared components and patterns wherever possible.
- Build UI that feels modern, simple, and customer-friendly.
- Focus on clarity, usability, and maintainability.
- Keep the design system lightweight and practical.
- Always leave room for creativity: explore fresh UI ideas when they improve user experience, while still respecting accessibility, consistency, and design-token standards.

---

### Rules

- Use shared UI from `src/components/ui/` as the base for common patterns (see `docs/components.md`).
- Apply consistent layout, spacing, responsiveness, and component styling using theme tokens.
- Do not overuse decorative effects or animations.
- Prefer simple and maintainable UI over flashy UI.

---

## 2. General Visual Style

The app should feel:

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

## 3. Color Rules

- Do not hardcode colors directly in feature components.
- Always use theme-based design tokens (`src/constants/theme.ts`).
- Every semantic color must work in both light and dark themes (token pairs or resolved theme values).
- Keep color usage consistent across the application.
- Use color with purpose, not decoration.

### Rules

- Primary buttons should always look consistent.
- Status / Enums / Chips / Label colors should be reused consistently.
- Text contrast must remain readable in both light and dark themes.
- Avoid adding random custom colors per page.
- Every new color must be defined as a token with light and dark values — never as a one-off raw value.

---

## 4. Typography Rules

- Keep typography simple and readable.
- Use a consistent heading and text scale across the project.
- Use font weight and size to create hierarchy.
- Avoid too many font sizes on one screen.

---

## 5. Spacing Rules

- Use consistent spacing throughout the project.
- Prefer standard spacing steps instead of random values.
- Keep internal component spacing and page spacing predictable.

### Rules

- Use consistent gap, padding, and margin patterns.
- Similar layouts should use similar spacing.
- Cards, forms, tables, and sections should follow shared spacing rhythm.
- Avoid tight or crowded layouts.

---

## 6. Layout Rules

- Build responsive layouts by default that support all devices.

### Rules

- Use container widths consistently.
- Keep actions aligned clearly.
- Avoid unnecessary nested wrappers.
- Prefer simple layouts over overly complex structure.

---

## 7. Component Standards

- Reuse shared UI components wherever possible.
- Use standard variants for buttons, inputs, cards, badges, dialogs, and tables.
- Do not create multiple visual styles for the same type of component without a strong reason.
- Keep one component per file by default. If multiple small components belong to the same feature and are tightly related, place them in a feature folder and organize them clearly. Only keep multiple components in a single file when there is a strong reason.

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

## 8. Button Rules

- Use buttons consistently by purpose.
- Keep a clear hierarchy between primary, secondary, ghost, and destructive actions.
- Destructive actions must be clearly distinguishable.
- Button sizes should remain consistent across similar screens.

---

## 9. Form Design Rules

- Forms must be clean, consistent, and easy to complete.
- Use shared field components across the project.
- Keep field spacing and alignment consistent.
- If a new specialized field is needed, create a reusable component (for example: upload-related fields, specific list selectors, or autocomplete fields such as country and customer autocomplete).

### Every form field should include

- a clear label
- an appropriate input control
- a validation message when invalid
- optional helper text when needed

### Rules

- Use React Hook Form-based shared field components.
- Show validation messages consistently.
- Group related fields logically.
- Do not create inconsistent one-off form layouts.

---

## 10. Card and Surface Rules

- Use cards and surfaces consistently for grouped content.
- Keep surface styling subtle and clean.
- Avoid heavy borders, shadows, or visual noise.

### Rules

- Similar card types should use similar padding and structure.
- Keep card titles and actions aligned consistently.
- Use cards to improve grouping, not to add unnecessary decoration.

---

## 11. Status and Feedback Rules

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

## 12. Dialog and Overlay Rules

- Use dialogs, drawers, dropdowns, and popovers consistently.
- Use overlays only when they improve the user flow.

### Rules

- Dialogs should be used for confirmation, focused forms, or critical actions.
- Destructive actions should use clear confirmation patterns.
- Keep modal content concise and structured.
- Avoid stacking too many overlay interactions.

---

## 13. Icons and Visual Elements

- Use icons only when they improve clarity.
- Keep icon usage consistent across navigation, actions, and statuses.
- Avoid decorative icon overuse.

### Rules

- Icons should support meaning, not replace labels where labels are needed.
- Use consistent icon sizing in similar contexts.
- Keep icon placement aligned with text and controls.

---

## 14. Motion and Effects

- Motion should be subtle and purposeful.
- Prefer small transition and interaction feedback.
- Avoid excessive animation.

### Rules

- Use **react-native-reanimated** for interactive motion (see `docs/components.md` — Animation System). Avoid the legacy `Animated` API for new work.
- Keep transitions smooth and minimal.
- Do not make animations a distraction.
- Prioritize performance and usability over effects.

---

## 15. Dark and Light Theme Rules

The app must support light, dark, and system themes on both mobile (React Native) and web.

### Behavior

- On first launch/visit, follow the device or browser system preference.
- Provide a manual theme toggle (`light` / `dark` / `system`) in settings.
- Persist user choice across sessions.
- Theme changes should be smooth and avoid visual flicker.
- All surfaces, text, borders, and states must come from theme tokens (no hardcoded colors).

### Platform notes

- **Web**: respect `prefers-color-scheme` and apply theme before first paint when possible.
- **React Native**: use system color scheme APIs and update screens/components reactively.

## 16. QA Checklists

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

## 17. Responsive Design Rules

- All screens must work well on common phone, tablet, and desktop (web) sizes.
- Build mobile-friendly layouts; treat small screens as the default constraint.

### Rules

- Avoid horizontal overflow unless horizontal scrolling is an intentional feature.
- Keep actions accessible on smaller screens.
- Stack content cleanly when space becomes limited.
- Tables and dense data areas should degrade gracefully on smaller screens.

---

## 18. Reuse Rules

Before creating a new UI pattern, check whether the design system already has a usable solution.

Priority:

1. reuse existing component
2. extend shared component carefully
3. create a new shared component only when needed

Do not create duplicate visual patterns for the same problem.

---

## 19. Things to Avoid

- hardcoded colors in feature components
- hardcoded user-facing text in components
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

## 20. Definition of Good UI in This Project

Good UI in this project should be:

- clean
- modern
- consistent
- readable
- responsive
- accessible
- reusable
- user friendly and easy to navigate
- easy to maintain
- correct in both light and dark themes
- fully translatable (no hardcoded text)

---

## 21. Final Rule

When in doubt:

- keep it simple
- reuse existing patterns
- follow theme styles
- prioritize clarity
- avoid visual noise
- design for consistency first
- verify **light and dark** themes and **LTR and RTL** on representative screens before shipping
