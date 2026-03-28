import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isClient: boolean;
  isAgent: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    }
  }, []);

  const login = (data: AuthResponse) => {
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isClient: user?.role === 'CLIENT',
        isAgent: user?.role === 'AGENT',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
