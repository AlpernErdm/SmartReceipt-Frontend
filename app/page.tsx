"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Zap, Shield, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { authStorage } from "@/lib/auth-storage";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (for conditional nav display)
    const token = authStorage.getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartReceipt
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Dashboard&apos;a Git
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            🚀 AI Destekli Fiş Yönetimi
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fişlerinizi <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI ile Otomatik</span> Okuyun
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Harcamalarınızı kolayca takip edin, vergi raporlarınızı anında oluşturun. 
            Muhasebe işlerinizi sadeleştirin, zamandan tasarruf edin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all inline-flex items-center justify-center"
              >
                Dashboard&apos;a Git
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all inline-flex items-center justify-center"
                >
                  Ücretsiz Deneyin
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-blue-600 transition-all">
                  Demo İzle
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✓ Kredi kartı gerektirmez  ✓ 7 gün ücretsiz deneme  ✓ İstediğiniz zaman iptal edin
          </p>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Neden SmartReceipt?</h2>
            <p className="text-xl text-gray-600">Modern iş dünyası için tasarlandı</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI ile Hızlı Okuma</h3>
              <p className="text-gray-700">
                Fişinizin fotoğrafını çekin, AI saniyeler içinde tüm bilgileri otomatik okusun. 
                Manuel veri girişine elveda!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Akıllı Analiz</h3>
              <p className="text-gray-700">
                Harcama trendlerinizi görün, bütçenizi takip edin, tasarruf fırsatlarını keşfedin. 
                Veriye dayalı kararlar alın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Vergi Uyumlu</h3>
              <p className="text-gray-700">
                Vergi raporlarınızı anında oluşturun. Muhasebeci dostudur, yasal gerekliliklere tam uyumlu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Muhasebe İşlerinizi Sadeleştirin
              </h2>
              <div className="space-y-4">
                {[
                  "Fişleri fotoğrafla, AI otomatik okusun",
                  "Harcamaları kategorilere ayır",
                  "Aylık/yıllık raporlar oluştur",
                  "Vergi beyannamesi için hazır veriler",
                  "Bütçe takibi ve uyarılar",
                  "Mobil ve web&apos;den erişim"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Feature Screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Basit ve Şeffaf Fiyatlandırma</h2>
            <p className="text-xl text-gray-600">İhtiyacınıza uygun planı seçin</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-600 transition-all flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Bireyler için</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₺49</span>
                <span className="text-gray-600">/ay</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  50 fiş/ay
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  6 ay geçmiş
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  Temel analitik
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors mt-auto"
              >
                Başlayın
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-2xl transform scale-105 relative flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                En Popüler
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-blue-100 mb-6">Profesyoneller için</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₺99</span>
                <span className="text-blue-100">/ay</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  500 fiş/ay
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  Sınırsız geçmiş
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  Gelişmiş analitik
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0" />
                  Öncelikli destek
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full px-6 py-3 bg-white text-blue-600 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors mt-auto"
              >
                Ücretsiz Dene
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-600 transition-all flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-6">Şirketler için</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₺299</span>
                <span className="text-gray-600">/ay</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  Sınırsız fiş
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  API erişimi
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  Ekip yönetimi
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  Özel onboarding
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors mt-auto"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Harcama Yönetiminizi Bugün Basitleştirin
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            7 gün ücretsiz deneyin. Kredi kartı gerektirmez. İstediğiniz zaman iptal edin.
          </p>
          <Link
            href={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-xl transition-all"
          >
            {isAuthenticated ? "Dashboard'a Git" : "Ücretsiz Başlayın"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SmartReceipt</span>
              </div>
              <p className="text-sm text-gray-400">
                AI destekli fiş takibi ve harcama yönetimi platformu
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Özellikler</Link></li>
                <li><Link href="#" className="hover:text-white">Fiyatlandırma</Link></li>
                <li><Link href="#" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Gizlilik</Link></li>
                <li><Link href="#" className="hover:text-white">Kullanım Koşulları</Link></li>
                <li><Link href="#" className="hover:text-white">KVKK</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 SmartReceipt. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
