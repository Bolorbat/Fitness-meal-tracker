import { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  register: (email: string, password: string, username: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  initializing: boolean;
}

export interface UserCompletionType {
  sex: string;
  birth: Date;
  weight: number;
  height: number;
  initializing: boolean;
}
