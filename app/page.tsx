"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Receipt, Scan, TrendingUp, Shield, Zap, CheckCircle } from "lucide-react";
import { authStorage } from "@/lib/auth-storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Eğer kullanıcı giriş yapmışsa, dashboard'a yönlendir
    const token = authStorage.getAccessToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">AI Destekli Teknoloji</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Fişlerinizi Akıllıca
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Yönetin</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Google Gemini AI ile fişlerinizi otomatik olarak tarayın, analiz edin ve
            harcamalarınızı kolayca takip edin. Finansal kontrol artık çok daha kolay!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Ücretsiz Başlayın
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
            >
              Giriş Yapın
            </Link>
          </div>
        </div>

        {/* Hero Image/Animation */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <Scan className="h-12 w-12 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Fiş Tara</h3>
                <p className="text-sm text-gray-600">Fotoğrafını çek, AI okusun</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <TrendingUp className="h-12 w-12 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Analiz Et</h3>
                <p className="text-sm text-gray-600">Harcamalarını görselleştir</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <Shield className="h-12 w-12 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Güvende Kal</h3>
                <p className="text-sm text-gray-600">Verileriniz şifreli ve güvenli</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden SmartReceipt?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Finansal hayatınızı kolaylaştıran güçlü özellikler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🤖",
                title: "AI Destekli Okuma",
                description: "Google Gemini AI ile fişlerinizi otomatik olarak tarayın ve verileri çıkarın"
              },
              {
                icon: "📊",
                title: "Detaylı Raporlama",
                description: "Harcamalarınızı kategorilere ayırın ve detaylı istatistikler görün"
              },
              {
                icon: "⚡",
                title: "Hızlı ve Kolay",
                description: "Saniyeler içinde fişlerinizi yükleyin ve işleyin"
              },
              {
                icon: "🔒",
                title: "Güvenli Saklama",
                description: "Tüm verileriniz şifrelenmiş ve güvenli bir şekilde saklanır"
              },
              {
                icon: "📱",
                title: "Her Cihazda",
                description: "Responsive tasarım ile her cihazdan erişim sağlayın"
              },
              {
                icon: "🎯",
                title: "Akıllı Kategorileme",
                description: "AI ürünleri otomatik olarak kategorilere ayırır"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Hemen Başlayın, Ücretsiz!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Finansal kontrolü elinize alın. Hesap oluşturmak sadece birkaç saniye.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Ücretsiz Hesap Oluştur</span>
            <CheckCircle className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Receipt className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">SmartReceipt</span>
          </div>
          <p className="text-sm">
            © 2025 SmartReceipt. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
