import * as SQLite from "expo-sqlite";
import { isOnline } from "./network";
import { getLocalUpdateRecords } from "./localDb";
import { downloadFromSupabase, uploadToSupabase } from "./remoteDb";

interface SyncableTable {
  name: string;
  key: string;
}

export class SyncService {
  private db: SQLite.SQLiteDatabase;
  private tables: SyncableTable[];

  constructor(database: SQLite.SQLiteDatabase, tables: SyncableTable[]) {
    ((this.db = database), (this.tables = tables));
  }

  async syncAll(uid: string): Promise<void> {
    const online = await isOnline();
    if (!online) {
      console.log("Offline");
      return;
    }
    for (const table of this.tables) {
      await this.syncTable(table, uid);
    }
  }

  async syncTable(table: SyncableTable, uid : string): Promise<void> {
    try {
      const localRecords = await getLocalUpdateRecords(table.name);
      // if (localRecords.length > 0) {
      await uploadToSupabase(table.name, table.key, localRecords);
      // }
      await downloadFromSupabase(table.name, table.key, localRecords, uid);
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

export const SyncAll = async (db: SQLite.SQLiteDatabase, uid: string) => {
  const tables: SyncableTable[] = [
    { name: "users", key: "id" },
    { name: "user_goals", key: "id" },
    { name: "meals", key: "id" },
    { name: "meal_items", key: "id" },
  ];

  const syncService = new SyncService(db, tables);

  // Sync on app start
  await syncService.syncAll(uid);

  // Return for manual sync
  return syncService;
};

export const SyncTable = async (
  tableName: string,
  tablePK: string,
  db: SQLite.SQLiteDatabase,
  uid : string
) => {
  const table: SyncableTable[] = [{ name: tableName, key: tablePK }];
  const syncService = new SyncService(db, table);

  await syncService.syncTable(table[0], uid);

  return syncService;
};
