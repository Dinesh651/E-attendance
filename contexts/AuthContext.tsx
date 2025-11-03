import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { api } from '../services/mockApi';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          const appUser = await api.findUserByEmail(firebaseUser.email);
          if (appUser) {
            setUser(appUser);
          } else {
            // User authenticated with Google but is not in our mock user list
            setError("Access denied. Your account is not authorized.");
            setUser(null);
            await signOut(auth);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        setError("An error occurred during authentication state check.");
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      if (firebaseUser && firebaseUser.email) {
        const appUser = await api.findUserByEmail(firebaseUser.email);
        if (appUser) {
          setUser(appUser);
        } else {
          setError("Access denied. Your account is not authorized.");
          await signOut(auth);
        }
      } else {
          setError("Could not retrieve user information from Google.");
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError("Failed to sign out.");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isInitializing, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
