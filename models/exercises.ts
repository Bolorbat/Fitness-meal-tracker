export interface Exercise {
  exercise_id: number;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  calories_per_min?: number; // average calories burned per minute
  description?: string;
  instructions?: string;
  muscle_groups?: string[]; // JSON array of muscle groups
  equipment?: string; // equipment needed
  created_at: string;
}