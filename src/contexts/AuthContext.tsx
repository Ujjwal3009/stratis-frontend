'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api-client';
import {
  setAuthToken,
  removeAuthToken,
  getUser,
  setUser as setStorageUser,
  removeUser,
  User,
} from '@/lib/auth';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from local storage
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/login', data);

      const { accessToken, user: userData } = response;
      // Map API user to auth user
      const authUser: User = {
        id: userData.id,
        email: userData.email,
        name: userData.fullName || userData.username,
        role: 'USER', // Default role if not provided
      };

      setAuthToken(accessToken);
      setStorageUser(authUser);
      setUser(authUser);

      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      await api.post<AuthResponse>('/auth/register', data);
      // Automatically login after register? Or redirect to login?
      // For now, let's just redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    removeUser();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
