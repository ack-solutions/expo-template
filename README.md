# Reusable Expo Template

Reusable Expo + TypeScript + Expo Router template with:

- Generic tab app structure (`Home`, `Workspace`, `Data`, `Settings`)
- Shared UI and theme system
- SQLite setup with Drizzle
- Backup/import helpers
- Firebase dependencies retained
- Sentry + Crashlytics wiring retained

---

## 1) Run the app

### Install

```bash
pnpm install
```

### Start dev server

```bash
pnpm start
```

### Run on platform

```bash
pnpm android
pnpm ios
pnpm web
```

### Validation

```bash
pnpm exec tsc --noEmit
pnpm run lint
```

---

## 2) Build verification

### JS bundle export (quick build health check)

```bash
npx expo export --platform android --platform ios
```

### Native prebuild (required for `expo run:*`)

```bash
npx expo prebuild
```

### Local EAS build (optional)

```bash
npx eas build --local --profile preview --platform android
```

---

## 3) Database + migration workflow (Drizzle + Expo SQLite)

Config files:

- `drizzle.config.ts`
- `src/database/schema/*`
- `src/database/migrations/*`
- `src/database/migrations/migrations.js`

### Generate migration SQL from schema changes

1. Update schema files in `src/database/schema/`.
2. Generate migration:

```bash
pnpm run db:generate
```

This creates SQL files in `src/database/migrations` and updates metadata in `src/database/migrations/meta`.

### IMPORTANT: register migrations for runtime

After generating, ensure `src/database/migrations/migrations.js` exports the generated SQL modules.

Current template keeps this file minimal:

```ts
import journal from './meta/_journal.json';

export default {
  journal,
  migrations: {},
};
```

When you generate migrations, add imports and entries there (or use your preferred generated style) so `useMigrations` can apply them at app startup.

### Apply migrations

Migrations are applied automatically in `DatabaseProvider` on app startup.

---

## 4) Firebase setup (kept in template)

Firebase packages are already present in `package.json`:

- `@react-native-firebase/app`
- `@react-native-firebase/crashlytics`

Template is build-safe by default: Firebase plugins + google services paths are **not** forced in `app.json`.

### Enable Firebase for a new app

1. Add files to project root:
   - `google-services.json`
   - `GoogleService-Info.plist`

2. Update `app.json`:
   - Add `expo.android.googleServicesFile`
   - Add `expo.ios.googleServicesFile`
   - Add plugins:
     - `@react-native-firebase/app`
     - `@react-native-firebase/crashlytics`

Example:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics"
    ]
  }
}
```

3. Run:

```bash
npx expo prebuild
```

---

## 5) New app setup checklist

1. Update app identity in `app.json`
   - `name`, `slug`, `scheme`
   - `ios.bundleIdentifier`
   - `android.package`
2. Update package name in `package.json`
3. Replace placeholder tab screens under `src/app/(tabs)`
4. Create module folders under `src/modules/<feature>`
5. Keep shared/common code in:
   - `src/components/ui`
   - `src/database`
   - `src/shared`
6. If using Firebase, complete section 4
7. Run full checks:

```bash
pnpm exec tsc --noEmit
pnpm run lint
npx expo export --platform android --platform ios
```

---

## 6) Structure notes

- `src/app` contains real route source files.
- Root `app/` contains re-export route files for Expo tooling compatibility.
- Keep module-based organization in `src/modules`.

---

## 7) Documentation index

Authoritative standards for this **Expo React Native** template. Read these before adding features or changing architecture.

| Document | Purpose |
|----------|---------|
| [`docs/project-overview.md`](./docs/project-overview.md) | Product scope and constraints — **fill in when forking** for a real app |
| [`docs/coding-standards.md`](./docs/coding-standards.md) | TypeScript, structure, naming, forms, API, styling, quality |
| [`docs/design-standards.md`](./docs/design-standards.md) | Visual system, themes, RTL, motion, QA checklists |
| [`docs/components.md`](./docs/components.md) | UI kit reference (`src/components/ui/`) |
| [`docs/form-rhf-zod-standards.md`](./docs/form-rhf-zod-standards.md) | React Hook Form + Zod patterns |
| [`docs/api-standards.md`](./docs/api-standards.md) | Services, Axios, React Query, errors |
| [`docs/translation-standards.md`](./docs/translation-standards.md) | Copy, keys, and locale rules |
| [`docs/app-updates.md`](./docs/app-updates.md) | EAS Update vs store releases |
| [`docs/CLAUDE.md`](./docs/CLAUDE.md) | Quick agent / contributor context and stack |
| [`docs/AGENTS.md`](./docs/AGENTS.md) | Agent workflow and constraints |

**Single source of truth:** Do not duplicate long rule lists across files; link to the document above that owns the topic.

