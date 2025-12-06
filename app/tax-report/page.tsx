"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, FileText, Download, Calendar } from "lucide-react";
import { analyticsApi } from "@/lib/analytics-api";
import { reportApi } from "@/lib/report-api";
import { formatCurrency } from "@/lib/utils";
import type { TaxReportDto } from "@/types/analytics";
import { ReportType } from "@/types/report";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function TaxReportPageContent() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [report, setReport] = useState<TaxReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [year, month]);

  async function loadReport() {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getTaxReport(year, month);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Vergi raporu yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(format: "pdf" | "excel" | "csv") {
    try {
      setGenerating(format);
      setError(null);

      await reportApi.downloadReport(
        {
          type: ReportType.TaxReport,
          year,
          month,
        },
        format
      );
    } catch (err: any) {
      setError(err.message || "Rapor indirilemedi");
    } finally {
      setGenerating(null);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vergi Raporu</h1>
            <p className="text-gray-600">KDV ve ÖTV detayları ile vergi özeti</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={month || ""}
                onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Yıl</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1, 1).toLocaleDateString("tr-TR", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload("pdf")}
                disabled={generating !== null}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {generating === "pdf" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownload("excel")}
                disabled={generating !== null}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {generating === "excel" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </>
                )}
              </button>
            </div>
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

      {/* Report Content */}
      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Toplam Tutar</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(report.totalAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Toplam Vergi</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(report.totalTaxAmount)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">KDV</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(report.kdvAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">ÖTV</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(report.otvAmount)}</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Kategori Bazlı Vergi Detayları</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vergi Oranı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vergi Tutarı
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.breakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Kategori {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        %{item.taxRate.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.taxAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TaxReportPage() {
  return (
    <ProtectedRoute>
      <TaxReportPageContent />
    </ProtectedRoute>
  );
}

