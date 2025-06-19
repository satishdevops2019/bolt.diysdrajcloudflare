// frontend/src/contexts/AuthContext.tsx
'use client'; // This is a client component

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios'; // Or your preferred HTTP client

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email_or_username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        axios.defaults.headers.common['x-access-token'] = storedToken;
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      // Assuming backend /api/auth/signin can handle email
      // It might be better to send { identifier, password } and let backend decide
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email: identifier, // Or username: identifier, or just identifier
        password,
      });
      const { accessToken, ...userData } = response.data;
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      axios.defaults.headers.common['x-access-token'] = accessToken;
      setIsLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error; // Re-throw to handle in component
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
      });
      // Optionally log in the user directly after signup or redirect to login
      setIsLoading(false);
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      throw error; // Re-throw to handle in component
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    delete axios.defaults.headers.common['x-access-token'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, signup, logout }}>
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
