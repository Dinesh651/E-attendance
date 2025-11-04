
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider, findUserByEmailInDB, addEmployeeToDB } from '../services/firebase';
// Fix: Use Firebase v8 compat imports to work with the v12 library via import map.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { User, Role } from '../types';

type FirebaseUser = firebase.User;

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  previewLogin: (role: Role) => void;
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
    // This function handles user state changes from Firebase,
    // both for session persistence (on page load) and after a successful login.
    const handleAuthState = async (firebaseUser: FirebaseUser | null) => {
        try {
            if (firebaseUser?.email) {
                // We have a user from Firebase. Check if they are authorized in our database.
                const appUser = await findUserByEmailInDB(firebaseUser.email);
                if (appUser) {
                    // Success! User is authenticated and authorized.
                    setUser(appUser);
                    setError(null);
                } else {
                    // This is a new user, automatically register them as an employee
                    const newUserName = firebaseUser.displayName || 'New User';
                    const newUserEmail = firebaseUser.email;
                    
                    try {
                        const newAppUser = await addEmployeeToDB(newUserName, newUserEmail);
                        setUser(newAppUser);
                        setError(null);
                    } catch (addError) {
                        console.error("Failed to add new user to database:", addError);
                        setError("Failed to register your new account. Please contact support.");
                        setUser(null);
                        await auth.signOut(); // Sign out unauthorized user.
                    }
                }
            } else {
                // No user from Firebase.
                setUser(null);
            }
        } catch (error) {
            console.error("Authentication error:", error);
            setError("An unexpected error occurred during authentication.");
            setUser(null);
        } finally {
            // Initialization is complete once we have checked the auth state.
            setIsInitializing(false);
        }
    };

    // The onAuthStateChanged listener is the primary mechanism for tracking auth state.
    const unsubscribe = auth.onAuthStateChanged(handleAuthState);

    // The component will unmount and this cleanup function will be called.
    return () => unsubscribe();
  }, []);

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use signInWithPopup because signInWithRedirect is not supported in this environment.
      await auth.signInWithPopup(googleProvider);
      // After a successful popup sign-in, the `onAuthStateChanged` listener
      // will be triggered, and the `handleAuthState` function above will take care of
      // verifying the user and setting the state.
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in process was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by the browser. Please allow popups for this site.');
      } else {
        setError("An error occurred during sign-in. Please try again.");
        console.error("Sign-in error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const previewLogin = (role: Role) => {
    setError(null);
    setIsInitializing(false);
    if (role === Role.ADMIN) {
      setUser({ id: 'preview-admin', name: 'Preview Admin', email: 'admin@preview.com', role: Role.ADMIN });
    } else {
      setUser({ id: 'preview-article', name: 'Preview Article', email: 'article@preview.com', role: Role.EMPLOYEE });
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError("Failed to sign out.");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, previewLogin, isLoading, isInitializing, error }}>
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