import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

type CrashlyticsFn = typeof import('@react-native-firebase/crashlytics').default;
type CrashlyticsAPI = ReturnType<CrashlyticsFn>;

let crashlyticsDefault: CrashlyticsFn | null | undefined;

function getCrashlytics(): CrashlyticsAPI | null {
  if (Platform.OS === 'web') return null;
  // Expo Go does not include custom native modules (Firebase).
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    return null;
  }
  if (crashlyticsDefault === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      crashlyticsDefault = require('@react-native-firebase/crashlytics').default;
    } catch {
      crashlyticsDefault = null;
    }
  }
  if (!crashlyticsDefault) return null;
  try {
    return crashlyticsDefault();
  } catch {
    return null;
  }
}

function safeToSendToCrashlytics() {
  // In dev we keep Crashlytics quiet to reduce noise.
  // Crashlytics also needs a native build (EAS/dev-client).
  return !__DEV__;
}

export function crashlyticsLog(message: string) {
  if (!safeToSendToCrashlytics()) return;
  const cl = getCrashlytics();
  if (!cl) return;
  try {
    cl.log(message);
  } catch {
    // ignore (e.g. missing native module)
  }
}

export function crashlyticsRecordError(error: unknown, context?: Record<string, string>) {
  if (!safeToSendToCrashlytics()) return;
  const cl = getCrashlytics();
  if (!cl) return;
  try {
    if (context) {
      Object.entries(context).forEach(([k, v]) => cl.setAttribute(k, v));
    }
    cl.recordError(error instanceof Error ? error : new Error(String(error)));
  } catch {
    // ignore
  }
}

export function installCrashlyticsGlobalHandlers() {
  if (!safeToSendToCrashlytics()) return;

  try {
    const g = global as typeof globalThis & {
      ErrorUtils?: {
        getGlobalHandler?: () => ((e: unknown, isFatal?: boolean) => void) | undefined;
        setGlobalHandler?: (fn: (e: unknown, isFatal?: boolean) => void) => void;
      };
    };
    const defaultHandler = g.ErrorUtils?.getGlobalHandler?.();

    g.ErrorUtils?.setGlobalHandler?.((error: unknown, isFatal?: boolean) => {
      crashlyticsRecordError(error, { isFatal: String(!!isFatal) });
      defaultHandler?.(error, isFatal);
    });
  } catch {
    // ignore
  }
}
