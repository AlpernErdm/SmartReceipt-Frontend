"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertCircle, Loader2, X, AlertTriangle, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { receiptsApi } from "@/lib/api-client";
import { subscriptionsApi } from "@/lib/subscription-api";
import { formatCurrency } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";
import type { UsageDto } from "@/types/subscription";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function UploadPageContent() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageDto | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  async function loadUsage() {
    try {
      setLoadingUsage(true);
      const data = await subscriptionsApi.getUsage().catch(() => null);
      setUsage(data);
    } catch (err) {
      console.error("Kullanım bilgisi yüklenemedi:", err);
    } finally {
      setLoadingUsage(false);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      // Check limit before upload
      if (usage && usage.scanLimit !== -1 && usage.scanCount >= usage.scanLimit) {
        setError("Aylık tarama limitinize ulaştınız. Lütfen planınızı yükseltin.");
        return;
      }

      const file = acceptedFiles[0];
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      await handleUpload(file);
    },
  });

  async function handleUpload(file: File) {
    try {
      setUploading(true);
      setError(null);
      setResult(null);

      const receipt = await receiptsApi.scanReceipt(file);
      setResult(receipt);
      
      // Reload usage after successful upload
      await loadUsage();
    } catch (err: any) {
      const errorMessage = err.message || "Fiş yüklenirken bir hata oluştu";
      setError(errorMessage);
      setPreview(null);
      
      // Check if it's a limit error
      if (errorMessage.includes("limitinize ulaştınız") || errorMessage.includes("limit")) {
        await loadUsage(); // Reload usage to show current status
      }
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setPreview(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fiş Yükle</h1>
        <p className="text-gray-600">
          Fişinizin fotoğrafını yükleyin, AI otomatik olarak okusun
        </p>
      </div>

      {/* Usage Warning */}
      {usage && usage.scanLimit !== -1 && (
        <div
          className={`rounded-lg p-4 border-l-4 ${
            usage.isLimitExceeded || usage.scanCount >= usage.scanLimit
              ? "bg-red-50 border-red-500"
              : usage.usagePercentage >= 80
              ? "bg-yellow-50 border-yellow-500"
              : "bg-blue-50 border-blue-500"
          }`}
        >
          <div className="flex items-start">
            <AlertTriangle
              className={`h-5 w-5 mr-3 mt-0.5 ${
                usage.isLimitExceeded || usage.scanCount >= usage.scanLimit
                  ? "text-red-500"
                  : usage.usagePercentage >= 80
                  ? "text-yellow-500"
                  : "text-blue-500"
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  usage.isLimitExceeded || usage.scanCount >= usage.scanLimit
                    ? "text-red-900"
                    : usage.usagePercentage >= 80
                    ? "text-yellow-900"
                    : "text-blue-900"
                }`}
              >
                {usage.isLimitExceeded || usage.scanCount >= usage.scanLimit
                  ? "Aylık tarama limitinize ulaştınız"
                  : usage.usagePercentage >= 80
                  ? "Aylık tarama limitinize yaklaşıyorsunuz"
                  : "Kullanım Durumu"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  usage.isLimitExceeded || usage.scanCount >= usage.scanLimit
                    ? "text-red-700"
                    : usage.usagePercentage >= 80
                    ? "text-yellow-700"
                    : "text-blue-700"
                }`}
              >
                {usage.scanCount} / {usage.scanLimit} tarama kullanıldı
                {usage.isLimitExceeded || usage.scanCount >= usage.scanLimit ? (
                  <span className="block mt-2">
                    Daha fazla tarama yapmak için planınızı yükseltin.
                  </span>
                ) : null}
              </p>
              {(usage.isLimitExceeded || usage.scanCount >= usage.scanLimit || usage.usagePercentage >= 80) && (
                <button
                  onClick={() => router.push("/subscriptions")}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Plan Yükselt
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!result && !uploading && (
        <div
          {...getRootProps()}
          className={`bg-white rounded-lg shadow-sm border-2 border-dashed p-12 text-center transition-all ${
            usage && usage.scanLimit !== -1 && usage.scanCount >= usage.scanLimit
              ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-50"
              : isDragActive
              ? "border-primary bg-primary/5 cursor-pointer"
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <input {...getInputProps()} disabled={usage && usage.scanLimit !== -1 && usage.scanCount >= usage.scanLimit} />
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {usage && usage.scanLimit !== -1 && usage.scanCount >= usage.scanLimit
              ? "Aylık tarama limitinize ulaştınız"
              : isDragActive
              ? "Dosyayı buraya bırakın"
              : "Dosya yüklemek için tıklayın veya sürükleyin"}
          </p>
          <p className="text-sm text-gray-600">
            PNG, JPG, JPEG veya WEBP (Maks. 10MB)
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Hata Oluştu</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {uploading && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Fiş taranıyor...
          </p>
          <p className="text-sm text-gray-600">
            AI fişinizi analiz ediyor, lütfen bekleyin
          </p>
          {preview && (
            <div className="mt-6 max-w-md mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-xl font-bold text-green-900">
                  Fiş Başarıyla Tarandı!
                </h3>
                <p className="text-green-700 mt-1">
                  Verileriniz otomatik olarak kaydedildi
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Preview Image */}
            {preview && (
              <div className="relative">
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <img
                  src={preview}
                  alt="Receipt"
                  className="w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}

            {/* Receipt Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Mağaza</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {result.storeName}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Tarih</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {new Date(result.receiptDate).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Ürünler ({result.items.length})
              </h4>
              <div className="space-y-2">
                {result.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <span>KDV</span>
                <span className="font-medium">
                  {formatCurrency(result.taxAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xl font-bold text-gray-900">
                <span>Toplam</span>
                <span>{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => router.push("/receipts")}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Fişlerime Git
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Yeni Fiş Yükle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadPageContent />
    </ProtectedRoute>
  );
}
