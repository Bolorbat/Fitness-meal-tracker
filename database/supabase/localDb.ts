import { DatabaseConnection } from "..";

export const getLocalUpdateRecords = async (
  tableName: string
): Promise<any[]> => {
  const db = await DatabaseConnection.getInstance().getDB();

  return await db.getAllAsync(`SELECT * FROM ${tableName} WHERE synced = ?`, [
    0,
  ]);
};

export const updateLocalRecords = async (
  tableName: string,
  primaryKey: string,
  records: any[]
): Promise<void> => {
  const db = await DatabaseConnection.getInstance().getDB();
  for (const record of records) {
    const columns = Object.keys(record);
    const placeholders = columns.map(() => "?").join(",");
    const updates = columns.map((col) => `${col} = ?`).join(",");
    const values = columns.map((col) => record[col as keyof typeof record]);

    const updateResult = await db.runAsync(
      `UPDATE ${tableName} SET ${updates} WHERE ${primaryKey} = ?`,
      [...values, record[primaryKey as keyof typeof record]]
    );

    if (updateResult.changes === 0) {
      await db.runAsync(
        `INSERT OR REPLACE INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders})`,
        values
      );
    }
  }
};
