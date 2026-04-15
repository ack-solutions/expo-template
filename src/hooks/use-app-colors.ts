import { useAppTheme } from '@/hooks/use-app-theme';

export function useAppColors() {
  const { colors } = useAppTheme();
  return colors;
}
