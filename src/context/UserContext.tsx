import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { AUTH_USER, db } from "../Firebase/initializeApp";
import type { User } from "firebase/auth";
import { LocationDetails } from "../Interfaces/iGoogleMaps";

interface AuthContextType {
  authUser: User | null;
  currentUserData: any;
  isLoading: boolean;
  locationDetails: LocationDetails | null;
  setLocationDetails: React.Dispatch<
    React.SetStateAction<LocationDetails | null>
  >;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  currentUserData: null,
  isLoading: true,
  locationDetails: null,
  setLocationDetails: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(AUTH_USER, (user) => {
      setAuthUser(user);
      if (!user) {
        setCurrentUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!authUser) return;
    setIsLoading(true);
    const userDocRef = doc(db, "USERS", authUser.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setCurrentUserData(null);
          setIsLoading(false);
          return;
        }
        const data = docSnap.data();
        setCurrentUserData({
          achievements: data.ach || [],
          name: data.n || "",
          email: data.e || "",
          description: data.d || "",
          birth: data.b || "",
          gender: data.g || "",
          points:data.pt || 0,
          createAccount: data.ca,
          paid: typeof data.p === "object" ? data.p : {},
          preferences: data.pre || [],
          verified: data.v,
          favorites:data.fav || [],
          followers: data.f || [],
          location: data.loc || {},
          history: data.h || [],
          savedPlaces: data.sp || [],
          uid: data.uid,
          photo: data.pt || "",
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
    () => ({
      authUser,
      currentUserData,
      isLoading,
      locationDetails,
      setLocationDetails,
    }),
    [authUser, currentUserData, isLoading, locationDetails, setLocationDetails]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
