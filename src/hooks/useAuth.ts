import { useState, useCallback } from 'react';
import type { AuthState } from '../types';
import { mockUsers } from '../data/mockData';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication
    const user = mockUsers.find(u => u.username === username);
    
    if (user && password === 'password') {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  return {
    ...authState,
    login,
    logout
  };
};