"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  FC,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { transferAnonymousChats } from "@/lib/firestore";
import type { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Inisialisasi listener status autentikasi
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!isMounted) return;

        if (firebaseUser) {
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            isAnonymous: firebaseUser.isAnonymous,
            emailVerified: firebaseUser.emailVerified,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
        if (!initialized) {
          setInitialized(true);
        }
      },
      () => {
        isMounted = false;
        unsubscribe();
      }
    );
  }, [initialized]);

  // Masuk secara anonim jika tidak ada user setelah inisialisasi
  useEffect(() => {
    if (initialized && !user && !loading) {
      console.log("🔄 Tidak ada user, masuk secara anonim...");
      signInAnonymous();
    }
  }, [initialized, user, loading]);

  // Masuk dengan email
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const previousUserId = user?.uid;
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Transfer chat anonim jika sebelumnya user anonim
      if (previousUserId && user?.isAnonymous && result.user) {
        console.log("🔄 Mentransfer chat anonim...");
        await transferAnonymousChats(previousUserId, result.user.uid);
      }
    } catch (error) {
      console.error("❌ Error masuk dengan email:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Gagal masuk");
      } else {
        throw new Error("Gagal masuk");
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const previousUserId = user?.uid;

      console.log("📝 Mendaftar dengan email:", email);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update nama tampilan dengan bagian depan email
      const displayName = email.split("@")[0];
      await updateProfile(result.user, { displayName });

      // Transfer chat anonim jika sebelumnya user anonim
      if (previousUserId && user?.isAnonymous && result.user) {
        console.log("🔄 Mentransfer chat anonim...");
        await transferAnonymousChats(previousUserId, result.user.uid);
      }

      console.log("✅ Pendaftaran dengan email berhasil");
    } catch (error) {
      console.error("❌ Error pendaftaran dengan email:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Gagal membuat akun");
      } else {
        throw new Error("Gagal membuat akun");
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const previousUserId = user?.uid;

      console.log("🔍 Masuk dengan Google...");
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);

      // Transfer chat anonim jika sebelumnya user anonim
      if (previousUserId && user?.isAnonymous && result.user) {
        console.log("🔄 Mentransfer chat anonim...");
        await transferAnonymousChats(previousUserId, result.user.uid);
      }

      console.log("✅ Masuk dengan Google berhasil");
    } catch (error) {
      console.error("❌ Error masuk dengan Google:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Gagal masuk dengan Google");
      } else {
        throw new Error("Gagal masuk dengan Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const signInAnonymous = async () => {
    try {
      setLoading(true);

      await signInAnonymously(auth);
    } catch (error) {
      console.error("❌ Error masuk secara anonim:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Gagal masuk secara anonim");
      } else {
        throw new Error("Gagal masuk secara anonim");
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);

      // Secara otomatis masuk anonim setelah keluar
      setTimeout(() => {
        signInAnonymous();
      }, 100);
    } catch (error) {
      console.error("❌ Error keluar:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Gagal keluar");
      } else {
        throw new Error("Gagal keluar");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("🔑 Mengirim email reset kata sandi ke:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("✅ Email reset kata sandi terkirim");
    } catch (error) {
      console.error("❌ Error reset kata sandi:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Gagal mengirim email reset kata sandi");
      } else {
        throw new Error("Gagal mengirim email reset kata sandi");
      }
    }
  };

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAnonymously: signInAnonymous,
    signOut,
    resetPassword,
  };
};

// Komponen Auth Provider
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};