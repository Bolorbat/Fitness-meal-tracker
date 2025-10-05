import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const createTables = async () => {
  // Users table
  await supabase.rpc("sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        height INTEGER,
        weight REAL,
        age INTEGER,
        gender TEXT,
        complete_onboarding BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  });

  // Meals table
  await supabase.rpc("sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(user_id),
        name TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME,
        synced BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date);
    `,
  });

  // Meal items table
  await supabase.rpc("sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS meal_items (
        id SERIAL PRIMARY KEY,
        meal_id INT REFERENCES meals(id),
        food_name TEXT NOT NULL,
        calories REAL,
        protein REAL,
        carbs REAL,
        fat REAL,
        portion_size TEXT,
        synced BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  });

  // Workouts table
  await supabase.rpc("sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(user_id),
        date DATE NOT NULL,
        exercises TEXT NOT NULL,
        sets INT,
        reps INT,
        weight REAL,
        last_update TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date);
    `,
  });

  // User goals table
  await supabase.rpc("sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS user_goals (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(user_id),
        goal_type TEXT,
        target_weight REAL,
        daily_calories INT,
        target_protein INT,
        target_carbs INT,
        target_fat INT,
        last_update TIMESTAMP
      );
    `,
  });

  // Progress table
  await supabase.rpc("sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(user_id),
        date DATE NOT NULL,
        weight REAL,
        notes TEXT,
        last_update TIMESTAMP
      );
    `,
  });

  console.log("All tables created (if they did not exist).");
};
