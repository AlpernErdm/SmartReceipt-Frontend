"use client";

import { useState } from "react";
import { CreditCard, Lock, Loader2, AlertCircle, X } from "lucide-react";
import { tokenizeCard, formatCardNumber, formatCVV, formatExpiryDate, type CardData } from "@/lib/iyzico-tokenization";
import type { PaymentProvider, Currency } from "@/types/payment";

interface PaymentFormProps {
  subscriptionId: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  description: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function PaymentForm({
  subscriptionId,
  amount,
  currency,
  provider,
  description,
  onSuccess,
  onError,
  onCancel,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<CardData>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardHolderName: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CardData, string>>>({});

  function validateForm(): boolean {
    const newErrors: Partial<Record<keyof CardData, string>> = {};

    // Card number validation
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = "Kart numarası geçersiz";
    }

    // Expiry month validation
    const month = parseInt(formData.expiryMonth);
    if (!formData.expiryMonth || month < 1 || month > 12) {
      newErrors.expiryMonth = "Geçerli bir ay giriniz (01-12)";
    }

    // Expiry year validation
    const currentYear = new Date().getFullYear() % 100;
    const year = parseInt(formData.expiryYear);
    if (!formData.expiryYear || year < currentYear || year > 99) {
      newErrors.expiryYear = "Geçerli bir yıl giriniz";
    }

    // CVV validation
    if (formData.cvv.length !== 3) {
      newErrors.cvv = "CVV 3 haneli olmalıdır";
    }

    // Card holder name validation
    if (formData.cardHolderName.trim().length < 3) {
      newErrors.cardHolderName = "Kart üzerindeki isim en az 3 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Tokenize card
      const { cardToken, cardUserKey } = await tokenizeCard({
        ...formData,
        expiryMonth: formData.expiryMonth.padStart(2, "0"),
        expiryYear: formData.expiryYear.length === 2 ? formData.expiryYear : `20${formData.expiryYear}`,
      });

      // Import payment API
      const { paymentApi } = await import("@/lib/payment-api");

      // Create payment with token
      const payment = await paymentApi.createPayment({
        subscriptionId,
        amount,
        currency,
        provider,
        description,
        cardToken,
        cardUserKey,
        callbackUrl: `${window.location.origin}/payment/callback`,
      });

      if (!payment.isSuccess) {
        throw new Error(payment.errorMessage || "Ödeme işlemi başarısız oldu");
      }

      // Check if there's a redirect URL (3D Secure)
      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }

      // Check payment status
      const { PaymentStatus } = await import("@/types/payment");
      
      if (payment.status === PaymentStatus.Completed) {
        // Payment completed immediately
        onSuccess();
      } else if (payment.status === PaymentStatus.Pending && payment.paymentId) {
        // Payment is pending, show message and call success (polling will happen on callback page)
        onSuccess();
      } else {
        // Other status
        onSuccess();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      onError(error.message || "Ödeme işlemi başarısız oldu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Lock className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Güvenli Ödeme</h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Numarası
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setFormData({ ...formData, cardNumber: formatted });
              }}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ay</label>
            <input
              type="text"
              value={formData.expiryMonth}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").substring(0, 2);
                setFormData({ ...formData, expiryMonth: value });
              }}
              placeholder="MM"
              maxLength={2}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.expiryMonth ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.expiryMonth && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
            <input
              type="text"
              value={formData.expiryYear}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").substring(0, 2);
                setFormData({ ...formData, expiryYear: value });
              }}
              placeholder="YY"
              maxLength={2}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.expiryYear ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.expiryYear && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => {
                const value = formatCVV(e.target.value);
                setFormData({ ...formData, cvv: value });
              }}
              placeholder="123"
              maxLength={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cvv ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Card Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Üzerindeki İsim
          </label>
          <input
            type="text"
            value={formData.cardHolderName}
            onChange={(e) =>
              setFormData({ ...formData, cardHolderName: e.target.value.toUpperCase() })
            }
            placeholder="AD SOYAD"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cardHolderName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cardHolderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardHolderName}</p>
          )}
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Güvenli Ödeme</p>
              <p className="text-xs text-blue-700 mt-1">
                Kart bilgileriniz iyzico tarafından güvenli bir şekilde işlenir. Kart bilgileriniz
                sunucularımızda saklanmaz.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                İşleniyor...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Ödeme Yap
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

