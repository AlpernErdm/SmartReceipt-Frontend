"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import { Receipt, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/Auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      
      authStorage.setAccessToken(accessToken);
      authStorage.setRefreshToken(refreshToken);
      authStorage.setUser(user);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="flex items-center space-x-3 mb-12 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-6 w-6" />
            <span className="text-sm font-medium">Ana Sayfaya Dön</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-8">
            <Receipt className="h-12 w-12" />
            <span className="text-4xl font-bold">SmartReceipt</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Tekrar<br />Hoş Geldiniz! 👋
          </h1>
          
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Fişlerinizi yönetmeye devam edin. AI ile harcamalarınızı
            takip etmek hiç bu kadar kolay olmamıştı.
          </p>

          <div className="space-y-4">
            {[
              "AI destekli otomatik fiş okuma",
              "Detaylı harcama raporları",
              "Güvenli veri saklama"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center justify-center space-x-2 text-blue-600 mb-8">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Ana Sayfa</span>
            </Link>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Receipt className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SmartReceipt</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="mt-2 text-sm text-gray-600">
              Hesabınıza giriş yapın ve fişlerinizi yönetmeye başlayın
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">veya</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Hemen kayıt olun
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
