"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { paymentApi } from "@/lib/payment-api";
import { subscriptionsApi } from "@/lib/subscription-api";
import { PaymentStatus } from "@/types/payment";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function PaymentCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      const paymentId = searchParams.get("paymentId");
      const statusParam = searchParams.get("status");

      if (!paymentId) {
        setStatus("error");
        setMessage("Ödeme bilgisi bulunamadı");
        return;
      }

      // Get payment status
      const paymentStatus = await paymentApi.getPaymentStatus(paymentId);

      if (paymentStatus.status === PaymentStatus.Completed) {
        setStatus("success");
        setMessage("Ödeme başarıyla tamamlandı!");

        // Reload subscription data
        await subscriptionsApi.getCurrent().catch(() => {});

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/subscriptions/current?success=true&payment=completed");
        }, 2000);
      } else if (paymentStatus.status === PaymentStatus.Failed) {
        setStatus("error");
        setMessage(paymentStatus.errorMessage || "Ödeme başarısız oldu");
      } else {
        setStatus("loading");
        setMessage("Ödeme işleniyor...");
      }
    } catch (error: any) {
      console.error("Payment callback error:", error);
      setStatus("error");
      setMessage(error.message || "Ödeme durumu kontrol edilemedi");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme İşleniyor</h2>
            <p className="text-gray-600">{message || "Lütfen bekleyin..."}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Yönlendiriliyorsunuz...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarısız</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push("/subscriptions")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Plan Seçimine Dön
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <ProtectedRoute>
      <PaymentCallbackPageContent />
    </ProtectedRoute>
  );
}

