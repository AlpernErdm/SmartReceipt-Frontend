// Expense Category Enum (örnek - backend'deki gerçek enum'a göre güncellenebilir)
export enum ExpenseCategory {
  Groceries = 1,
  Restaurants = 2,
  Transportation = 3,
  Shopping = 4,
  Entertainment = 5,
  Bills = 6,
  Healthcare = 7,
  Education = 8,
  Travel = 9,
  Other = 10,
}

// Trend Period Enum
export enum TrendPeriod {
  Monthly = 1,
  Yearly = 2,
}

// Comparison Type Enum
export enum ComparisonType {
  MonthOverMonth = 1,
  YearOverYear = 2,
  Custom = 3,
}

// Category Analytics DTO
export interface CategoryAnalyticsDto {
  categorySpendings: CategorySpending[];
  totalAmount: number;
  totalReceipts: number;
}

// Category Spending
export interface CategorySpending {
  category: ExpenseCategory;
  categoryName: string;
  amount: number;
  receiptCount: number;
  percentage: number;
}

// Trend Analytics DTO
export interface TrendAnalyticsDto {
  dataPoints: TrendDataPoint[];
  totalAmount: number;
  averageAmount: number;
  growthPercentage?: number | null;
}

// Trend Data Point
export interface TrendDataPoint {
  period: string;
  amount: number;
  receiptCount: number;
}

// Store Analytics DTO
export interface StoreAnalyticsDto {
  topStores: StoreSpending[];
  totalStores: number;
}

// Store Spending
export interface StoreSpending {
  storeName: string;
  totalAmount: number;
  receiptCount: number;
  lastPurchaseDate: string;
}

// Tax Report DTO
export interface TaxReportDto {
  year: number;
  month?: number;
  totalAmount: number;
  totalTaxAmount: number;
  kdvAmount: number;
  otvAmount: number;
  breakdown: TaxBreakdown[];
}

// Tax Breakdown
export interface TaxBreakdown {
  category: ExpenseCategory;
  amount: number;
  taxAmount: number;
  taxRate: number;
}

// Comparison Analytics DTO
export interface ComparisonAnalyticsDto {
  type: ComparisonType;
  periods: ComparisonPeriod[];
  changePercentage?: number | null;
  changeAmount?: number | null;
}

// Comparison Period
export interface ComparisonPeriod {
  periodLabel: string;
  amount: number;
  receiptCount: number;
}

