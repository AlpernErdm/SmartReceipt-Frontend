"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Receipt, TrendingUp, ShoppingBag, DollarSign } from "lucide-react";
import { receiptsApi } from "@/lib/api-client";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { authStorage } from "@/lib/auth-storage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { Receipt as ReceiptType } from "@/types/receipt";

interface DashboardStats {
  totalReceipts: number;
  totalAmount: number;
  averageAmount: number;
  totalItems: number;
  recentReceipts: ReceiptType[];
}

function DashboardPageContent() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalReceipts: 0,
    totalAmount: 0,
    averageAmount: 0,
    totalItems: 0,
    recentReceipts: [],
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = authStorage.getUser();
    setUser(savedUser);
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const receipts = await receiptsApi.getAll({ pageSize: 100 });
      
      const totalReceipts = receipts.length;
      const totalAmount = receipts.reduce((sum, r) => sum + r.totalAmount, 0);
      const averageAmount = totalReceipts > 0 ? totalAmount / totalReceipts : 0;
      const totalItems = receipts.reduce((sum, r) => sum + r.items.length, 0);
      const recentReceipts = receipts.slice(0, 5);

      setStats({
        totalReceipts,
        totalAmount,
        averageAmount,
        totalItems,
        recentReceipts,
      });
    } catch (error) {
      console.error("Dashboard yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hoş Geldiniz! 👋
        </h1>
        <p className="text-gray-600">
          Fişlerinizi AI ile otomatik okuyun, harcamalarınızı kolayca takip edin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Fiş</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReceipts}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Tutar</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ortalama Fiş</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats.averageAmount)}
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Ürün</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Receipts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Son Fişler</h2>
        </div>

        {stats.recentReceipts.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Henüz fiş bulunmuyor</p>
            <button
              onClick={() => router.push("/upload")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Fişinizi Yükleyin
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {stats.recentReceipts.map((receipt) => (
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
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(receipt.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}

