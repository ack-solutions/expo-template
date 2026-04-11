import * as Application from 'expo-application';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';

import { evaluateAppUpdate } from './app-update.service';
import { loadLocalAppUpdateConfig } from './config';
import type { AppUpdateConfigLoader, AppUpdateContextValue, UpdateInfo } from './types';
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

export function AppUpdateProvider({ children, loadConfig }: AppUpdateProviderProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isOpeningStore, setIsOpeningStore] = useState(false);
  const [softDismissed, setSoftDismissed] = useState(false);

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
    void runCheck();
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
    await runCheck();
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
    }),
    [isChecking, lastError, updateInfo, isForceUpdate, isSoftUpdate, isOpeningStore, openStore, recheck],
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
