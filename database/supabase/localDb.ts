import { DatabaseConnection } from "..";
import { supabase } from "./supabaseClient";

export const getLocalUpdateRecords = async (
  tableName: string
): Promise<any[]> => {
  const db = await DatabaseConnection.getInstance().getDB();

  return await db.getAllAsync(`SELECT * FROM ${tableName}`);
};

export const updateLocalRecords = async (
  tableName: string,
  key: string,
  records: any[],
  userId: string // Add userId parameter
): Promise<void> => {
  const db = await DatabaseConnection.getInstance().getDB();

  if (records.length == 0) {
    console.log("No local records found. sync from supabase");

    // Determine if this table has user_id column
    const tablesWithUserId = ["meals", "progress", "user_goals", "workouts"];
    const shouldFilterByUser = tablesWithUserId.includes(tableName);

    let query = supabase.from(tableName).select("*");

    // Filter by user_id for user-specific tables
    if (shouldFilterByUser) {
      query = query.eq("user_id", userId);
    } else if (tableName === "users") {
      // For users table, filter by id (which is the Firebase uid)
      query = query.eq("id", userId);
    }
    // For 'foods' and 'meal_items', fetch all (or handle differently based on your needs)

    const { data: remoteRecords, error } = await query;

    if (error) {
      console.log(`Failed to sync ${tableName} from supabase`, error);
      throw error;
    }

    if (remoteRecords && remoteRecords.length > 0) {
      for (const record of remoteRecords) {
        const columns = Object.keys(record);
        const placeholders = columns.map(() => "?").join(",");
        const values = columns.map((col) => record[col as keyof typeof record]);

        await db.runAsync(
          `INSERT OR REPLACE INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders})`,
          values
        );
      }
      console.log(
        `Synced ${remoteRecords.length} records from supabase to ${tableName}`
      );
    } else {
      console.log("No records found in supabase");
    }
    return;
  }

  for (const record of records) {
    const columns = Object.keys(record);
    const placeholders = columns.map(() => "?").join(",");
    const updates = columns.map((col) => `${col} = ?`).join(",");
    const values = columns.map((col) => record[col as keyof typeof record]);

    const updateResult = await db.runAsync(
      `UPDATE ${tableName} SET ${updates} WHERE ${key} = ?`,
      [...values, record[key as keyof typeof record]]
    );

    if (updateResult.changes === 0) {
      await db.runAsync(
        `INSERT OR REPLACE INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders})`,
        values
      );
    }
  }
};
