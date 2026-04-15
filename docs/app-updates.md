# App updates: EAS OTA vs store releases

This template supports **two separate mechanisms**. You can enable either or both from `src/shared/app-update/update-strategy.ts`.

| Mechanism | What it updates | User experience |
|-----------|-----------------|-----------------|
| **EAS Update** (`expo-updates`) | JavaScript, assets, and most JS-only changes | Download in the background; optional immediate reload. **No** App Store / Play review for these changes. |
| **Store version prompt** | Requires a **new native binary** (new `eas build`) | Compares the installed app version to the listing on the App Store / Play Store and can show a dialog that opens the store. |

They solve different problems:

- Ship a bugfix in React code → **EAS Update** (`eas update`).
- Change native code, permissions, SDK, or anything that is not in the JS bundle → **new store build**; use the **store prompt** to nudge users off very old binaries.

---

## 1. EAS Update (Expo OTA)

### How it works

- Production builds include `expo-updates` and an `updates.url` in `app.json` (EAS Update endpoint).
- **`runtimeVersion`** must match between the binary and the update. This project uses `runtimeVersion.policy: appVersion` in `app.json`, so it tracks `expo.version` (e.g. `1.0.0`). When you bump the app version for a new store release, ship a matching native build before relying on OTA for that version line.
- The template runs a **JS-controlled** check on launch via `runEasOtaCheck()` in `src/shared/app-update/eas-ota.ts`, controlled by `UPDATE_STRATEGY.easOta` in `update-strategy.ts`.
- `app.json` sets `"checkAutomatically": "NEVER"` so the native module does not duplicate the same check; only the JS path runs (single network request per cold start). If you prefer **native-only** automatic checks, set `checkAutomatically` to `"ON_LOAD"` and set `easOta.checkOnLaunch` to `false` in `UPDATE_STRATEGY`.

### Configure (template)

Edit **`src/shared/app-update/update-strategy.ts`**:

```ts
export const UPDATE_STRATEGY = {
  easOta: {
    enabled: true,
    checkOnLaunch: true,
    reloadImmediately: true,
  },
  // ...
};
```

- **`reloadImmediately: true`** — After download, the app calls `Updates.reloadAsync()` so the new bundle runs right away.
- **`reloadImmediately: false`** — Update is downloaded and applied on the **next** cold start.

### Publish an OTA update

```bash
eas update --branch production --message "Describe the change"
```

Use the same **channel** your build was configured with (EAS Build → channel / branch). Development clients and Expo Go behave differently; test OTA on a **release** build from EAS.

### Inspect state in the app

`useAppUpdate()` exposes **`ota`** (`status`, `skipReason`, `error`) for the EAS Update pass.

---

## 2. Store version prompt (without EAS OTA)

This is **not** OTA: it reads the public App Store / Play listing version (via iTunes lookup and Play HTML) and compares it to `expo-application`’s `nativeApplicationVersion`. If the store is newer, it can show `UpdateDialog` and open the store.

Configure copy and IDs in **`src/shared/app-update/config.ts`**. Toggle with:

```ts
storeVersionPrompt: { enabled: true } // or false
```

in **`update-strategy.ts`**.

Optional: pass a remote `loadConfig` to `AppUpdateProvider` that returns the same JSON shape as `APP_UPDATE_CONFIG` (see `src/shared/app-update/index.ts` comments).

---

## 3. “Without Expo” / self-hosted OTA

Expo’s path is **EAS Update** + `expo-updates` (recommended with Expo).

Alternatives people use outside a fully managed Expo workflow:

- **Self-hosted Expo Updates** — Point `updates.url` at a server that implements the [Expo Updates protocol](https://docs.expo.dev/technical-specs/expo-updates-1/). Overview and configuration: [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/) (custom update server). Example implementation: [custom-expo-updates-server](https://github.com/expo/custom-expo-updates-server) on GitHub.
- **Custom delivery** — Ship your own JS bundle and swap it via native APIs; high effort and easy to get wrong; not recommended unless you have strong requirements.

This template does **not** wire a self-hosted server; it expects the EAS Update URL in `app.json`. You can still add a second integration later by extending `eas-ota.ts` or using `Updates.setUpdateURLAndRequestHeadersOverride` (expert-only, with anti-bricking measures understood).

---

## 4. Quick checklist

1. **EAS project** — `extra.eas.projectId` in `app.json` matches your Expo project.
2. **Publish OTA** — `eas update` on the correct branch/channel.
3. **Store prompt** — Set real `appStoreId` / package name in `config.ts` before production.
4. **Runtime** — After changing native code or `runtimeVersion` rules, run a new **`eas build`**; OTA only updates the JS bundle for compatible binaries.

For more detail, see [EAS Update](https://docs.expo.dev/eas-update/introduction/) in the official Expo documentation.
