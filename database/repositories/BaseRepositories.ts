import { DatabaseConnection } from "..";
import * as SQLite from "expo-sqlite";
import { supabase } from "../supabase/supabaseClient";
import { SyncTable } from "../supabase/sync";
import { useAuth } from "@/contexts/autoContext";

export abstract class BaseRepository {
  protected async getDB(): Promise<SQLite.SQLiteDatabase> {
    return DatabaseConnection.getInstance().getDB();
  }
  protected async syncToSupabase(tableName: string, pk: string, uid : string): Promise<void> {
    const db = await this.getDB();
    try {
      await SyncTable(tableName, pk, db, uid);
    } catch (err) {
      console.log("err in db base", err);
    }
  }
}
