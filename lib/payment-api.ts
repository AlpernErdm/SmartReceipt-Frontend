import { apiClient } from './api-client';
import type {
  PaymentResult,
  CreatePaymentRequest,
  PaymentHistoryDto,
  RefundRequest,
  RefundResult,
} from '@/types/payment';

export const paymentApi = {
  /**
   * Yeni ödeme oluşturur
   */
  createPayment: async (request: CreatePaymentRequest): Promise<PaymentResult> => {
    const response = await apiClient.post('/Payments', request);
    return response.data;
  },

  /**
   * Ödeme durumunu getirir
   */
  getPaymentStatus: async (paymentId: string): Promise<PaymentResult> => {
    const response = await apiClient.get(`/Payments/${paymentId}`);
    return response.data;
  },

  /**
   * Ödeme geçmişini getirir
   */
  getPaymentHistory: async (): Promise<PaymentHistoryDto[]> => {
    const response = await apiClient.get('/Payments/history');
    return response.data;
  },

  /**
   * İade oluşturur
   */
  createRefund: async (paymentId: string, request: RefundRequest): Promise<RefundResult> => {
    const response = await apiClient.post(`/Payments/${paymentId}/refund`, request);
    return response.data;
  },
};

