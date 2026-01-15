import { apiClient } from './api-client';
import type {
  SubscriptionPlanDto,
  SubscriptionDto,
  UsageDto,
  SubscribeRequest,
  CancelSubscriptionRequest,
} from '@/types/subscription';

export const subscriptionsApi = {
  /**
   * Tüm aktif abonelik planlarını listeler
   */
  getPlans: async (): Promise<SubscriptionPlanDto[]> => {
    const response = await apiClient.get('/Subscriptions/plans');
    return response.data;
  },

  /**
   * Kullanıcının aktif aboneliğini getirir
   */
  getCurrent: async (): Promise<SubscriptionDto> => {
    const response = await apiClient.get('/Subscriptions/current');
    return response.data;
  },

  /**
   * Kullanıcının kullanım istatistiklerini getirir
   */
  getUsage: async (year?: number, month?: number): Promise<UsageDto> => {
    const params: { year?: number; month?: number } = {};
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await apiClient.get('/Subscriptions/usage', { params });
    return response.data;
  },

  /**
   * Yeni abonelik oluşturur
   */
  subscribe: async (data: SubscribeRequest): Promise<SubscriptionDto> => {
    const response = await apiClient.post('/Subscriptions/subscribe', data);
    return response.data;
  },

  /**
   * Aktif aboneliği iptal eder
   */
  cancel: async (data?: CancelSubscriptionRequest): Promise<SubscriptionDto> => {
    const response = await apiClient.post('/Subscriptions/cancel', data || {});
    return response.data;
  },

  /**
   * Aboneliği aktif eder (Trial'dan Active'e geçirir)
   */
  activate: async (subscriptionId: string): Promise<SubscriptionDto> => {
    const response = await apiClient.post(`/Subscriptions/${subscriptionId}/activate`);
    return response.data;
  },
};
