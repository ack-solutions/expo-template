import { createContext, useContext } from 'react';

import type { AppUpdateContextValue } from './types';

const AppUpdateContext = createContext<AppUpdateContextValue | null>(null);

export function useAppUpdate(): AppUpdateContextValue {
  const ctx = useContext(AppUpdateContext);
  if (!ctx) {
    throw new Error('useAppUpdate must be used within an AppUpdateProvider');
  }
  return ctx;
}

/** For advanced cases (optional provider in tests). */
export { AppUpdateContext };
