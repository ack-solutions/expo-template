import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui';
import { Colors, Spacing, Typography } from '@/constants/theme';

type TemplateCardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function TemplateCard({ title, description, children }: TemplateCardProps) {
  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
});

