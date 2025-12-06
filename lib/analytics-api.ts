import { apiClient } from './api-client';
import type {
  CategoryAnalyticsDto,
  TrendAnalyticsDto,
  StoreAnalyticsDto,
  TaxReportDto,
  ComparisonAnalyticsDto,
} from '@/types/analytics';
import { TrendPeriod, ComparisonType } from '@/types/analytics';

export const analyticsApi = {
  /**
   * Kategori bazlı harcama analizi
   */
  getCategoryAnalytics: async (fromDate?: string, toDate?: string): Promise<CategoryAnalyticsDto> => {
    const params: { fromDate?: string; toDate?: string } = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const response = await apiClient.get('/Analytics/categories', { params });
    return response.data;
  },

  /**
   * Trend analizi
   */
  getTrendAnalytics: async (period: TrendPeriod = TrendPeriod.Monthly): Promise<TrendAnalyticsDto> => {
    // Backend expects integer: 1=Monthly, 2=Yearly
    const periodValue = period === TrendPeriod.Monthly ? 1 : 2;
    const response = await apiClient.get('/Analytics/trends', {
      params: { period: periodValue },
    });
    return response.data;
  },

  /**
   * En çok harcama yapılan mağazalar
   */
  getStoreAnalytics: async (
    fromDate?: string,
    toDate?: string,
    topCount: number = 10
  ): Promise<StoreAnalyticsDto> => {
    const params: { fromDate?: string; toDate?: string; topCount?: number } = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    params.topCount = topCount;

    const response = await apiClient.get('/Analytics/stores', { params });
    return response.data;
  },

  /**
   * Vergi raporu
   */
  getTaxReport: async (year: number, month?: number): Promise<TaxReportDto> => {
    const params: { year: number; month?: number } = { year };
    if (month) params.month = month;

    const response = await apiClient.get('/Analytics/tax-report', { params });
    return response.data;
  },

  /**
   * Karşılaştırmalı analiz
   */
  getComparisonAnalytics: async (type: ComparisonType): Promise<ComparisonAnalyticsDto> => {
    // Backend expects integer: 1=MonthOverMonth, 2=YearOverYear
    const typeValue = type === ComparisonType.MonthOverMonth ? 1 : 2;
    const response = await apiClient.get('/Analytics/comparison', {
      params: { type: typeValue },
    });
    return response.data;
  },
};

