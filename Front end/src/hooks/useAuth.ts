import { useState, useEffect, useCallback, useMemo } from 'react';
import { signOut, onAuthStateChanged} from 'firebase/auth';
import type { User, AuthError } from 'firebase/auth';
import { auth } from '../config/firebase/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false
      });
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setAuthState({
        user: null,
        loading: false
      });
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  }, []);

  const authValue = useMemo(() => ({
    user: authState.user,
    loading: authState.loading,
    logout
  }), [authState.user, authState.loading, logout]);

  return authValue;
}; 