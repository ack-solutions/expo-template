import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { deleteDatabaseAsync } from 'expo-sqlite';
import { Platform } from 'react-native';

import {
  DB_FILE_NAME,
  expoDb,
} from '@/database';

type BackupFile = { bytes(): Promise<Uint8Array> } | Blob;

export type ImportResult = {
  success: boolean;
  message: string;
  /** True when a SQLite file was applied and the app is reloading */
  restarted?: boolean;
};

export class BackupUtils {
  /** expo-file-system `File` expects `file://` URIs on native; expo-sqlite paths are often plain absolute paths. */
  private static sqlitePathToFileUri(sqlitePath: string): string {
    if (sqlitePath.startsWith('file://')) {
      return sqlitePath;
    }
    const normalized = sqlitePath.replace(/\\/g, '/');
    return normalized.startsWith('/') ? `file://${normalized}` : `file:///${normalized}`;
  }

  private static siblingDbPaths(mainDbPath: string): string[] {
    return [
      mainDbPath,
      `${mainDbPath}-wal`,
      `${mainDbPath}-shm`
    ];
  }

  private static isSqliteDatabase(bytes: Uint8Array): boolean {
    if (bytes.length < 16) return false;
    const header = new TextDecoder('utf-8', { fatal: false }).decode(bytes.subarray(0, 15));
    return header === 'SQLite format 3';
  }

  private static async readAllBytes(file: BackupFile): Promise<Uint8Array> {
    if ('bytes' in file && typeof file.bytes === 'function') {
      return file.bytes();
    }
    return new Uint8Array(await (file as Blob).arrayBuffer());
  }

  private static async reloadApp(): Promise<void> {
    if (Platform.OS === 'web') {
      window.location.reload();
      return;
    }
    try {
      const Updates = await import('expo-updates');
      await Updates.reloadAsync();
    } catch {
      const { DevSettings } = await import('react-native');
      DevSettings.reload();
    }
  }

  /**
   * Export the live SQLite database: native shares the `.db` file; web downloads serialized DB bytes as `.db`.
   */
  static async exportDatabaseAndShare(): Promise<void> {
    if (Platform.OS === 'web') {
      const bytes = await expoDb.serializeAsync('main');
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const blob = new Blob([copy], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `app-template-${new Date().toISOString().slice(0, 10)}.db`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    await expoDb.execAsync('PRAGMA wal_checkpoint(FULL)');
    const serialized = await expoDb.serializeAsync('main');
    const dbBytes = new Uint8Array(serialized.byteLength);
    dbBytes.set(serialized);

    const exportName = `app-template-${new Date().toISOString().slice(0, 10)}.db`;
    const outFile = new File(Paths.cache, exportName);
    if (outFile.exists) {
      outFile.delete();
    }
    outFile.create({ intermediates: true });
    outFile.write(dbBytes);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(outFile.uri, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Export database',
        UTI: 'public.database',
      });
    }
  }

  /**
   * Open picker (native). Web should use `<input type="file">` and pass the `File` to `importDatabaseFile`.
   */
  static async pickDatabaseFile(): Promise<BackupFile | null> {
    if (Platform.OS === 'web') {
      return null;
    }
    try {
      const picked = await File.pickFileAsync(undefined, 'application/octet-stream');
      if (!picked || Array.isArray(picked)) return null;
      return picked;
    } catch {
      return null;
    }
  }

  private static async replaceLiveDatabaseWithBytes(bytes: Uint8Array): Promise<void> {
    const dbPath = expoDb.databasePath;
    await expoDb.execAsync('PRAGMA wal_checkpoint(FULL)');
    await expoDb.closeAsync();

    try {
      await deleteDatabaseAsync(DB_FILE_NAME);
    } catch {
      // ignore if already missing
    }

    for (const path of BackupUtils.siblingDbPaths(dbPath)) {
      const f = new File(BackupUtils.sqlitePathToFileUri(path));
      if (f.exists) {
        f.delete();
      }
    }

    const out = new File(BackupUtils.sqlitePathToFileUri(dbPath));
    const parent = out.parentDirectory;
    if (!parent.exists) {
      parent.create({ intermediates: true });
    }
    out.create({ intermediates: true });
    out.write(bytes);

    void BackupUtils.reloadApp();
  }

  /**
   * Import a `.db` SQLite file (replaces the app database and reloads).
   */
  static async importDatabaseFile(file: BackupFile): Promise<ImportResult> {
    const bytes = await BackupUtils.readAllBytes(file);

    if (!BackupUtils.isSqliteDatabase(bytes)) {
      return {
        success: false,
        message: 'Not a valid file. Choose a .db SQLite backup from this app.',
      };
    }

    try {
      await BackupUtils.replaceLiveDatabaseWithBytes(bytes);
      return {
        success: true,
        message: 'Database restored. The app will restart.',
        restarted: true,
      };
    } catch (e) {
      console.error('[backup] import db failed', e);
      return {
        success: false,
        message: 'Could not import this database file. Try again or use a backup from this app.',
      };
    }
  }
}
