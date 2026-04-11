import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN || 'https://7f3cc490eecc4c8b3c1de894ec49646c@o363293.ingest.us.sentry.io/4511190463479808';

const appVersion =
  Constants.expoConfig?.version ??
  Constants.manifest2?.extra?.expoClient?.version ??
  '0.0.0';

const buildNumber =
  Constants.expoConfig?.ios?.buildNumber ??
  Constants.expoConfig?.android?.versionCode?.toString() ??
  undefined;

Sentry.init({
  dsn,
  enabled: !__DEV__ && !!dsn,
  environment: __DEV__ ? 'development' : 'production',
  release: buildNumber ? `${Constants.expoConfig?.slug ?? 'app'}@${appVersion}+${buildNumber}` : `${Constants.expoConfig?.slug ?? 'app'}@${appVersion}`,
  tracesSampleRate: 0.1,
});

