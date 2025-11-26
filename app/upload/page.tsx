"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { receiptsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

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
    } catch (err: any) {
      setError(err.message || "Fiş yüklenirken bir hata oluştu");
      setPreview(null);
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Fiş Yükle
        </h1>
        <p className="text-gray-600">
          Fiş fotoğrafınızı yükleyin, AI otomatik olarak okusun
        </p>
      </div>

      {!result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div
            {...getRootProps()}
            className={`p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "bg-primary/10 border-primary"
                : "hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Fiş işleniyor...
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    AI fişinizi okuyor, lütfen bekleyin
                  </p>
                </div>
              </div>
            ) : preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <p className="text-sm text-gray-600">
                  Fiş yükleniyor...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {isDragActive
                      ? "Dosyayı buraya bırakın"
                      : "Fiş fotoğrafını sürükleyin veya tıklayın"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    JPG, PNG veya WebP (Maksimum 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Hata</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={reset}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Fiş başarıyla kaydedildi!
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  AI fişinizi otomatik olarak okudu ve kaydetti
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Fiş Detayları
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mağaza</p>
                  <p className="font-semibold text-gray-900">{result.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tarih</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(result.receiptDate).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Toplam Tutar</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(result.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">KDV</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(result.taxAmount)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Ürünler ({result.items.length})</p>
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {result.items.map((item, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => router.push(`/receipts/${result.id}`)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Detayları Gör
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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


