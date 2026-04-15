import type {
  AppUpdateConfig, AppUpdateConfigLoader, UpdateEvaluation, UpdateInfo
} from './types';
import { VersionUtils } from './version-utils';

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function normalizeRules(raw: unknown): raw is NonNullable<AppUpdateConfig['ios']> {
  if (!raw || typeof raw !== 'object') return false;
  const o = raw as Record<string, unknown>;
  const hasStoreUrl = o.storeUrl == null || isNonEmptyString(o.storeUrl);
  const hasAppStoreId = o.appStoreId == null || isNonEmptyString(o.appStoreId);
  return (
    hasStoreUrl &&
    hasAppStoreId &&
    isNonEmptyString(o.title) &&
    isNonEmptyString(o.message)
  );
}

function pickPlatformConfig(
  config: AppUpdateConfig | null,
  platform: 'ios' | 'android' | 'web',
): NonNullable<AppUpdateConfig['ios']> | null {
  if (!config || typeof config !== 'object') return null;
  if (platform === 'ios' && normalizeRules(config.ios)) return config.ios;
  if (platform === 'android' && normalizeRules(config.android)) return config.android;
  return null;
}

type StoreLookupResult = {
  latestVersion: string;
  storeUrl?: string;
};

function buildInfo(
  rules: NonNullable<AppUpdateConfig['ios']>,
  store: StoreLookupResult,
): UpdateInfo {
  return {
    decision: 'soft',
    title: rules.title.trim(),
    message: rules.message.trim(),
    storeUrl: rules.storeUrl?.trim() || store.storeUrl?.trim(),
    appStoreId: rules.appStoreId?.trim(),
    latestVersion: store.latestVersion.trim(),
  };
}

async function fetchIosStoreVersion(params: {
  appId: string | null;
  appStoreId?: string;
}): Promise<StoreLookupResult | null> {
  const id = params.appStoreId?.trim();
  const bundleId = params.appId?.trim();
  const lookupUrl = id
    ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}`
    : bundleId
      ? `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(bundleId)}`
      : null;
  if (!lookupUrl) return null;

  const res = await fetch(lookupUrl);
  if (!res.ok) return null;
  const json = (await res.json()) as { resultCount?: number; results?: Record<string, unknown>[] };
  if (!json.resultCount || !json.results?.length) return null;
  const first = json.results[0];
  const version = typeof first.version === 'string' ? first.version.trim() : '';
  if (!version || !VersionUtils.parse(version)) return null;
  const url = typeof first.trackViewUrl === 'string' ? first.trackViewUrl : undefined;
  return {
    latestVersion: version,
storeUrl: url
  };
}

async function fetchAndroidStoreVersion(params: { appId: string | null }): Promise<StoreLookupResult | null> {
  const appId = params.appId?.trim();
  if (!appId) return null;
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}&hl=en&gl=US`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const html = await res.text();

  // Play Store markup changes often; try a few common patterns.
  const patterns = [
    /"softwareVersion"\s*:\s*"(\d+(?:\.\d+){0,3})"/i,
    /\[\[\["(\d+(?:\.\d+){0,3})"\]\],\[\d+\]\]/i,
    /Current Version[^0-9]*(\d+(?:\.\d+){0,3})/i,
  ];

  let version = '';
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && VersionUtils.parse(match[1])) {
      version = match[1];
      break;
    }
  }
  if (!version) return null;

  return {
    latestVersion: version,
    storeUrl: `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}`,
  };
}

/**
 * Evaluates whether the installed app should soft-prompt or do nothing.
 *
 * `loadConfig` is injectable: point it at `loadLocalAppUpdateConfig` today, or an API-backed
 * loader tomorrow without changing version rules or UI.
 */
export async function evaluateAppUpdate(options: {
  currentVersion: string | null | undefined;
  platform: 'ios' | 'android' | 'web';
  appId: string | null;
  loadConfig: AppUpdateConfigLoader;
}): Promise<UpdateEvaluation> {
  const {
    currentVersion,
    platform,
    appId,
    loadConfig,
  } = options;

  if (platform === 'web') {
    return {
      decision: 'none',
      info: null,
      skipReason: 'web_not_supported',
    };
  }

  let config: AppUpdateConfig | null = null;
  try {
    config = await loadConfig();
  } catch {
    return {
      decision: 'none',
      info: null,
      skipReason: 'config_load_failed',
    };
  }

  const rules = pickPlatformConfig(config, platform);
  if (!rules) {
    return {
      decision: 'none',
      info: null,
      skipReason: 'missing_or_invalid_platform_config',
    };
  }

  const current = typeof currentVersion === 'string' ? currentVersion.trim() : '';
  if (!current) {
    return {
      decision: 'none',
      info: null,
      skipReason: 'missing_current_version',
    };
  }

  if (!VersionUtils.parse(current)) {
    return {
      decision: 'none',
      info: null,
      skipReason: 'invalid_current_version',
    };
  }

  let store: StoreLookupResult | null = null;
  try {
    if (platform === 'ios') {
      store = await fetchIosStoreVersion({
        appId,
        appStoreId: rules.appStoreId,
      });
    } else if (platform === 'android') {
      store = await fetchAndroidStoreVersion({ appId });
    }
  } catch {
    store = null;
  }
  if (!store) {
    return {
      decision: 'none',
      info: null,
      skipReason: 'store_version_unavailable',
    };
  }

  const vsLatest = VersionUtils.compare(current, store.latestVersion);
  if (vsLatest == null) {
    return {
      decision: 'none',
      info: null,
      skipReason: 'uncomparable_current_vs_latest',
    };
  }
  if (vsLatest < 0) {
    return {
      decision: 'soft',
      info: buildInfo(rules, store),
    };
  }

  return {
    decision: 'none',
    info: null,
    skipReason: 'up_to_date',
  };
}
