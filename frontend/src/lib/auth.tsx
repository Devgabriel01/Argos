'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginRequest } from './api';

interface AuthUser { id: string; name: string; email: string; role: string; }
interface AuthContextType { user: AuthUser | null; token: string | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void; isAdmin: boolean; }

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('argos_token');
    const savedUser = localStorage.getItem('argos_user');
    if (savedToken && savedUser) {
      try { setToken(savedToken); setUser(JSON.parse(savedUser)); }
      catch { localStorage.removeItem('argos_token'); localStorage.removeItem('argos_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('argos_token', data.access_token);
    localStorage.setItem('argos_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('argos_token');
    localStorage.removeItem('argos_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
