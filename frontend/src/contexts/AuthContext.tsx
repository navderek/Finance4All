import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  UserCredential,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirebaseAuth } from '@config/firebase';

/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;

  // Authentication methods
  signup: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;

  // Password management
  resetPassword: (email: string) => Promise<void>;

  // Profile management
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;

  // Email verification
  sendVerificationEmail: () => Promise<void>;

  // Helper methods
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const auth = getFirebaseAuth();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const clearError = () => {
    setError(null);
  };

  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> => {
    try {
      clearError();
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name if provided
      if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName });
      }

      return credential;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      clearError();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      clearError();
      await signOut(auth);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      return credential;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      clearError();
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    try {
      clearError();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await updateProfile(user, { displayName, photoURL });
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const sendVerificationEmail = async (): Promise<void> => {
    try {
      clearError();
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await sendEmailVerification(user);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signup,
      login,
      logout,
      loginWithGoogle,
      resetPassword,
      updateUserProfile,
      sendVerificationEmail,
      clearError,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = 'AuthProvider';
