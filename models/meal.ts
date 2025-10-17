export interface Meal {
  id?: number;
  user_id: string;
  name: string;
  // meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string; // YYYY-MM-DD format
  time?: string;
  synced: number;
  created_at: string;
}

export interface MealItem {
  id?: number;
  meal_id: number;
  food_name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  portion_size: string; // e.g., "1 cup", "100g", "1 medium"
  food_image?: string;
  synced?: number;
  updated_at?: string;

  //from joined meal table
  time?: string;
  date?: string;
}

export interface MealPlans {
  id: number;
  plan_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  rating: number;
}
