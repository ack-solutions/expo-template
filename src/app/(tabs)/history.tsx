import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeScreen, Toolbar } from '@/components/ui';
import { AppColors, Spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';
import { TemplateCard } from '@/modules/template/components/template-card';

export default function DataTemplateScreen() {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="Data" />
      <View style={styles.container}>
        <TemplateCard
          title="Data tab template"
          description="Use this tab for history, recent projects, saved records, or API synced items in your next app."
        />
      </View>
    </SafeScreen>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Spacing.lg,
  },
});
