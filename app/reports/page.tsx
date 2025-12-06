"use client";

import { useState } from "react";
import { Loader2, AlertCircle, FileText, Download, CheckCircle } from "lucide-react";
import { reportApi } from "@/lib/report-api";
import { formatDateShort } from "@/lib/utils";
import { ReportType } from "@/types/report";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function ReportsPageContent() {
  const [reportType, setReportType] = useState<ReportType>(ReportType.Receipts);
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reportTypes = [
    { value: ReportType.Receipts, label: "Fiş Raporu" },
    { value: ReportType.CategoryAnalysis, label: "Kategori Analizi" },
    { value: ReportType.TaxReport, label: "Vergi Raporu" },
    { value: ReportType.TrendAnalysis, label: "Trend Analizi" },
    { value: ReportType.StoreAnalysis, label: "Mağaza Analizi" },
    { value: ReportType.BudgetReport, label: "Bütçe Raporu" },
  ];

  async function handleGenerateReport(format: "pdf" | "excel" | "csv") {
    try {
      setGenerating(format);
      setError(null);
      setSuccess(null);

      const request: any = {
        type: reportType,
      };

      // Add date range for most report types
      if (
        reportType !== ReportType.TaxReport &&
        reportType !== ReportType.BudgetReport
      ) {
        request.fromDate = fromDate;
        request.toDate = toDate;
      }

      // Add year/month for tax report
      if (reportType === ReportType.TaxReport) {
        request.year = year;
        if (month) {
          request.month = month;
        }
      }

      await reportApi.downloadReport(request, format);
      setSuccess(`${format.toUpperCase()} raporu başarıyla indirildi!`);
    } catch (err: any) {
      setError(err.message || "Rapor oluşturulamadı");
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="flex items-center mb-4">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rapor Oluştur</h1>
            <p className="text-gray-600">Harcamalarınız hakkında detaylı raporlar oluşturun</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <p className="text-green-700 font-medium">{success}</p>
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

      {/* Report Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rapor Tipi
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(Number(e.target.value) as ReportType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range (for most reports) */}
        {reportType !== ReportType.TaxReport && reportType !== ReportType.BudgetReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Year/Month (for tax report) */}
        {reportType === ReportType.TaxReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2020}
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ay (Opsiyonel)
              </label>
              <select
                value={month || ""}
                onChange={(e) =>
                  setMonth(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tüm Yıl</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1, 1).toLocaleDateString("tr-TR", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Generate Buttons */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Format Seçin</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleGenerateReport("pdf")}
              disabled={generating !== null}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating === "pdf" ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  PDF İndir
                </>
              )}
            </button>
            <button
              onClick={() => handleGenerateReport("excel")}
              disabled={generating !== null}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating === "excel" ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Excel İndir
                </>
              )}
            </button>
            <button
              onClick={() => handleGenerateReport("csv")}
              disabled={generating !== null}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating === "csv" ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  CSV İndir
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Bilgi</h3>
            <p className="text-sm text-blue-700">
              Raporlar seçtiğiniz format ve tarih aralığına göre oluşturulur. Raporlar otomatik
              olarak indirilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsPageContent />
    </ProtectedRoute>
  );
}

