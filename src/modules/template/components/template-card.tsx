import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppCard, AppText } from '@/components/ui';
import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useAppColors } from '@/hooks/use-app-colors';

type TemplateCardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function TemplateCard({
  title, description, children
}: TemplateCardProps) {
  const colors = useAppColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

