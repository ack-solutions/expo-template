import {
  AppCard, AppSwitch, AppText, Button, ConfirmDialog, FeedbackDialog, ListItem, SafeScreen, Toolbar
} from '@/components/ui';
import { AppSettingsService } from '@/database';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useScreenActive } from '@/hooks/use-screen-active';
import { useToast } from '@/hooks/use-toast';
import { AppSettings, ThemeMode } from '@/types';
import {
  BackupUtils,
  type ImportResult,
} from '@/utils/backup';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const THEME_MODE_OPTIONS: {
  value: ThemeMode;
  title: string;
  description: string;
  icon: 'phone-portrait-outline' | 'sunny-outline' | 'moon-outline';
}[] = [
  {
    value: 'system',
    title: 'System default',
    description: 'Follow your device appearance setting automatically.',
    icon: 'phone-portrait-outline',
  },
  {
    value: 'light',
    title: 'Light',
    description: 'Always use light colors.',
    icon: 'sunny-outline',
  },
  {
    value: 'dark',
    title: 'Dark',
    description: 'Always use dark colors.',
    icon: 'moon-outline',
  },
];

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { colors, setThemeMode } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tabBarHeight = useBottomTabBarHeight();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [exporting, setExporting] = useState(false);
  const {
    toast, showToast, hideToast
  } = useToast();
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
      const newSettings: AppSettings = {
        ...settings,
        notificationsEnabled,
      };
      setSettings(newSettings);
      await AppSettingsService.saveSettings(newSettings);
    },
    [settings, isActive],
  );

  const updateThemeMode = useCallback(
    async (themeMode: ThemeMode) => {
      if (!settings) return;
      if (!isActive()) return;
      const newSettings: AppSettings = {
        ...settings,
        themeMode,
      };
      setSettings(newSettings);
      setThemeMode(themeMode);
      await AppSettingsService.saveSettings(newSettings);
    },
    [
      settings,
      isActive,
      setThemeMode,
    ],
  );

  const handleExport = useCallback(async () => {
    if (!isActive()) return;
    setExporting(true);
    try {
      await BackupUtils.exportDatabaseAndShare();
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
        const result = await BackupUtils.importDatabaseFile(file);
        await applyResult(result);
      };
      input.click();
    } else {
      void (async () => {
        const picked = await BackupUtils.pickDatabaseFile();
        if (!picked) return;
        if (!isActive()) return;
        const result = await BackupUtils.importDatabaseFile(picked);
        await applyResult(result);
      })();
    }
  }, [showToast, isActive]);

  const handleClearAll = useCallback(async () => {
    await AppSettingsService.clearAll();
    if (!isActive()) return;
    setSettings({
      notificationsEnabled: false,
      themeMode: 'system',
    });
    setThemeMode('system');
    setShowClearAll(false);
    showToast('Template settings were reset.', 'success');
  }, [
    showToast,
    isActive,
    setThemeMode,
  ]);

  if (!settings) return null;

  return (
    <SafeScreen topSafe={false} bottomSafe={false}>
      <Toolbar title="Settings" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          ...styles.content,
          paddingBottom: tabBarHeight + theme.spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Appearance ─────────────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={colors.primary} />
            <AppText variant="h3">
              Appearance
            </AppText>
          </View>
          <View style={styles.themeOptionList}>
            {THEME_MODE_OPTIONS.map((option, index) => (
              <ListItem
                key={option.value}
                title={option.title}
                subtitle={option.description}
                left={<Ionicons
                  name={option.icon}
                  size={18}
                  color={settings.themeMode === option.value ? colors.primary : colors.textSecondary} />}
                right={settings.themeMode === option.value
                  ? <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.primary} />
                  : undefined}
                onPress={() => {
                  void updateThemeMode(option.value);
                }}
                showDivider={index < THEME_MODE_OPTIONS.length - 1}
              />
            ))}
          </View>
        </AppCard>

        {/* ─── Notifications (app-wide) ───────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.primary} />
            <AppText variant="h3">
              Notifications
            </AppText>
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <AppSwitch
              value={settings.notificationsEnabled}
              onValueChange={updateNotificationsEnabled}
              label="App notifications"
              description="Generic notifications toggle for reusable templates."
            />
          </View>
        </AppCard>

        {/* ─── Backup & Restore ──────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="cloud-outline"
              size={20}
              color={colors.primary} />
            <AppText variant="h3">
              Backup & Restore
            </AppText>
          </View>

          <AppText
            variant="caption"
            color="secondary"
            style={styles.sectionDesc}>
            Export your full app database as a .db file. Import a .db backup to replace data on this device (the app
            restarts).
          </AppText>

          <View style={styles.backupButtons}>
            <Button
              title="Export database"
              onPress={handleExport}
              variant="secondary"
              size="md"
              loading={exporting}
              icon={<Ionicons
                name="download-outline"
                size={16}
                color={colors.primary} />}
              style={styles.backupBtn}
            />
            <Button
              title="Import database"
              onPress={handleImport}
              variant="outline"
              size="md"
              icon={<Ionicons
                name="push-outline"
                size={16}
                color={colors.primary} />}
              style={styles.backupBtn}
            />
          </View>
        </AppCard>

        {/* ─── Data Management ───────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="server-outline"
              size={20}
              color={colors.primary} />
            <AppText variant="h3">
              Data Management
            </AppText>
          </View>

          <ListItem
            title="Reset Template Settings"
            tone="danger"
            left={<Ionicons
              name="trash-outline"
              size={18}
              color={colors.error} />}
            accessory="arrow"
            onPress={() => setShowClearAll(true)}
            style={styles.dangerRow}
          />
        </AppCard>

        {/* ─── About ─────────────────────────────────────────── */}
        <AppCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary} />
            <AppText variant="h3">
              About
            </AppText>
          </View>

          <View style={styles.aboutRow}>
            <AppText
              variant="caption"
              color="secondary">
              Version
            </AppText>
            <AppText variant="captionMedium">
              1.0.0
            </AppText>
          </View>
          <View style={styles.aboutRow}>
            <AppText
              variant="caption"
              color="secondary">
              Storage
            </AppText>
            <AppText variant="captionMedium">
              Local only
            </AppText>
          </View>
          <View style={[styles.aboutRow, styles.aboutRowLast]}>
            <AppText
              variant="caption"
              color="secondary">
              Internet
            </AppText>
            <View style={styles.offlineBadge}>
              <Ionicons
                name="cloud-offline-outline"
                size={12}
                color={colors.success} />
              <AppText variant="smallMedium" color="success">
                Not required
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Privacy footer */}
        <View style={styles.footer}>
          <Ionicons
            name="lock-closed-outline"
            size={13}
            color={colors.textTertiary} />
          <AppText
            variant="small"
            color="tertiary"
            style={styles.footerText}>
            All your data stays on this device
          </AppText>
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

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionDesc: {
    marginBottom: theme.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  backupButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  themeOptionList: {
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  },
  backupBtn: {
    flex: 1,
  },
  dangerRow: {
    borderRadius: theme.radii.md,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  aboutRowLast: {
    borderBottomWidth: 0,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
    backgroundColor: theme.colors.successFaded,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radii.pill,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xl,
    opacity: 0.6,
  },
  footerText: {
    textAlign: 'center',
  },
});
