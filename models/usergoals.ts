export interface UserGoal {
  goal_id: number;
  user_id: number;
  goal_type:
    | "weight_loss"
    | "weight_gain"
    | "muscle_gain"
    | "maintain_weight"
    | "improve_fitness";
  target_weight: number; // in kg
  daily_calories: number;
  target_protein: number; // in grams
  target_carbs: number; // in grams
  target_fat: number; // in grams
  created_at: string;
  updated_at?: string;
}
