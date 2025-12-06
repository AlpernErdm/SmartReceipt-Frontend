// Report Type Enum
export enum ReportType {
  Receipts = 1,
  CategoryAnalysis = 2,
  TaxReport = 3,
  TrendAnalysis = 4,
  StoreAnalysis = 5,
  BudgetReport = 6,
}

// Report Request
export interface ReportRequest {
  type: ReportType;
  fromDate?: string;
  toDate?: string;
  year?: number;
  month?: number;
  category?: number;
  currency?: number;
}

