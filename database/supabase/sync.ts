import * as SQLite from "expo-sqlite";
import { isOnline } from "./network";
import { getLocalUpdateRecords } from "./localDb";
import { downloadFromSupabase, uploadToSupabase } from "./remoteDb";

interface SyncableTable {
  name: string;
  primaryKey: string;
}

export class SyncService {
  private db: SQLite.SQLiteDatabase;
  private tables: SyncableTable[];

  constructor(database: SQLite.SQLiteDatabase, tables: SyncableTable[]) {
    ((this.db = database), (this.tables = tables));
  }

  async syncAll(): Promise<void> {
    const online = await isOnline();
    if (!online) {
      console.log("Offline");
      return;
    }
    for (const table of this.tables) {
      await this.syncTable(table);
    }
  }

  async syncTable(table: SyncableTable): Promise<void> {
    try {
      const localRecords = await getLocalUpdateRecords(table.name);
      // if (localRecords.length > 0) {
      await uploadToSupabase(table.name, table.primaryKey, localRecords);
      // }
      await downloadFromSupabase(table.name, table.primaryKey, localRecords);
      console.log(`Synced ${table.name} successfully`);
    } catch (err) {
      console.log(`error syncing ${table.name}`, err);
      throw err;
    }
  }

  private async getLastSyncTime(tableName: string): Promise<number> {
    return 0;
  }
}

export const SyncAll = async (db: SQLite.SQLiteDatabase) => {
  const tables: SyncableTable[] = [
    { name: "meals", primaryKey: "id" },
    { name: "meal_items", primaryKey: "id" },
  ];

  const syncService = new SyncService(db, tables);

  // Sync on app start
  await syncService.syncAll();

  // Return for manual sync
  return syncService;
};

export const SyncTable = async (
  tableName: string,
  tablePK: string,
  db: SQLite.SQLiteDatabase
) => {
  const table: SyncableTable[] = [{ name: tableName, primaryKey: tablePK }];
  const syncService = new SyncService(db, table);

  await syncService.syncTable(table[0]);

  return syncService;
};
