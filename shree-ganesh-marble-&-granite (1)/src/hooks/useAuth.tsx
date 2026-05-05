import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>; // This was for Google, we'll keep the signature but adjust logic if needed, or remove
  logout: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await apiClient.get('/auth/me');
          setUser(userData);
          setProfile(userData);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async () => {
    // Basic Google login imitation or just alert it's disabled for now
    alert("Google login is disabled in MongoDB migration. Please use Email login.");
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const data = await apiClient.post('/auth/login', { email, password: pass });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setProfile(data.user);
  };

  const registerWithEmail = async (email: string, pass: string, name: string, phone: string) => {
    const data = await apiClient.post('/auth/register', { email, password: pass, name, phone });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setProfile(data.user);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, loginWithEmail, registerWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
