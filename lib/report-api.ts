import { apiClient } from './api-client';
import type { ReportRequest } from '@/types/report';

export const reportApi = {
  /**
   * PDF raporu oluşturur ve indirir
   */
  generatePdfReport: async (request: ReportRequest): Promise<Blob> => {
    const response = await apiClient.post('/Reports/pdf', request, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Excel raporu oluşturur ve indirir
   */
  generateExcelReport: async (request: ReportRequest): Promise<Blob> => {
    const response = await apiClient.post('/Reports/excel', request, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * CSV raporu oluşturur ve indirir
   */
  generateCsvReport: async (request: ReportRequest): Promise<Blob> => {
    const response = await apiClient.post('/Reports/csv', request, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Raporu indirir (helper function)
   */
  downloadReport: async (
    request: ReportRequest,
    format: 'pdf' | 'excel' | 'csv'
  ): Promise<void> => {
    let blob: Blob;
    let extension: string;

    switch (format) {
      case 'pdf':
        blob = await reportApi.generatePdfReport(request);
        extension = 'pdf';
        break;
      case 'excel':
        blob = await reportApi.generateExcelReport(request);
        extension = 'xlsx';
        break;
      case 'csv':
        blob = await reportApi.generateCsvReport(request);
        extension = 'csv';
        break;
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};

