import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { AUTH_USER, db } from "../Firebase/initializeApp";

interface AuthContextType {
  authUser: any;
  currentUserData: any;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  currentUserData: null,
  isLoading: true,
});

import { ReactNode } from "react";

import type { User } from "firebase/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  interface CurrentUserData {
    name: string;
    createAccount: any;
    paid: Record<string, any>;
    verified: boolean;
    uid: string;
  }
  
  const [currentUserData, setCurrentUserData] = useState<CurrentUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(AUTH_USER, (user) => {
      setAuthUser(user);
      setIsLoading(true);
      if (!user) {
        setCurrentUserData(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!authUser) return;
    const userDocRef = doc(db, "USERS", authUser.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setIsLoading(false);
          return;
        }
        
        const data = docSnap.data();
        setCurrentUserData({
          name: data.n,
          createAccount: data.ca,
          paid: typeof data.p === "object" ? data.p : {},
          verified: data.v,
          uid: data.uid,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching user data:", error);
        setCurrentUserData(null);
        setIsLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [authUser]);
  
  const value = useMemo(
    () => ({ authUser, currentUserData, isLoading }),
    [authUser, currentUserData, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);