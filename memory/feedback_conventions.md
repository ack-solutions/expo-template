---
name: Feedback: code conventions
description: Explicit rules the user stated about how code should be written in this project
type: feedback
---

No emoji anywhere — use Ionicons or image assets instead.
**Why:** Consistent, professional icon system. Emoji are unpredictable across platforms.
**How to apply:** Any time an icon or visual indicator is needed, use `@expo/vector-icons/Ionicons`. Never suggest emoji as a UI element.

---

Utility/helper functions must be static methods on a class, not standalone exports.
**Why:** Prevents scattered one-off utilities and keeps the utils directory organized.
**How to apply:** Add to `FormatUtils` or `ValidationUtils` in `src/utils/`. Create a new class only for a genuinely distinct domain.

---

Do not maintain legacy patterns — update all usages to the latest standard.
**Why:** Consistency. Stale patterns cause confusion for developers and AI agents.
**How to apply:** When fixing or adding anything, refactor nearby legacy usage to match the current standard. Only preserve legacy code if explicitly asked.

---

Variant-based components are the standard — no one-off inline styles for recurring patterns.
**Why:** Updates in a base component should propagate everywhere automatically.
**How to apply:** Before creating a new styled element, check if a `variant` can be added to an existing component. Use `Record<Variant, Style>` maps not if/switch chains.
