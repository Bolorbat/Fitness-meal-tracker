import * as SQLite from "expo-sqlite";

type DB = SQLite.SQLiteDatabase;

const DATABASE_NAME = "app.db";
const DATABASE_VERSION = "1.0";

export const initDB = async () => {
  return await DatabaseConnection.getInstance().getDB();
};

const createTable = async (db: DB) => {
  const {
    createUserTable,
    createMealTable,
    createMealItemTable,
    createTableWorkouts,
    createUserGoalsTable,
  } = await import("./schemas");
  try {
    await db.execAsync(createUserTable);
    await db.execAsync(createMealTable);
    await db.execAsync(createMealItemTable);
    await db.execAsync(createTableWorkouts);
    await db.execAsync(createUserGoalsTable);

    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date)`
    );
    await db.execAsync(
      `CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date)`
    );

    console.log("Tables created successfully");
  } catch (err) {
    console.log("Error creating tables ", err);
    throw err;
  }
};

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: DB | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance)
      DatabaseConnection.instance = new DatabaseConnection();
    return DatabaseConnection.instance;
  }
  async getDB(): Promise<DB> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
        useNewConnection : true
      })
      await this.db.execAsync(`PRAGMA foreign_keys = ON`);
      await createTable(this.db);
      console.log("Database initialized successfully");
    }
    return this.db;
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  async resetDatabase(): Promise<void> {
    try {
      await this.close();

      const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
        useNewConnection: true,
      });

      await db.execAsync("PRAGMA foreign_keys = OFF");

      // Drop all tables
      await db.execAsync("DROP TABLE IF EXISTS meals");
      await db.execAsync("DROP TABLE IF EXISTS workouts");
      await db.execAsync("DROP TABLE IF EXISTS user_goals");
      await db.execAsync("DROP TABLE IF EXISTS users");
      await db.execAsync("DROP TABLE IF EXISTS meal_items");
      await db.execAsync("DROP TABLE IF EXISTS users");
      await db.execAsync("DROP TABLE IF EXISTS progress");

      await db.closeAsync();

      console.log("Database reset successfully"); 
    } catch (error) {
      console.log("Error resetting database:", error);
      throw error;
    }
  }
}
