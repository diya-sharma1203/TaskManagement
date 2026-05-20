import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'admin' | 'member') => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const data = response.data;
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'member') => {
    const response = await axiosInstance.post('/auth/register', { name, email, password, role });
    const data = response.data;
    localStorage.setItem('token', data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
