export interface Receipt {
  id: string;
  storeName: string;
  receiptDate: string;
  totalAmount: number;
  taxAmount: number;
  imageUrl: string | null;
  isProcessed: boolean;
  createdAt: string;
  items: ReceiptItem[];
}

export interface ReceiptItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  receiptId: string;
}

export interface CreateReceiptDto {
  storeName: string;
  receiptDate: string;
  totalAmount: number;
  taxAmount: number;
  items: CreateReceiptItemDto[];
}

export interface CreateReceiptItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface ReceiptScanResult {
  isSuccess: boolean;
  errorMessage?: string;
  storeName: string;
  receiptDate: string;
  totalAmount: number;
  taxAmount: number;
  currency: string;
  rawOcrText?: string;
  items: ScannedReceiptItem[];
}

export interface ScannedReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface GetReceiptsParams {
  fromDate?: string;
  toDate?: string;
  storeName?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ReceiptStats {
  totalReceipts: number;
  totalAmount: number;
  averageAmount: number;
  totalItems: number;
  topStores: { name: string; count: number; total: number }[];
  categoryBreakdown: { category: string; count: number; total: number }[];
}


