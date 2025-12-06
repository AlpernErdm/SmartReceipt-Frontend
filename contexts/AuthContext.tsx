'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';
import { authApi } from '@/lib/auth-api';
import { authStorage } from '@/lib/auth-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAuth = useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();
    
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.refreshToken(refreshToken);
      authStorage.setAccessToken(response.accessToken);
      authStorage.setRefreshToken(response.refreshToken);
      authStorage.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      authStorage.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getAccessToken();
      const savedUser = authStorage.getUser();

      if (token && savedUser) {
        try {
          const currentUser = await authApi.getCurrentUser(token);
          setUser(currentUser);
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
          await refreshAuth();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAuth]);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      authStorage.setAccessToken(response.accessToken);
      authStorage.setRefreshToken(response.refreshToken);
      authStorage.setUser(response.user);
      setUser(response.user);
      router.push('/receipts');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Giriş başarısız');
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      authStorage.setAccessToken(response.accessToken);
      authStorage.setRefreshToken(response.refreshToken);
      authStorage.setUser(response.user);
      setUser(response.user);
      router.push('/receipts');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Kayıt başarısız');
    }
  };

  const logout = async () => {
    const token = authStorage.getAccessToken();
    
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Çıkış hatası:', error);
    } finally {
      authStorage.clearAuth();
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}




