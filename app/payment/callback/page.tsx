"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { paymentApi } from "@/lib/payment-api";
import { subscriptionsApi } from "@/lib/subscription-api";
import { PaymentStatus } from "@/types/payment";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Log all URL parameters
    console.log("=== Payment Callback Page Loaded ===");
    console.log("Full URL:", window.location.href);
    console.log("Search params:", window.location.search);
    
    const allParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      allParams[key] = value;
    });
    console.log("All parameters:", allParams);
    
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      // İyzico checkout form'dan dönerken "token" parametresi gelir
      const token = searchParams.get("token");
      const statusParam = searchParams.get("status");

      console.log("Callback parameters:", { token, statusParam });

      if (!token) {
        console.error("No token found in URL parameters");
        setStatus("error");
        setMessage("Ödeme bilgisi bulunamadı. URL'de token parametresi yok.");
        return;
      }

      // Token is the payment ID from checkout form
      console.log("Getting payment status for token:", token);
      const paymentStatus = await paymentApi.getPaymentStatus(token);

      console.log("Payment status:", paymentStatus);

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
        
        // Try to cancel subscription if payment failed
        console.log("Payment failed, attempting to cancel subscription");
        await subscriptionsApi.cancel({ reason: "Ödeme başarısız" }).catch((err) => {
          console.log("Could not cancel subscription:", err);
        });
      } else {
        setStatus("loading");
        setMessage("Ödeme işleniyor...");
        
        // Poll payment status after 2 seconds
        setTimeout(() => {
          handleCallback();
        }, 2000);
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

function PaymentCallbackPageContent() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Yükleniyor</h2>
            <p className="text-gray-600">Lütfen bekleyin...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}

export default function PaymentCallbackPage() {
  return (
    <ProtectedRoute>
      <PaymentCallbackPageContent />
    </ProtectedRoute>
  );
}

