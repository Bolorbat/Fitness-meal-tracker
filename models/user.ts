export interface User {
  user_id: string;
  name: string;
  email: string;
  height?: number | null; // in cm
  weight?: number | null; // in kg
  age?: number | null;
  gender?: string | null;
  created_at?: string;
  updated_at?: string;
}
