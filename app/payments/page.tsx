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
  RefreshCw,
  DollarSign,
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
  const [refunding, setRefunding] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");

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

  async function handleRefund(paymentId: string) {
    try {
      setRefunding(paymentId);
      setError(null);

      const amount = parseFloat(refundAmount);
      if (isNaN(amount) || amount <= 0) {
        setError("Geçerli bir tutar giriniz");
        return;
      }

      const result = await paymentApi.createRefund(paymentId, {
        amount: amount,
        reason: refundReason || undefined,
      });

      if (result.isSuccess) {
        setShowRefundModal(null);
        setRefundAmount("");
        setRefundReason("");
        await loadPayments(); // Refresh payment list
        // Show success message (you can add a toast notification here)
      } else {
        setError(result.errorMessage || "İade işlemi başarısız oldu");
      }
    } catch (err: any) {
      setError(err.message || "İade işlemi sırasında bir hata oluştu");
    } finally {
      setRefunding(null);
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === PaymentStatus.Completed && (
                        <button
                          onClick={() => {
                            setShowRefundModal(payment.id);
                            setRefundAmount(payment.amount.toString());
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          İade Et
                        </button>
                      )}
                      {payment.status === PaymentStatus.Failed && payment.errorMessage && (
                        <div className="text-xs text-red-600 max-w-xs">
                          {payment.errorMessage}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">İade İşlemi</h3>
              <button
                onClick={() => {
                  setShowRefundModal(null);
                  setRefundAmount("");
                  setRefundReason("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İade Tutarı
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İade Nedeni (Opsiyonel)
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="İade nedeninizi belirtiniz..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowRefundModal(null);
                  setRefundAmount("");
                  setRefundReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleRefund(showRefundModal)}
                disabled={refunding === showRefundModal}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refunding === showRefundModal ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    İşleniyor...
                  </span>
                ) : (
                  "İade Et"
                )}
              </button>
            </div>
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

