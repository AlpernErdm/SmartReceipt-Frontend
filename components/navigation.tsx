"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Receipt,
  Upload,
  List,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Crown,
  BarChart3,
  FileText,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authStorage } from "@/lib/auth-storage";
import { useState, useEffect } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Fiş Yükle",
    href: "/upload",
    icon: Upload,
  },
  {
    label: "Fişlerim",
    href: "/receipts",
    icon: List,
  },
  {
    label: "Analitik",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Abonelik",
    href: "/subscriptions/current",
    icon: Crown,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Kullanıcı bilgisini kontrol et
  const checkAuth = () => {
    const token = authStorage.getAccessToken();
    const savedUser = authStorage.getUser();
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // İlk yüklemede kontrol et
    checkAuth();
  }, []);

  useEffect(() => {
    // Pathname her değiştiğinde kontrol et (sayfa değişikliklerinde)
    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    authStorage.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  // Login, Register ve Ana sayfada navigation'ı gösterme
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Receipt className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">SmartReceipt</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/payments"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Ödemeler</span>
                      </Link>
                      
                      <Link
                        href="/reports"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Raporlar</span>
                      </Link>
                      
                      <div className="border-t border-gray-200 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


