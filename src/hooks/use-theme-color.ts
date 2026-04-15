/**
 * This hook is no longer used in the app since we have a flat color system.
 * Kept for compatibility with any remaining references.
 */

import { getThemeColors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof getThemeColors>,
) {
  const { resolvedColorScheme } = useAppTheme();
  const theme = resolvedColorScheme;
  const colorFromProps = props[theme];
  const themeColors = getThemeColors(theme);

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return themeColors[colorName] as string;
  }
}
