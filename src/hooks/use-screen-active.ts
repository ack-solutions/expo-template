import { useIsFocused } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';

import { useIsMountedRef } from '@/hooks/use-is-mounted-ref';

export function useScreenActive() {
  const isMountedRef = useIsMountedRef();
  const isFocused = useIsFocused();

  const isFocusedRef = useRef(isFocused);
  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      return () => {
        isFocusedRef.current = false;
      };
    }, []),
  );

  const isActive = () => isMountedRef.current && isFocusedRef.current;

  return {
 isMountedRef,
isFocusedRef,
isActive 
};
}

