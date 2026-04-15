import * as Application from 'expo-application';
import React, {
 useCallback, useEffect, useMemo, useState 
} from 'react';
import {
 Linking, Platform, StyleSheet, View 
} from 'react-native';

import { evaluateAppUpdate } from './app-update.service';
import { loadLocalAppUpdateConfig } from './config';
import { runEasOtaCheck } from './eas-ota';
import type {
 AppUpdateConfigLoader, AppUpdateContextValue, AppUpdateOtaState, UpdateInfo 
} from './types';
import { UPDATE_STRATEGY } from './update-strategy';
import { UpdateDialog } from './update-dialog';
import { AppUpdateContext } from './use-app-update';

export type AppUpdateProviderProps = {
  children: React.ReactNode;
  /** Inject remote config later by passing a fetch-backed loader; defaults to local static config. */
  loadConfig?: AppUpdateConfigLoader;
};

function resolveNativePlatform(): 'ios' | 'android' | 'web' {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

function buildStoreUrl(info: UpdateInfo | null, platform: 'ios' | 'android' | 'web'): string | null {
  const direct = info?.storeUrl?.trim();
  if (direct) return direct;

  if (platform === 'android') {
    const appId = Application.applicationId?.trim();
    if (!appId) return null;
    return `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}`;
  }

  if (platform === 'ios') {
    const id = info?.appStoreId?.trim();
    if (!id) return null;
    return `https://apps.apple.com/app/id${encodeURIComponent(id)}`;
  }

  return null;
}

const initialOta: AppUpdateOtaState = {
  status: 'idle',
  skipReason: null,
  error: null,
};

export function AppUpdateProvider({ children, loadConfig }: AppUpdateProviderProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isOpeningStore, setIsOpeningStore] = useState(false);
  const [softDismissed, setSoftDismissed] = useState(false);
  const [ota, setOta] = useState<AppUpdateOtaState>(initialOta);

  const resolveLoader = useCallback<() => AppUpdateConfigLoader>(() => {
    return loadConfig ?? loadLocalAppUpdateConfig;
  }, [loadConfig]);
  const nativePlatform = resolveNativePlatform();

  const runCheck = useCallback(async () => {
    setIsChecking(true);
    setLastError(null);
    setSoftDismissed(false);

    try {
      const currentVersion = Application.nativeApplicationVersion ?? null;
      const evaluation = await evaluateAppUpdate({
        currentVersion,
        platform: nativePlatform,
        appId: Application.applicationId ?? null,
        loadConfig: resolveLoader(),
      });

      setUpdateInfo(evaluation.info);
    } catch {
      setUpdateInfo(null);
      setLastError('update_check_failed');
    } finally {
      setIsChecking(false);
    }
  }, [nativePlatform, resolveLoader]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (UPDATE_STRATEGY.easOta.enabled) {
        setOta({
 status: 'checking',
skipReason: null,
error: null 
});
        const result = await runEasOtaCheck(UPDATE_STRATEGY.easOta);
        if (cancelled) return;

        if (result.kind === 'skipped') {
          setOta({
 status: 'skipped',
skipReason: result.reason,
error: null 
});
        } else if (result.kind === 'error') {
          setOta({
 status: 'error',
skipReason: null,
error: result.message 
});
        } else if (result.kind === 'up_to_date') {
          setOta({
 status: 'up_to_date',
skipReason: null,
error: null 
});
        } else if (result.kind === 'downloaded') {
          setOta({
 status: 'downloaded',
skipReason: null,
error: null 
});
          if (result.reloaded) {
            return;
          }
        }
      } else {
        setOta({
 status: 'skipped',
skipReason: 'disabled_in_config',
error: null 
});
      }

      if (UPDATE_STRATEGY.storeVersionPrompt.enabled) {
        await runCheck();
      } else {
        setIsChecking(false);
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, [runCheck]);

  const isForceUpdate = false;
  const isSoftUpdate = updateInfo?.decision === 'soft';

  const openStore = useCallback(async () => {
    const url = buildStoreUrl(updateInfo, nativePlatform);
    if (!url) {
      setLastError('missing_store_url');
      return;
    }
    setLastError(null);
    setIsOpeningStore(true);
    try {
      const supported = await Linking.canOpenURL(url).catch(() => true);
      if (!supported) {
        setLastError('store_url_not_supported');
        return;
      }
      await Linking.openURL(url);
    } catch {
      setLastError('open_store_failed');
    } finally {
      setIsOpeningStore(false);
    }
  }, [nativePlatform, updateInfo]);

  const recheck = useCallback(async () => {
    if (UPDATE_STRATEGY.easOta.enabled) {
      setOta({
 status: 'checking',
skipReason: null,
error: null 
});
      const result = await runEasOtaCheck(UPDATE_STRATEGY.easOta);
      if (result.kind === 'skipped') {
        setOta({
 status: 'skipped',
skipReason: result.reason,
error: null 
});
      } else if (result.kind === 'error') {
        setOta({
 status: 'error',
skipReason: null,
error: result.message 
});
      } else if (result.kind === 'up_to_date') {
        setOta({
 status: 'up_to_date',
skipReason: null,
error: null 
});
      } else if (result.kind === 'downloaded') {
        setOta({
 status: 'downloaded',
skipReason: null,
error: null 
});
        if (result.reloaded) return;
      }
    } else {
      setOta({
 status: 'skipped',
skipReason: 'disabled_in_config',
error: null 
});
    }

    if (UPDATE_STRATEGY.storeVersionPrompt.enabled) {
      await runCheck();
    } else {
      setIsChecking(false);
    }
  }, [runCheck]);

  const value = useMemo<AppUpdateContextValue>(
    () => ({
      isChecking,
      lastError,
      updateInfo,
      isForceUpdate,
      isSoftUpdate,
      isOpeningStore,
      openStore,
      recheck,
      ota,
    }),
    [
isChecking,
lastError,
updateInfo,
isForceUpdate,
isSoftUpdate,
isOpeningStore,
openStore,
recheck,
ota
],
  );

  const showSoftDialog = isSoftUpdate && updateInfo != null && !softDismissed;

  return (
    <AppUpdateContext.Provider value={value}>
      <View style={styles.flex}>{children}</View>
      {updateInfo ? (
        <UpdateDialog
          visible={showSoftDialog}
          title={updateInfo.title}
          message={updateInfo.message}
          onLater={() => setSoftDismissed(true)}
          onUpdateNow={openStore}
          loading={isOpeningStore}
        />
      ) : null}
    </AppUpdateContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
