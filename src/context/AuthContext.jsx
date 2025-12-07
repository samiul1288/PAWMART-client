import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onIdTokenChanged,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

// ===== Context তৈরি =====
export const AuthContext = createContext(null);

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyCwsP6_KxBAhn_BADFZUEedBv4BOMJWIYE",
  authDomain: "pawmart-8e4b2.firebaseapp.com",
  projectId: "pawmart-8e4b2",
  storageBucket: "pawmart-8e4b2.firebasestorage.app",
  messagingSenderId: "904194596551",
  appId: "1:904194596551:web:022d71a45fd1dda911e8e2",
};

// ===== Initialize Firebase (একবারই) =====
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== Custom Hook =====
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

// ===== Provider Component =====
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Firebase Auth APIs ===
  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    return res.user;
  };

  const logout = () => signOut(auth);

  // === Auth Observer ===
 useEffect(() => {
   const unsub = onIdTokenChanged(auth, async (fbUser) => {
     setUser(fbUser || null);

     if (fbUser) {
       const token = await fbUser.getIdToken(); // সব সময় fresh token
       localStorage.setItem("idToken", token);
     } else {
       localStorage.removeItem("idToken");
     }

     setLoading(false);
   });

   return unsub;
 }, []);


  // === Memoized Context Value ===
  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
