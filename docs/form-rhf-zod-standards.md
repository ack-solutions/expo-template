# Form Standards (React Hook Form + Zod)

This document defines the required form architecture for this template.

Use this as the single source of truth for all new forms and form refactors.

---

## 1) Required stack for forms

- `react-hook-form` for form state and submission lifecycle.
- `zod` for schema validation and type inference.
- `@hookform/resolvers/zod` for RHF + Zod integration.

---

## 2) Core principles

- Use **one schema per form**.
- Infer form types from Zod (`z.infer<typeof schema>`), do not duplicate interfaces.
- Keep validation in Zod schema, not in UI components.
- Keep UI fields controlled through RHF (`Controller` or `useController`).
- All user-facing text must come from translation keys (`t('...')`), including validation messages.
- Reuse shared UI fields (`AppInput`, `AppSelect`, `AppDatePicker`, etc.) instead of creating ad-hoc inputs.

---

## 3) Standard file pattern (clear directory structure)

Use this structure:

```txt
src/
  components/
    form/
      index.ts
      rhf-input-field.tsx
      rhf-select-field.tsx
      rhf-date-field.tsx
      rhf-datetime-field.tsx
      rhf-date-range-field.tsx
  modules/
    <feature>/
      schemas/
        <feature>-form-schema.ts
      components/
        <feature>-form.tsx
      hooks/
        use-<feature>-form.ts   (optional)
```

How to decide:

- Shared RHF wrappers go in `src/components/form/` with `RHF` prefix.
- Feature-specific schema/form files go in the relevant `src/modules/<feature>/...` folder.
- Small forms can keep schema + form in one file, but keep schema and UI sections clearly separated.

---

## 4) Baseline schema pattern

```ts
import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(1, { message: 'validation.fullName.required' }),
  email: z.string().email({ message: 'validation.email.invalid' }),
  category: z.string().min(1, { message: 'validation.category.required' }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
```

Rules:

- Prefer schema-level constraints (`min`, `max`, `regex`, `refine`, `superRefine`).
- Keep messages as translation keys.
- Add transforms only when needed (`trim`, `toLowerCase`, etc.).

---

## 5) Baseline RHF setup

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const form = useForm<ProfileFormValues>({
  resolver: zodResolver(profileSchema),
  defaultValues: {
    fullName: '',
    email: '',
    category: '',
  },
  mode: 'onSubmit',
  reValidateMode: 'onChange',
});
```

Rules:

- Always provide `defaultValues`.
- `mode: 'onSubmit'` is default unless a specific UX requires real-time validation.
- Use `formState.isSubmitting` for submit button loading/disabled state.

---

## 6) Field usage modes (all supported, one preferred)

You can use fields in 3 ways:

1. **Without RHF** (simple local state forms)
2. **With RHF + inline `Controller`**
3. **With RHF wrapper fields (`RHF*`)** ✅ preferred for consistency

Preferred for production forms: **RHF wrapper fields** from `src/components/form/`.

### A) Without RHF (allowed for very simple forms)

```tsx
const [name, setName] = useState('');
const [category, setCategory] = useState('');

<AppInput label={t('profile.name')} value={name} onChangeText={setName} />
<AppSelect
  label={t('profile.category')}
  value={category}
  onChange={(opt) => setCategory(opt.value)}
  options={categoryOptions}
/>
```

### B) RHF + inline `Controller` (valid)

### `AppInput`

```tsx
<Controller
  control={form.control}
  name="fullName"
  render={({ field, fieldState }) => (
    <AppInput
      label={t('profile.fullName')}
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error ? t(fieldState.error.message) : undefined}
      placeholder={t('profile.fullNamePlaceholder')}
    />
  )}
/>
```

### `AppSelect`

```tsx
<Controller
  control={form.control}
  name="category"
  render={({ field, fieldState }) => (
    <AppSelect
      label={t('profile.category')}
      value={field.value}
      onChange={(opt) => field.onChange(opt.value)}
      options={categoryOptions}
      mode="dialog"
      searchable
      error={fieldState.error ? t(fieldState.error.message) : undefined}
    />
  )}
/>
```

### `AppDatePicker`

```tsx
<Controller
  control={form.control}
  name="dueDate"
  render={({ field, fieldState }) => (
    <AppDatePicker
      label={t('task.dueDate')}
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error ? t(fieldState.error.message) : undefined}
    />
  )}
/>
```

### C) RHF wrapper fields (`RHF*`) — preferred

```tsx
import {
  RHFInputField,
  RHFSelectField,
  RHFDateField,
  RHFDateTimeField,
  RHFDateRangeField,
} from '@/components/form';

<RHFInputField
  control={form.control}
  name="fullName"
  label={t('profile.fullName')}
  placeholder={t('profile.fullNamePlaceholder')}
  mapErrorMessage={(key) => t(key)}
/>

<RHFSelectField
  control={form.control}
  name="category"
  label={t('profile.category')}
  options={categoryOptions}
  mode="dialog"
  searchable
  mapErrorMessage={(key) => t(key)}
/>

<RHFDateField
  control={form.control}
  name="dueDate"
  label={t('task.dueDate')}
  mapErrorMessage={(key) => t(key)}
/>
```

---

## 7) Date / DateTime / DateRange schema guidance

Use explicit schema types for date-related fields:

```ts
const schema = z.object({
  dueDate: z.date().nullable(),
  reminderAt: z.date().nullable(),
  range: z.object({
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
  }),
}).superRefine((data, ctx) => {
  const { startDate, endDate } = data.range;
  if (startDate && endDate && endDate < startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['range', 'endDate'],
      message: 'validation.dateRange.endBeforeStart',
    });
  }
});
```

Rules:

- Keep date values as `Date | null` in RHF state.
- Serialize to API format (`ISO string`) in submit handler/service layer, not in UI field components.

---

## 8) Submit and server error handling

Pattern:

1. Run client validation via resolver.
2. Submit using a service/mutation.
3. Map server validation errors to RHF using `setError`.
4. Show generic failure with existing feedback UI (`FeedbackDialog` or toast).

Example mapping:

```ts
setError('email', {
  type: 'server',
  message: 'validation.email.alreadyUsed',
});
```

---

## 9) Reusable RHF field wrappers (preferred standard)

Use wrappers from `src/components/form/`:

- `RHFInputField`
- `RHFSelectField`
- `RHFDateField`
- `RHFDateTimeField`
- `RHFDateRangeField`

Each wrapper should:

- accept `name`, `control`, and UI props,
- translate RHF errors to component `error`,
- stay thin (no business logic).

Do not build one-off wrappers per screen. Extend shared wrappers instead.

---

## 10) AI agent checklist for form code generation

When generating form code, agents must:

1. Create/extend Zod schema first.
2. Infer `FormValues` from schema (`z.infer`).
3. Use `useForm` with `zodResolver`.
4. Prefer `RHF*` wrappers from `src/components/form`; use inline `Controller` only when needed.
5. Map `fieldState.error?.message` through translation function.
6. Use `isSubmitting` on submit button.
7. Keep API calls in service layer or mutation hook (not directly in render).
8. Update docs when introducing new reusable form pattern.

---

## 11) Things to avoid

- Manual form state with multiple `useState` for validated forms.
- Validation logic scattered in component handlers.
- Duplicate form type definitions separate from Zod.
- Hardcoded validation text (must be translation keys).
- Direct API calls inside input components.

---

## 12) Minimum review checklist

- Schema exists and covers all fields.
- `defaultValues` complete and type-safe.
- Every field shows translated validation error.
- Submit uses loading state and prevents double-submit.
- Server errors are mapped to RHF when available.
- No untyped `any` in form values or submit payload.

