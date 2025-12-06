"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle, Crown, Zap, Building2, Gift, X } from "lucide-react";
import { subscriptionsApi } from "@/lib/subscription-api";
import { formatCurrency } from "@/lib/utils";
import type { SubscriptionPlanDto } from "@/types/subscription";
import { PlanType, BillingPeriod } from "@/types/subscription";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function SubscriptionsPageContent() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(BillingPeriod.Monthly);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      setLoading(true);
      const data = await subscriptionsApi.getPlans();
      setPlans(data);
    } catch (err: any) {
      setError(err.message || "Planlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(planId: string) {
    try {
      setSubscribing(planId);
      setError(null);
      
      // Find the selected plan
      const selectedPlan = plans.find((p) => p.id === planId);
      if (!selectedPlan) {
        throw new Error("Plan bulunamadı");
      }

      // Create subscription first
      let subscription;
      try {
        subscription = await subscriptionsApi.subscribe({
          planId,
          billingPeriod,
        });
      } catch (subError: any) {
        // Check if it's a 500 error from backend
        if (subError?.response?.status === 500) {
          throw new Error(
            "Abonelik oluşturulurken bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin veya destek ekibiyle iletişime geçin."
          );
        }
        // Re-throw other errors
        throw subError;
      }

      // Try to create payment (optional - if payment API is not ready, just redirect)
      try {
        const { paymentApi } = await import("@/lib/payment-api");
        const { PaymentProvider, Currency } = await import("@/types/payment");
        
        const price = billingPeriod === BillingPeriod.Monthly 
          ? selectedPlan.monthlyPrice 
          : selectedPlan.yearlyPrice;

        const payment = await paymentApi.createPayment({
          subscriptionId: subscription.id,
          amount: price,
          currency: Currency.TRY,
          provider: PaymentProvider.Iyzico,
          description: `${selectedPlan.name} abonelik - ${billingPeriod === BillingPeriod.Monthly ? "Aylık" : "Yıllık"}`,
        });

        // If there's a redirect URL (3D Secure), redirect to it
        if (payment.redirectUrl) {
          window.location.href = payment.redirectUrl;
          return;
        }
      } catch (paymentError: any) {
        // If payment fails but subscription was created, still redirect to success page
        console.warn("Payment creation failed, but subscription was created:", paymentError);
        // Continue to success page
      }

      // Redirect to subscription page
      router.push("/subscriptions/current?success=true");
    } catch (err: any) {
      console.error("Subscribe error:", err);
      
      // Provide more specific error messages
      let errorMessage = "Abonelik oluşturulamadı";
      
      if (err?.response?.status === 500) {
        errorMessage = "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.";
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || "Geçersiz istek. Lütfen bilgilerinizi kontrol edin.";
      } else if (err?.response?.status === 404) {
        errorMessage = "Plan bulunamadı veya aktif değil.";
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubscribing(null);
    }
  }

  function getPlanIcon(planType: PlanType) {
    switch (planType) {
      case PlanType.Free:
        return <Gift className="h-8 w-8" />;
      case PlanType.Basic:
        return <Zap className="h-8 w-8" />;
      case PlanType.Pro:
        return <Crown className="h-8 w-8" />;
      case PlanType.Enterprise:
        return <Building2 className="h-8 w-8" />;
    }
  }

  function getPlanColor(planType: PlanType) {
    switch (planType) {
      case PlanType.Free:
        return "border-gray-300 bg-gray-50";
      case PlanType.Basic:
        return "border-blue-300 bg-blue-50";
      case PlanType.Pro:
        return "border-purple-300 bg-purple-50";
      case PlanType.Enterprise:
        return "border-yellow-300 bg-yellow-50";
    }
  }

  function formatStorage(mb: number): string {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(0)} GB`;
    }
    return `${mb} MB`;
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
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Abonelik Planları</h1>
        <p className="text-gray-600 mb-6">
          İhtiyacınıza uygun planı seçin ve SmartReceipt'in tüm özelliklerinden yararlanın
        </p>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${billingPeriod === BillingPeriod.Monthly ? 'text-gray-900' : 'text-gray-500'}`}>
            Aylık
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === BillingPeriod.Monthly ? BillingPeriod.Yearly : BillingPeriod.Monthly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingPeriod === BillingPeriod.Yearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingPeriod === BillingPeriod.Yearly ? 'text-gray-900' : 'text-gray-500'}`}>
            Yıllık
            <span className="ml-1 text-green-600">(2 ay ücretsiz)</span>
          </span>
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const price = billingPeriod === BillingPeriod.Monthly ? plan.monthlyPrice : plan.yearlyPrice;
          const isFree = plan.planType === PlanType.Free;
          const scanLimitText = plan.monthlyScanLimit === -1 ? "Sınırsız" : plan.monthlyScanLimit.toString();

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 flex flex-col ${getPlanColor(plan.planType)}`}
            >
              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
                  {getPlanIcon(plan.planType)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(price)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingPeriod === BillingPeriod.Monthly ? "ay" : "yıl"}
                  </span>
                </div>
                {plan.trialDays && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {plan.trialDays} gün deneme
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="flex-1 space-y-3 mb-6">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>{scanLimitText}</strong> aylık tarama
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>{formatStorage(plan.storageLimitMB)}</strong> depolama
                  </span>
                </div>
                {plan.hasApiAccess && (
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">API Erişimi</span>
                  </div>
                )}
                {plan.hasAdvancedAnalytics && (
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Gelişmiş Analitik</span>
                  </div>
                )}
                {plan.hasTeamManagement && (
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Ekip Yönetimi</span>
                  </div>
                )}
                {plan.hasPrioritySupport && (
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Öncelikli Destek</span>
                  </div>
                )}
              </div>

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id || isFree}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                  isFree
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : subscribing === plan.id
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {subscribing === plan.id ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    İşleniyor...
                  </span>
                ) : isFree ? (
                  "Mevcut Plan"
                ) : (
                  "Abone Ol"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Plan Karşılaştırması</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Özellik
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Aylık Fiyat
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                    {formatCurrency(plan.monthlyPrice)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Yıllık Fiyat
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                    {formatCurrency(plan.yearlyPrice)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Aylık Tarama
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                    {plan.monthlyScanLimit === -1 ? "Sınırsız" : plan.monthlyScanLimit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Depolama
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                    {formatStorage(plan.storageLimitMB)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  API Erişimi
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {plan.hasApiAccess ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Gelişmiş Analitik
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {plan.hasAdvancedAnalytics ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Ekip Yönetimi
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {plan.hasTeamManagement ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Öncelikli Destek
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {plan.hasPrioritySupport ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionsPageContent />
    </ProtectedRoute>
  );
}

