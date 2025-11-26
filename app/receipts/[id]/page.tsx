"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Store, 
  Receipt as ReceiptIcon, 
  Tag,
  ShoppingBag
} from "lucide-react";
import { receiptsApi } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";

export default function ReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadReceipt(params.id as string);
    }
  }, [params.id]);

  async function loadReceipt(id: string) {
    try {
      setLoading(true);
      const data = await receiptsApi.getById(id);
      setReceipt(data);
    } catch (err: any) {
      setError(err.message || "Fiş yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-900 font-semibold mb-4">
            {error || "Fiş bulunamadı"}
          </p>
          <button
            onClick={() => router.push("/receipts")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fişlere Dön
          </button>
        </div>
      </div>
    );
  }

  const itemsByCategory = receipt.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof receipt.items>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.push("/receipts")}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Fişlere Dön</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{receipt.storeName}</h1>
              <div className="flex items-center space-x-4 text-primary-foreground/90">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(receipt.receiptDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>{receipt.items.length} ürün</span>
                </div>
              </div>
            </div>
            {receipt.isProcessed && (
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-white/20 text-white rounded-full">
                ✓ AI ile İşlendi
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-200">
          <div className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Toplam Tutar</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(receipt.totalAmount)}
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">KDV</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(receipt.taxAmount)}
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">KDV Hariç</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(receipt.totalAmount - receipt.taxAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ürünler</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-gray-900">{category}</h3>
                <span className="text-sm text-gray-600">({items.length} ürün)</span>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.quantity} adet × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-600">
                    {category} Toplamı:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(
                      items.reduce((sum, item) => sum + item.totalPrice, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Fiş Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Fiş ID</p>
            <p className="font-mono text-gray-900 mt-1">{receipt.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Oluşturulma Tarihi</p>
            <p className="text-gray-900 mt-1">{formatDate(receipt.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


