import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard, AppText } from '@/components/ui';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';

type TemplateCardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function TemplateCard({
  title, description, children
}: TemplateCardProps) {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));
  return (
    <AppCard>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText
        variant="body"
        color="secondary"
        style={styles.description}>
        {description}
      </AppText>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </AppCard>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  title: {
    ...Typography.h3,
    color: colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
});

