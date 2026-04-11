import { AppCard, Button, ConfirmDialog, FeedbackDialog, SafeScreen, Toolbar } from '@/components/ui';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { AppSettingsService } from '@/database';
import { useScreenActive } from '@/hooks/use-screen-active';
import { useToast } from '@/hooks/use-toast';
import { AppSettings } from '@/types';
import {
  exportDatabaseAndShare,
  importDatabaseFile,
  pickDatabaseFile,
  type ImportResult,
} from '@/utils/backup';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { isActive, isMountedRef } = useScreenActive();

  const loadSettings = useCallback(async () => {
    const s = await AppSettingsService.getSettings();
    if (!isMountedRef.current) return;
    setSettings(s);
  }, [isMountedRef]);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings]),
  );

  const updateNotificationsEnabled = useCallback(
    async (notificationsEnabled: boolean) => {
      if (!settings) return;
      if (!isActive()) return;
      const newSettings: AppSettings = { ...settings, notificationsEnabled };
      setSettings(newSettings);
      await AppSettingsService.saveSettings(newSettings);
    },
    [settings, isActive],
  );

  const handleExport = useCallback(async () => {
    if (!isActive()) return;
    setExporting(true);
    try {
      await exportDatabaseAndShare();
      if (!isActive()) return;
      showToast(
        Platform.OS === 'web'
          ? 'Your database file was downloaded.'
          : 'Use the share sheet to save your .db file.',
        'success',
      );
    } catch (error) {
      console.error('Error exporting database:', error);
      if (!isActive()) return;
      showToast('Couldn’t export your database. Please try again.', 'error');
    } finally {
      if (!isActive()) return;
      setExporting(false);
    }
  }, [showToast, isActive]);

  const handleImport = useCallback(() => {
    const applyResult = async (result: ImportResult) => {
      if (!result.success) {
        if (!isActive()) return;
        showToast(result.message, 'error');
        return;
      }
      // DB restore restarts the app; show a quick confirmation.
      if (!isActive()) return;
      showToast(result.message, 'success');
    };

    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.db,application/octet-stream,application/x-sqlite3';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const result = await importDatabaseFile(file);
        await applyResult(result);
      };
      input.click();
    } else {
      void (async () => {
        const picked = await pickDatabaseFile();
        if (!picked) return;
        if (!isActive()) return;
        const result = await importDatabaseFile(picked);
        await applyResult(result);
      })();
    }
  }, [showToast, isActive]);

  const handleClearAll = useCallback(async () => {
    await AppSettingsService.clearAll();
    if (!isActive()) return;
    setShowClearAll(false);
    showToast('Template settings were reset.', 'success');
  }, [showToast, isActive]);

  if (!settings) return null;

  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="Settings" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Notifications (app-wide) ───────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>App notifications</Text>
              <Text style={styles.settingHint}>
                Generic notifications toggle for reusable templates.
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={updateNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryFaded12 }}
              thumbColor={settings.notificationsEnabled ? Colors.primary : Colors.textTertiary}
            />
          </View>
        </AppCard>

        {/* ─── Backup & Restore ──────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cloud-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Backup & Restore</Text>
          </View>

          <Text style={styles.sectionDesc}>
            Export your full app database as a .db file. Import a .db backup to replace data on this device (the app
            restarts).
          </Text>

          <View style={styles.backupButtons}>
            <Button
              title="Export database"
              onPress={handleExport}
              variant="secondary"
              size="md"
              loading={exporting}
              icon={<Ionicons name="download-outline" size={16} color={Colors.primary} />}
              style={styles.backupBtn}
            />
            <Button
              title="Import database"
              onPress={handleImport}
              variant="outline"
              size="md"
              icon={<Ionicons name="push-outline" size={16} color={Colors.primary} />}
              style={styles.backupBtn}
            />
          </View>
        </AppCard>

        {/* ─── Data Management ───────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="server-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>

          <TouchableOpacity
            style={[styles.dangerRow, { borderBottomWidth: 0 }]}
            onPress={() => setShowClearAll(true)}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
            <Text style={styles.dangerText}>Reset Template Settings</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        </AppCard>

        {/* ─── About ─────────────────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Storage</Text>
            <Text style={styles.aboutValue}>Local only</Text>
          </View>
          <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.aboutLabel}>Internet</Text>
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline-outline" size={12} color={Colors.success} />
              <Text style={styles.offlineBadgeText}>Not required</Text>
            </View>
          </View>
        </AppCard>

        {/* Privacy footer */}
        <View style={styles.footer}>
          <Ionicons name="lock-closed-outline" size={13} color={Colors.textTertiary} />
          <Text style={styles.footerText}>
            All your data stays on this device
          </Text>
        </View>

        <ConfirmDialog
          visible={showClearAll}
          title="Reset Settings?"
          message="This will clear locally saved template settings."
          confirmLabel="Reset"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleClearAll}
          onCancel={() => setShowClearAll(false)}
        />
      </ScrollView>
      <FeedbackDialog {...toast} onDismiss={hideToast} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  sectionDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingText: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  settingHint: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginTop: Spacing.xxs,
  },
  backupButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backupBtn: {
    flex: 1,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dangerText: {
    ...Typography.body,
    color: Colors.error,
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  aboutLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  aboutValue: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    backgroundColor: Colors.successFaded,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radii.pill,
  },
  offlineBadgeText: {
    ...Typography.small,
    color: Colors.success,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    opacity: 0.6,
  },
  footerText: {
    ...Typography.small,
    color: Colors.textTertiary,
  },
});
