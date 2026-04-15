import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, SafeScreen, Toolbar } from '@/components/ui';
import { AppColors, Spacing } from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import { TemplateCard } from '@/modules/template/components/template-card';
import { useRouter } from 'expo-router';

export default function HomeTemplateScreen() {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  const router = useRouter();

  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="Home" />
      <View style={styles.container}>
        <TemplateCard
          title="Reusable App Template"
          description="Project-specific feature code has been removed. Keep this structure and build your next app on top of it."
        >
          <View style={styles.actions}>
            <Button
title="Open Data"
onPress={() => router.push('/(tabs)/history')}
variant="secondary" />
            <Button
title="Open Settings"
onPress={() => router.push('/(tabs)/settings')}
variant="outline" />
          </View>
        </TemplateCard>
      </View>
    </SafeScreen>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: colors.background,
  },
  actions: {
    gap: Spacing.sm,
  },
});
