import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeScreen, Toolbar } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { TemplateCard } from '@/modules/template/components/template-card';

export default function DataTemplateScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
});
