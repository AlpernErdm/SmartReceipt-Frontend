import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { IyzicoScript } from "@/components/IyzicoScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartReceipt - AI Destekli Fiş Takibi",
  description: "Fişlerinizi AI ile otomatik okuyun, harcamalarınızı kolayca takip edin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <IyzicoScript />
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}


