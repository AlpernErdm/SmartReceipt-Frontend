"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Receipt, TrendingUp, ShoppingBag, DollarSign, Crown, AlertTriangle, Scan, HardDrive, ArrowRight } from "lucide-react";
import { receiptsApi } from "@/lib/api-client";
import { subscriptionsApi } from "@/lib/subscription-api";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { authStorage } from "@/lib/auth-storage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { Receipt as ReceiptType } from "@/types/receipt";
import type { SubscriptionDto, UsageDto } from "@/types/subscription";
import { SubscriptionStatus } from "@/types/subscription";

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
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [usage, setUsage] = useState<UsageDto | null>(null);
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
      
      // Load receipts, subscription, and usage in parallel
      const [receiptsData, subscriptionData, usageData] = await Promise.allSettled([
        receiptsApi.getAll({ pageSize: 100 }),
        subscriptionsApi.getCurrent().catch(() => null), // 404 is OK, means no subscription
        subscriptionsApi.getUsage().catch(() => null), // Usage might fail if no subscription
      ]);

      // Process receipts
      if (receiptsData.status === "fulfilled") {
        const receipts = receiptsData.value;
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
      }

      // Process subscription
      if (subscriptionData.status === "fulfilled" && subscriptionData.value) {
        setSubscription(subscriptionData.value);
      }

      // Process usage
      if (usageData.status === "fulfilled" && usageData.value) {
        setUsage(usageData.value);
      }
    } catch (error) {
      console.error("Dashboard yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatStorage(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  function getUsageColor(percentage: number): string {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-green-500";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hoş Geldiniz! 👋
            </h1>
            <p className="text-gray-600">
              Fişlerinizi AI ile otomatik okuyun, harcamalarınızı kolayca takip edin
            </p>
          </div>
          <button
            onClick={() => router.push("/analytics")}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Analitik Dashboard
          </button>
        </div>
      </div>

      {/* Subscription & Usage Info */}
      {(subscription || usage) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Info */}
          {subscription && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Crown className="h-6 w-6 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Mevcut Plan</h3>
                </div>
                {subscription.status === SubscriptionStatus.Active && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Aktif
                  </span>
                )}
                {subscription.status === SubscriptionStatus.Trial && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    Deneme
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{subscription.plan.name}</p>
              <p className="text-sm text-gray-600 mb-4">{subscription.plan.description}</p>
              <button
                onClick={() => router.push("/subscriptions/current")}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Abonelik Detayları
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}

          {/* Usage Stats */}
          {usage && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Kullanım İstatistikleri</h3>
                {usage.isLimitExceeded && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Limit Aşıldı
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Scan Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Scan className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-600">Aylık Tarama</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {usage.scanCount} / {usage.scanLimit === -1 ? "Sınırsız" : usage.scanLimit}
                    </span>
                  </div>
                  {usage.scanLimit !== -1 && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getUsageColor(usage.usagePercentage)}`}
                          style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
                        />
                      </div>
                      {usage.usagePercentage >= 80 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {usage.usagePercentage >= 100
                            ? "Limit aşıldı. Plan yükseltmeyi düşünün."
                            : "Limit yaklaşıyor. Plan yükseltmeyi düşünün."}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Storage Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-600">Depolama</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatStorage(usage.storageUsedBytes)} / {formatStorage(usage.storageLimitBytes)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min((usage.storageUsedBytes / usage.storageLimitBytes) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {(usage.usagePercentage >= 80 || usage.isLimitExceeded) && (
                <button
                  onClick={() => router.push("/subscriptions")}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Plan Yükselt
                </button>
              )}
            </div>
          )}
        </div>
      )}

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

