"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Store,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { analyticsApi } from "@/lib/analytics-api";
import { formatCurrency } from "@/lib/utils";
import type {
  CategoryAnalyticsDto,
  TrendAnalyticsDto,
  StoreAnalyticsDto,
} from "@/types/analytics";
import { TrendPeriod } from "@/types/analytics";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
];

function AnalyticsPageContent() {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryAnalyticsDto | null>(null);
  const [trendData, setTrendData] = useState<TrendAnalyticsDto | null>(null);
  const [storeData, setStoreData] = useState<StoreAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>(TrendPeriod.Monthly);
  const [dateRange, setDateRange] = useState<{
    fromDate: string | null;
    toDate: string | null;
  }>({
    fromDate: null, // Default: no date filter
    toDate: null,
  });

  useEffect(() => {
    loadAnalytics();
  }, [trendPeriod, dateRange]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);

      // Use Promise.allSettled to handle partial failures gracefully
      const [categoriesResult, trendsResult, storesResult] = await Promise.allSettled([
        analyticsApi.getCategoryAnalytics(
          dateRange.fromDate || undefined,
          dateRange.toDate || undefined
        ),
        analyticsApi.getTrendAnalytics(trendPeriod),
        analyticsApi.getStoreAnalytics(
          dateRange.fromDate || undefined,
          dateRange.toDate || undefined,
          10
        ),
      ]);

      // Handle category analytics
      if (categoriesResult.status === "fulfilled") {
        setCategoryData(categoriesResult.value);
      } else {
        console.error("Category analytics error:", categoriesResult.reason);
        // Don't set error for individual failures, just log
      }

      // Handle trend analytics
      if (trendsResult.status === "fulfilled") {
        setTrendData(trendsResult.value);
      } else {
        console.error("Trend analytics error:", trendsResult.reason);
        // Show specific error for trends if needed
        if (trendsResult.reason?.response?.status === 500) {
          setError("Trend analizi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.");
        }
      }

      // Handle store analytics
      if (storesResult.status === "fulfilled") {
        setStoreData(storesResult.value);
      } else {
        console.error("Store analytics error:", storesResult.reason);
        // Don't set error for individual failures, just log
      }

      // If all failed, show general error
      if (
        categoriesResult.status === "rejected" &&
        trendsResult.status === "rejected" &&
        storesResult.status === "rejected"
      ) {
        setError("Analitik veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      }
    } catch (err: any) {
      console.error("Analytics load error:", err);
      setError(err.message || "Analitik veriler yüklenemedi");
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analitik Dashboard</h1>
            <p className="text-gray-600">Harcamalarınızın detaylı analizi ve istatistikleri</p>
          </div>
          <button
            onClick={() => router.push("/reports")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Rapor Oluştur
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Başlangıç:</label>
            <input
              type="date"
              value={dateRange.fromDate || ""}
              onChange={(e) =>
                setDateRange({ ...dateRange, fromDate: e.target.value || null })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Bitiş:</label>
            <input
              type="date"
              value={dateRange.toDate || ""}
              onChange={(e) =>
                setDateRange({ ...dateRange, toDate: e.target.value || null })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {(dateRange.fromDate || dateRange.toDate) && (
            <button
              onClick={() => setDateRange({ fromDate: null, toDate: null })}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Filtreyi Temizle
            </button>
          )}
          <div className="text-xs text-gray-500">
            {!dateRange.fromDate && !dateRange.toDate
              ? "Tüm veriler gösteriliyor"
              : "Filtrelenmiş veriler"}
          </div>
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

      {/* Category Analytics */}
      {categoryData ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Kategori Bazlı Harcama</h2>
            </div>
            <div className="text-sm text-gray-600">
              Toplam: {formatCurrency(categoryData.totalAmount)} • {categoryData.totalReceipts} fiş
            </div>
          </div>

          {categoryData.categorySpendings && categoryData.categorySpendings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData.categorySpendings}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoryName, percentage }) =>
                        `${categoryName}: %${percentage.toFixed(1)}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.categorySpendings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categoryData.categorySpendings
                  .sort((a, b) => b.amount - a.amount)
                  .map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center flex-1">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.categoryName}</p>
                          <p className="text-sm text-gray-600">
                            {item.receiptCount} fiş • %{item.percentage.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Henüz kategori bazlı harcama verisi bulunmuyor</p>
              <p className="text-sm text-gray-500">
                Fiş yükledikten sonra burada kategorilere göre harcama analizi görünecektir.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategori Analizi Yüklenemedi</h3>
          <p className="text-gray-600 mb-4">
            Kategori analizi verileri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.
          </p>
          <button
            onClick={loadAnalytics}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Trend Analytics */}
      {trendData ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Trend Analizi</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTrendPeriod(TrendPeriod.Monthly)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  trendPeriod === TrendPeriod.Monthly
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Aylık
              </button>
              <button
                onClick={() => setTrendPeriod(TrendPeriod.Yearly)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  trendPeriod === TrendPeriod.Yearly
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Yıllık
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Toplam Harcama</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(trendData.totalAmount)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ortalama</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(trendData.averageAmount)}
              </p>
            </div>
            {trendData.growthPercentage != null && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Büyüme</p>
                <p
                  className={`text-2xl font-bold ${
                    trendData.growthPercentage >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trendData.growthPercentage >= 0 ? "+" : ""}
                  {trendData.growthPercentage.toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0088FE"
                strokeWidth={2}
                name="Harcama"
              />
              <Line
                type="monotone"
                dataKey="receiptCount"
                stroke="#00C49F"
                strokeWidth={2}
                name="Fiş Sayısı"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Trend Analizi Yüklenemedi</h3>
          <p className="text-gray-600 mb-4">
            Trend analizi verileri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.
          </p>
          <button
            onClick={loadAnalytics}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Store Analytics */}
      {storeData ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Store className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">En Çok Harcama Yapılan Mağazalar</h2>
            </div>
            <div className="text-sm text-gray-600">Toplam {storeData.totalStores} mağaza</div>
          </div>

          {storeData.topStores && storeData.topStores.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={storeData.topStores
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    .slice(0, 10)}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="storeName" type="category" width={150} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="totalAmount" fill="#8884d8" name="Toplam Harcama" />
                </BarChart>
              </ResponsiveContainer>

              {/* Store List */}
              <div className="mt-6 space-y-2">
                {storeData.topStores
                  .sort((a, b) => b.totalAmount - a.totalAmount)
                  .slice(0, 10)
                  .map((store, index) => (
                <div
                  key={store.storeName}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{store.storeName}</p>
                      <p className="text-sm text-gray-600">
                        {store.receiptCount} fiş • Son alışveriş:{" "}
                        {new Date(store.lastPurchaseDate).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(store.totalAmount)}</p>
                </div>
              ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Henüz mağaza bazlı harcama verisi bulunmuyor</p>
              <p className="text-sm text-gray-500">
                Fiş yükledikten sonra burada en çok harcama yaptığınız mağazalar görünecektir.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mağaza Analizi Yüklenemedi</h3>
          <p className="text-gray-600 mb-4">
            Mağaza analizi verileri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.
          </p>
          <button
            onClick={loadAnalytics}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}

