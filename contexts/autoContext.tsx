import { AuthContextType } from "@/constants/types";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useUserGoal } from "@/hooks/userGoal";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "@firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setInitializing(false);
      return () => unsub;
    });
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      const UserCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      return UserCredential;
    } catch (e) {
      throw e;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ): Promise<UserCredential> => {
    try {
      const useCrential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      await updateProfile(useCrential.user, { displayName: username });
      return useCrential;
    } catch (e) {
      throw e;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      return await FIREBASE_AUTH.signOut();
    } catch (e) {
      throw e;
    }
  };

  const types: AuthContextType = {
    user,
    login,
    register,
    logout,
    initializing,
  };

  return <AuthContext.Provider value={types}>{children}</AuthContext.Provider>;
};
