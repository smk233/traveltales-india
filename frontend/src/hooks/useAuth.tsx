import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../helpers/axios-instance';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, bio?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  toggleFollowUser: (targetUserId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.data.user);
    }
  };

  const register = async (name: string, email: string, password: string, bio?: string) => {
    await axiosInstance.post('/auth/register', { name, email, password, bio });
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    setUser(null);
  };

  const toggleFollowUser = async (targetUserId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await axiosInstance.post(`/users/${targetUserId}/follow`);
      if (res.data.success) {
        const { followed } = res.data.data;
        setUser((prev) => {
          if (!prev) return null;
          const following = followed
            ? [...prev.following, targetUserId]
            : prev.following.filter((id) => id !== targetUserId);
          return { ...prev, following };
        });
        return followed;
      }
      return false;
    } catch (err) {
      console.error('Follow failed', err);
      return false;
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkSession, toggleFollowUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
