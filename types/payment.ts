// Payment Status Enum
export enum PaymentStatus {
  Pending = 1,
  Processing = 2,
  Completed = 3,
  Failed = 4,
  Cancelled = 5,
  Refunded = 6,
  PartiallyRefunded = 7,
}

// Payment Provider Enum
export enum PaymentProvider {
  Iyzico = 1,
  Stripe = 2,
  PayPal = 3,
}

// Currency Enum
export enum Currency {
  TRY = 0,
  USD = 1,
  EUR = 2,
  GBP = 3,
}

// Payment Result DTO
export interface PaymentResult {
  isSuccess: boolean;
  paymentId?: string;
  transactionId?: string;
  redirectUrl?: string;
  status: PaymentStatus;
  errorMessage?: string;
}

// Create Payment Request
export interface CreatePaymentRequest {
  subscriptionId: string;
  invoiceId?: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  paymentMethod?: string;
  description?: string;
  metadata?: Record<string, any>;
  cardToken?: string;
  cardUserKey?: string;
  callbackUrl?: string;
}

// Payment History DTO
export interface PaymentHistoryDto {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  provider: PaymentProvider;
  createdAt: string;
  paidAt?: string;
  errorMessage?: string;
}

// Refund Request
export interface RefundRequest {
  amount: number;
  reason?: string;
}

// Refund Result
export interface RefundResult {
  isSuccess: boolean;
  refundId?: string;
  status: PaymentStatus;
  errorMessage?: string;
}

