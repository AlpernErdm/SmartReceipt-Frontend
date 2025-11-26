"use client";

import { useEffect, useState } from "react";
import { Receipt, TrendingUp, ShoppingCart, Calendar } from "lucide-react";
import { receiptsApi } from "@/lib/api-client";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { Receipt as ReceiptType } from "@/types/receipt";
import Link from "next/link";

interface DashboardStats {
  totalReceipts: number;
  totalAmount: number;
  averageAmount: number;
  totalItems: number;
  recentReceipts: ReceiptType[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const receipts = await receiptsApi.getAll({ pageSize: 10 });
      
      const totalAmount = receipts.reduce((sum, r) => sum + r.totalAmount, 0);
      const totalItems = receipts.reduce((sum, r) => sum + r.items.length, 0);

      setStats({
        totalReceipts: receipts.length,
        totalAmount,
        averageAmount: receipts.length > 0 ? totalAmount / receipts.length : 0,
        totalItems,
        recentReceipts: receipts.slice(0, 5),
      });
    } catch (error) {
      console.error("İstatistikler yüklenemedi:", error);
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

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hoş Geldiniz! 👋
        </h1>
        <p className="text-gray-600">
          Fişlerinizi AI ile otomatik okuyun, harcamalarınızı kolayca takip edin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Fiş"
          value={stats?.totalReceipts || 0}
          icon={Receipt}
          color="bg-blue-500"
        />
        <StatCard
          title="Toplam Tutar"
          value={formatCurrency(stats?.totalAmount || 0)}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="Ortalama Fiş"
          value={formatCurrency(stats?.averageAmount || 0)}
          icon={Calendar}
          color="bg-purple-500"
        />
        <StatCard
          title="Toplam Ürün"
          value={stats?.totalItems || 0}
          icon={ShoppingCart}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Son Fişler</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats?.recentReceipts && stats.recentReceipts.length > 0 ? (
            stats.recentReceipts.map((receipt) => (
              <Link
                key={receipt.id}
                href={`/receipts/${receipt.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {receipt.storeName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateShort(receipt.receiptDate)} • {receipt.items.length} ürün
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(receipt.totalAmount)}
                    </p>
                    {receipt.isProcessed && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full mt-1">
                        ✓ İşlendi
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-12 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Henüz fiş bulunmuyor</p>
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                İlk Fişinizi Yükleyin
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}


