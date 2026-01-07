"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  BarChart3,
  HardDrive,
  Scan,
  AlertTriangle,
  X,
} from "lucide-react";
import { subscriptionsApi } from "@/lib/subscription-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SubscriptionDto, UsageDto } from "@/types/subscription";
import { SubscriptionStatus, BillingPeriod } from "@/types/subscription";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function CurrentSubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [usage, setUsage] = useState<UsageDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const payment = searchParams.get("payment");
    
    if (success === "true") {
      if (payment === "completed") {
        setSuccessMessage("Ödeme başarıyla tamamlandı ve aboneliğiniz aktif edildi!");
      } else {
        setSuccessMessage("Abonelik başarıyla oluşturuldu!");
      }
    }
    loadData();
  }, [searchParams]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      // Load subscription and usage in parallel
      const [subData, usageData] = await Promise.allSettled([
        subscriptionsApi.getCurrent(),
        subscriptionsApi.getUsage(),
      ]);

      if (subData.status === "fulfilled") {
        setSubscription(subData.value);
      } else {
        // 404 means no active subscription
        if (subData.reason?.response?.status !== 404) {
          setError(subData.reason?.message || "Abonelik bilgisi yüklenemedi");
        }
      }

      if (usageData.status === "fulfilled") {
        setUsage(usageData.value);
      } else {
        console.error("Usage data error:", usageData.reason);
      }
    } catch (err: any) {
      setError(err.message || "Veriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    try {
      setCancelling(true);
      setError(null);
      await subscriptionsApi.cancel(cancelReason ? { reason: cancelReason } : undefined);
      setShowCancelModal(false);
      setCancelReason("");
      await loadData(); // Reload to get updated subscription
    } catch (err: any) {
      setError(err.message || "Abonelik iptal edilemedi");
    } finally {
      setCancelling(false);
    }
  }

  function getStatusBadge(status: SubscriptionStatus) {
    switch (status) {
      case SubscriptionStatus.Active:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
            <CheckCircle className="h-4 w-4 mr-1" />
            Aktif
          </span>
        );
      case SubscriptionStatus.Trial:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            <Calendar className="h-4 w-4 mr-1" />
            Deneme
          </span>
        );
      case SubscriptionStatus.Cancelled:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
            <XCircle className="h-4 w-4 mr-1" />
            İptal Edildi
          </span>
        );
      case SubscriptionStatus.Expired:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
            <XCircle className="h-4 w-4 mr-1" />
            Süresi Doldu
          </span>
        );
      case SubscriptionStatus.Suspended:
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Askıya Alındı
          </span>
        );
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

  // No active subscription
  if (!subscription) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aktif Abonelik Bulunamadı</h2>
          <p className="text-gray-600 mb-6">
            Şu anda aktif bir aboneliğiniz bulunmuyor. Ücretsiz plan limitleriyle devam ediyorsunuz.
          </p>
          <button
            onClick={() => router.push("/subscriptions")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Plan Seç
          </button>
        </div>

        {/* Show usage if available (Free plan) */}
        {usage && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanım İstatistikleri</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Aylık Tarama</span>
                  <span className="text-sm font-medium text-gray-900">
                    {usage.scanCount} / {usage.scanLimit === -1 ? "Sınırsız" : usage.scanLimit}
                  </span>
                </div>
                {usage.scanLimit !== -1 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(usage.usagePercentage)}`}
                      style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Depolama</span>
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
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)}>
              <X className="h-5 w-5 text-green-500" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Hata</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mevcut Abonelik</h1>
            <p className="text-gray-600">Abonelik bilgileriniz ve kullanım istatistikleriniz</p>
          </div>
          {getStatusBadge(subscription.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-3">
              <CreditCard className="h-6 w-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Plan</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{subscription.plan.name}</p>
            <p className="text-sm text-gray-600">{subscription.plan.description}</p>
            <p className="text-lg font-medium text-gray-900 mt-3">
              {formatCurrency(
                subscription.billingPeriod === BillingPeriod.Monthly
                  ? subscription.plan.monthlyPrice
                  : subscription.plan.yearlyPrice
              )}
              <span className="text-sm text-gray-600 ml-1">
                /{subscription.billingPeriod === BillingPeriod.Monthly ? "ay" : "yıl"}
              </span>
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-3">
              <Calendar className="h-6 w-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Faturalama</h3>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Başlangıç Tarihi</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bitiş Tarihi</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(subscription.endDate)}
                </p>
              </div>
              {subscription.nextBillingDate && (
                <div>
                  <p className="text-sm text-gray-600">Sonraki Faturalama</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {subscription.cancelledAt && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Bu abonelik {formatDate(subscription.cancelledAt)} tarihinde iptal edildi.
                </p>
                {subscription.cancellationReason && (
                  <p className="text-sm text-orange-700 mt-1">
                    <strong>Neden:</strong> {subscription.cancellationReason}
                  </p>
                )}
                <p className="text-sm text-orange-700 mt-1">
                  Abonelik {formatDate(subscription.endDate)} tarihine kadar aktif kalacak.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {subscription.status === SubscriptionStatus.Active ||
        subscription.status === SubscriptionStatus.Trial ? (
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/subscriptions")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Plan Değiştir
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-3 bg-white border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Aboneliği İptal Et
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/subscriptions")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Yeni Plan Seç
          </button>
        )}
      </div>

      {/* Usage Statistics */}
      {usage && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Kullanım İstatistikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scan Usage */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Scan className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Aylık Tarama</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {usage.scanCount} / {usage.scanLimit === -1 ? "Sınırsız" : usage.scanLimit}
                </span>
              </div>
              {usage.scanLimit !== -1 && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${getUsageColor(usage.usagePercentage)}`}
                      style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    %{usage.usagePercentage.toFixed(1)} kullanıldı
                    {usage.isLimitExceeded && (
                      <span className="text-red-600 font-medium ml-2">• Limit aşıldı</span>
                    )}
                  </p>
                </>
              )}
            </div>

            {/* Storage Usage */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <HardDrive className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Depolama</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatStorage(usage.storageUsedBytes)} / {formatStorage(usage.storageLimitBytes)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min((usage.storageUsedBytes / usage.storageLimitBytes) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600">
                %{((usage.storageUsedBytes / usage.storageLimitBytes) * 100).toFixed(1)} kullanıldı
              </p>
            </div>
          </div>

          {usage.apiCallCount > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  API Çağrı Sayısı: <strong>{usage.apiCallCount}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Aboneliği İptal Et</h3>
              <button onClick={() => setShowCancelModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Aboneliğinizi iptal etmek istediğinizden emin misiniz? Abonelik mevcut dönem sonuna
              kadar aktif kalacak.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İptal Nedeni (Opsiyonel)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="İptal nedeninizi belirtmek ister misiniz?"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    İptal Ediliyor...
                  </span>
                ) : (
                  "Aboneliği İptal Et"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CurrentSubscriptionPage() {
  return (
    <ProtectedRoute>
      <CurrentSubscriptionPageContent />
    </ProtectedRoute>
  );
}

