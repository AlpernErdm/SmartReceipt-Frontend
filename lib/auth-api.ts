import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await authApiClient.post('/Auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authApiClient.post('/Auth/login', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await authApiClient.post('/Auth/refresh-token', { refreshToken });
    return response.data;
  },

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await authApiClient.get('/Auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  logout: async (token: string): Promise<void> => {
    await authApiClient.post('/Auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};



