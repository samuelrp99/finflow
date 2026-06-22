import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthSession } from '../types/auth';

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('finflow_session');
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem('finflow_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    const newSession: AuthSession = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    setSession(newSession);
    localStorage.setItem('finflow_session', JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('finflow_session');
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
