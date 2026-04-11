import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeScreen, Toolbar } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { TemplateCard } from '@/modules/template/components/template-card';

export default function WorkspaceTemplateScreen() {
  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="Workspace" />
      <View style={styles.container}>
        <TemplateCard
          title="Workspace tab template"
          description="Use this area for your primary app feature list, dashboard cards, or CRUD modules."
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

