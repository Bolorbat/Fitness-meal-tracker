export const createUserTable = `
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                height INTEGER,
                weight REAL,
                age INTEGER,
                gender TEXT,
                complete_onboarding INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

export const createMealTable = `
            CREATE TABLE IF NOT EXISTS meals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                name TEXT NOT NULL,
                date TEXT NOT NULL CHECK (date LIKE '____-__-__'),
                time TEXT,
                synced INTEGER DEFAULT 0,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )`;
export const createMealItemTable = `
            CREATE TABLE IF NOT EXISTS meal_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meal_id INTEGER NOT NULL,
                food_name TEXT NOT NULL,
                calories REAL,
                protein REAL,
                carbs REAL,
                fat REAL,
                fiber REAL,
                sugar REAL,
                sodium REAL,
                portion_size TEXT,
                synced INTEGER DEFAULT 0,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
                )`
export const createMealIndex = `
      CREATE INDEX IF NOT EXISTS idx_meals_user_date
      ON meals(user_id, date)`;

export const createTableWorkouts = `
        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY,
            user_id TEXT,
            date TEXT NOT NULL CHECK (date LIKE '____-__-__'),
            exercises TEXT NOT NULL,
            sets INTEGER,
            reps INTEGER,
            weight REAL,
            lastUpdate INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`;

export const createWorkoutIndex = `
        CREATE INDEX IF NOT EXISTS idx_workouts_user_date
        ON workouts(user_id, date)`;

export const createUserGoalsTable = `
        CREATE TABLE IF NOT EXISTS userGoals(
        id INTEGER PRIMARY KEY,
        user_id TEXT,
        goal_type TEXT,
        target_weight INTEGER,
        daily_calories INTEGER,
        target_protein INTEGER,
        target_carbs INTEGER,
        target_fat INTEGER,
        lastUpdate INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`;

export const createProgressTable = `
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY,
            user_id TEXT,
            date TEXT NOT NULL CHECK (date LIKE '____-__-__'),
            weight REAL,
            notes TEXT,
            lastUpdate INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`;
