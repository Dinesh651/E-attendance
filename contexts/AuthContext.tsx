import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider, findUserByEmailInDB } from '../services/firebase';
// Fix: Use Firebase v8 compat imports to work with the v12 library via import map.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { User } from '../types';

type FirebaseUser = firebase.User;

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
    // This effect handles the entire auth flow:
    // 1. Check for a redirect result from Google Sign-In.
    // 2. Set up the auth state listener which becomes the source of truth.

    let unsubscribe: () => void;

    // We must handle the redirect result first. This promise resolves when the user
    // returns to the app. After it's done, onAuthStateChanged will have the correct state.
    // Fix: Use Firebase v8 compat syntax.
    auth.getRedirectResult()
      .then(() => {
        // Now that the redirect is processed, we can safely listen for state changes.
        // This listener will fire immediately with the current user state.
        // Fix: Use Firebase v8 compat syntax.
        unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
          try {
            if (firebaseUser && firebaseUser.email) {
              const appUser = await findUserByEmailInDB(firebaseUser.email);
              if (appUser) {
                setUser(appUser);
              } else {
                setError("Your account is not authorized to access this application.");
                setUser(null);
                // Fix: Use Firebase v8 compat syntax.
                await auth.signOut();
              }
            } else {
              setUser(null);
            }
          } catch (e) {
            setError("An error occurred during authentication state check.");
            setUser(null);
          } finally {
            // Once we have checked for a user, initialization is complete.
            setIsInitializing(false);
          }
        });
      })
      .catch((err) => {
        console.error("Error processing redirect result:", err);
        setError("An error occurred during sign-in. Please try again.");
        setIsInitializing(false); // Stop loading on redirect error.
      });

    return () => {
      // Cleanup the listener when the component unmounts.
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This navigates the user to the Google sign-in page.
      // Fix: Use Firebase v8 compat syntax.
      await auth.signInWithRedirect(googleProvider);
    } catch (err) { // Fix: Added missing opening brace for the catch block.
      setError("Failed to start sign in. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Fix: Use Firebase v8 compat syntax.
      await auth.signOut();
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