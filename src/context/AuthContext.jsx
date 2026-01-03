

import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Save token helper
  const saveToken = async (firebaseUser) => {
    if (!firebaseUser) return;
    const token = await firebaseUser.getIdToken();
    localStorage.setItem("idToken", token);
  };

  const createUser = async (email, password) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await saveToken(res.user);
    setLoading(false);
    return res;
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    await saveToken(res.user);
    setLoading(false);
    return res;
  };

  const googleSignIn = async () => {
    setLoading(true);
    const res = await signInWithPopup(auth, googleProvider);
    await saveToken(res.user);
    setLoading(false);
    return res;
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;
    setLoading(true);
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem("idToken");
    await signOut(auth);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      setUser(current || null);
      if (current) {
        await saveToken(current);
      } else {
        localStorage.removeItem("idToken");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    createUser,
    loginUser,
    googleSignIn,
    updateUserProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
