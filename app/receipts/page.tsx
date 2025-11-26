"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { receiptsApi } from "@/lib/api-client";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { Receipt, GetReceiptsParams } from "@/types/receipt";

export default function ReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GetReceiptsParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadReceipts();
  }, [filters]);

  async function loadReceipts() {
    try {
      setLoading(true);
      const data = await receiptsApi.getAll(filters);
      setReceipts(data);
    } catch (error) {
      console.error("Fişler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(storeName: string) {
    setFilters({ ...filters, storeName: storeName || undefined, pageNumber: 1 });
  }

  function handleDateFilter(fromDate?: string, toDate?: string) {
    setFilters({ ...filters, fromDate, toDate, pageNumber: 1 });
  }

  function nextPage() {
    setFilters({ ...filters, pageNumber: (filters.pageNumber || 1) + 1 });
  }

  function prevPage() {
    setFilters({ ...filters, pageNumber: Math.max(1, (filters.pageNumber || 1) - 1) });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fişlerim</h1>
        <p className="text-gray-600">
          Tüm fişlerinizi görüntüleyin ve filtreleyin
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Mağaza adı ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              placeholder="Başlangıç tarihi"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => handleDateFilter(e.target.value, filters.toDate)}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              placeholder="Bitiş tarihi"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => handleDateFilter(filters.fromDate, e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Yükleniyor...</p>
          </div>
        ) : receipts.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Fiş bulunamadı</p>
            <button
              onClick={() => setFilters({ pageNumber: 1, pageSize: 10 })}
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                onClick={() => router.push(`/receipts/${receipt.id}`)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {receipt.storeName}
                      </h3>
                      {receipt.isProcessed && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          ✓ İşlendi
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateShort(receipt.receiptDate)} • {receipt.items.length} ürün
                    </p>
                    
                    {receipt.items.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {receipt.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {item.productName}
                          </span>
                        ))}
                        {receipt.items.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{receipt.items.length - 3} daha
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(receipt.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      KDV: {formatCurrency(receipt.taxAmount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {receipts.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={filters.pageNumber === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Önceki</span>
            </button>

            <span className="text-sm text-gray-600">
              Sayfa {filters.pageNumber}
            </span>

            <button
              onClick={nextPage}
              disabled={receipts.length < (filters.pageSize || 10)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Sonraki</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


