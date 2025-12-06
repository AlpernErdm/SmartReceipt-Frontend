"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Calendar,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { paymentApi } from "@/lib/payment-api";
import { subscriptionsApi } from "@/lib/subscription-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentHistoryDto } from "@/types/payment";
import { PaymentStatus, PaymentProvider, Currency } from "@/types/payment";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function PaymentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<PaymentHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentApi.getPaymentHistory();
      setPayments(data);
    } catch (err: any) {
      setError(err.message || "Ödeme geçmişi yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: PaymentStatus) {
    switch (status) {
      case PaymentStatus.Completed:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tamamlandı
          </span>
        );
      case PaymentStatus.Pending:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
            Beklemede
          </span>
        );
      case PaymentStatus.Processing:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            İşleniyor
          </span>
        );
      case PaymentStatus.Failed:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            <XCircle className="h-3 w-3 mr-1" />
            Başarısız
          </span>
        );
      case PaymentStatus.Refunded:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            İade Edildi
          </span>
        );
      case PaymentStatus.PartiallyRefunded:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
            Kısmi İade
          </span>
        );
      case PaymentStatus.Cancelled:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            İptal Edildi
          </span>
        );
    }
  }

  function getProviderName(provider: PaymentProvider): string {
    switch (provider) {
      case PaymentProvider.Iyzico:
        return "Iyzico";
      case PaymentProvider.Stripe:
        return "Stripe";
      case PaymentProvider.PayPal:
        return "PayPal";
    }
  }

  function getCurrencySymbol(currency: Currency): string {
    switch (currency) {
      case Currency.TRY:
        return "₺";
      case Currency.USD:
        return "$";
      case Currency.EUR:
        return "€";
      case Currency.GBP:
        return "£";
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Geçmişi</h1>
            <p className="text-gray-600">Tüm ödemelerinizin geçmişi ve durumu</p>
          </div>
          <button
            onClick={() => router.push("/subscriptions")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Yeni Ödeme
          </button>
        </div>
      </div>

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

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ödeme Geçmişi Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Henüz hiç ödeme yapılmamış.</p>
          <button
            onClick={() => router.push("/subscriptions")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Plan Seç ve Ödeme Yap
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Yöntemi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem Tarihi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getCurrencySymbol(payment.currency)}
                      {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getProviderName(payment.provider)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.paidAt ? formatDate(payment.paidAt) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsPageContent />
    </ProtectedRoute>
  );
}

