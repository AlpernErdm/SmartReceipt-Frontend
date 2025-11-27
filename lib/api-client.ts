import axios from 'axios';
import type { Receipt, GetReceiptsParams } from '@/types/receipt';
import { authStorage } from './auth-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Her istekte token ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const receiptsApi = {
  getAll: async (params?: GetReceiptsParams): Promise<Receipt[]> => {
    const response = await apiClient.get('/Receipts', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Receipt> => {
    const response = await apiClient.get(`/Receipts/${id}`);
    return response.data;
  },

  scanReceipt: async (file: File): Promise<Receipt> => {
    const formData = new FormData();
    formData.append('imageFile', file);

    const response = await apiClient.post('/Receipts/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  create: async (data: {
    storeName: string;
    receiptDate: string;
    totalAmount: number;
    taxAmount: number;
    items: Array<{
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      category: string;
    }>;
  }): Promise<Receipt> => {
    const response = await apiClient.post('/Receipts', data);
    return response.data;
  },
};

// Response interceptor - Hata yönetimi
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 hatası ve token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          authStorage.setAccessToken(accessToken);
          authStorage.setRefreshToken(newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          authStorage.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        authStorage.clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Bir hata oluştu');
    } else if (error.request) {
      console.error('Network Error:', error.request);
      throw new Error('Sunucuya bağlanılamadı');
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
);


