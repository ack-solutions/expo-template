import { AppColors, Spacing, Typography } from '@/constants/theme';
import { useThemedStyle } from '@/theme/use-themed-styles';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from './app-text';
import { Button } from './button';

// ─── Props ────────────────────────────────────────────────────────────────────

interface EmptyStateAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
}

interface EmptyStateProps {
  /** Icon or illustration rendered above the title. */
  icon?: React.ReactNode;
  /** Primary heading. Required. */
  title: string;
  /** Supporting description. */
  description?: string;
  /** Primary CTA. */
  action?: EmptyStateAction;
  /** Secondary CTA (shown below primary). */
  secondaryAction?: EmptyStateAction;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * EmptyState — guides the user when a list or section has no data.
 *
 * @example
 * // Basic empty list
 * <EmptyState
 *   icon={<Ionicons name="folder-open-outline" size={48} color={Colors.textTertiary} />}
 *   title="No items yet"
 *   description="Create your first item to get started."
 *   action={{ label: 'Create item', onPress: handleCreate }}
 * />
 *
 * // Search no-results
 * <EmptyState
 *   icon={<Ionicons name="search-outline" size={48} color={Colors.textTertiary} />}
 *   title="No results"
 *   description={`Nothing matched "${query}". Try different keywords.`}
 *   action={{ label: 'Clear search', onPress: clearSearch, variant: 'ghost' }}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  style,
}: EmptyStateProps) {
  const styles = useThemedStyle((theme) => createStyles(theme.colors));

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}

      <AppText style={styles.title}>{title}</AppText>

      {description && (
        <AppText style={styles.description}>{description}</AppText>
      )}

      {(action || secondaryAction) && (
        <View style={styles.actions}>
          {action && (
            <Button
              title={action.label}
              onPress={action.onPress}
              variant={action.variant ?? 'primary'}
              size="md"
            />
          )}
          {secondaryAction && (
            <Button
              title={secondaryAction.label}
              onPress={secondaryAction.onPress}
              variant={secondaryAction.variant ?? 'ghost'}
              size="md"
            />
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xxxl,
      paddingVertical: Spacing.huge,
    },
    iconWrap: {
      marginBottom: Spacing.xxl,
      opacity: 0.7,
    },
    title: {
      ...Typography.h3,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    description: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xxl,
      lineHeight: 22,
    },
    actions: {
      gap: Spacing.sm,
      alignItems: 'center',
      width: '100%',
    },
  });
