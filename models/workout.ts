export interface Workout {
  workout_id: number;
  user_id: number;
  exercise_id: number;
  duration_minutes?: number; // for cardio
  calories_burned?: number;
  sets?: number; // for strength training
  reps?: number; // for strength training
  weight_used?: number; // in kg for strength training
  distance?: number; // in km for cardio
  notes?: string;
  date: string; // YYYY-MM-DD format
  created_at: string;
}