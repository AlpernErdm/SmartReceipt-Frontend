// Plan Type Enum
export enum PlanType {
  Free = 0,
  Basic = 1,
  Pro = 2,
  Enterprise = 3,
}

// Subscription Status Enum
export enum SubscriptionStatus {
  Active = 1,
  Cancelled = 2,
  Expired = 3,
  Suspended = 4,
  Trial = 5,
}

// Billing Period Enum
export enum BillingPeriod {
  Monthly = 1,
  Yearly = 2,
}

// Subscription Plan DTO
export interface SubscriptionPlanDto {
  id: string;
  name: string;
  description: string;
  planType: PlanType;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyScanLimit: number;
  storageLimitMB: number;
  trialDays: number | null;
  hasApiAccess: boolean;
  hasAdvancedAnalytics: boolean;
  hasTeamManagement: boolean;
  hasPrioritySupport: boolean;
}

// Subscription DTO
export interface SubscriptionDto {
  id: string;
  userId: string;
  plan: SubscriptionPlanDto;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  nextBillingDate: string | null;
  autoRenew: boolean;
  createdAt: string;
}

// Usage DTO
export interface UsageDto {
  userId: string;
  year: number;
  month: number;
  scanCount: number;
  scanLimit: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  apiCallCount: number;
  usagePercentage: number;
  isLimitExceeded: boolean;
}

// Subscribe Request
export interface SubscribeRequest {
  planId: string;
  billingPeriod: BillingPeriod;
}

// Cancel Subscription Request
export interface CancelSubscriptionRequest {
  reason?: string;
}

