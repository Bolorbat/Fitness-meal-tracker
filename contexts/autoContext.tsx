import { AuthContextType } from "@/constants/types";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log("Setting up auth listener...");
    const unsub = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      console.log(
        "Auth state changed:",
        firebaseUser ? "User logged in" : "No user"
      );
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    // Return cleanup function
    return () => {
      console.log("Cleaning up auth listener");
      unsub();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      setUser(userCredential.user);
      return userCredential;
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
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: username });
      return userCredential;
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

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    initializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
