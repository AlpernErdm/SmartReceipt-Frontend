# SmartReceipt Frontend

AI destekli fiş okuma ve finans takip sistemi - Web Arayüzü

## 🚀 Teknolojiler

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide Icons** - Modern icon library
- **React Dropzone** - Drag & drop dosya yükleme

## ✨ Özellikler

- 🔐 **Authentication** - JWT token ile güvenli giriş/kayıt
- 🔄 **Auto Token Refresh** - Otomatik token yenileme
- 📸 **Fiş Tarama** - Drag & drop ile fiş fotoğrafı yükleme
- 🤖 **AI Analizi** - Otomatik fiş okuma ve veri çıkarma
- 📊 **Dashboard** - Harcama özeti ve istatistikler
- 🔍 **Filtreleme** - Tarih ve mağaza adına göre filtreleme
- 📱 **Responsive** - Mobil uyumlu tasarım
- 🎨 **Modern UI** - Tailwind CSS ile şık arayüz
- 🛡️ **Protected Routes** - Yetkilendirme gerektiren sayfalar

## 📁 Proje Yapısı

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── login/             # Giriş sayfası
│   ├── register/          # Kayıt sayfası
│   ├── dashboard/         # Dashboard (Protected)
│   ├── upload/            # Fiş yükleme (Protected)
│   └── receipts/          # Fiş listeleme (Protected)
├── components/            # React bileşenleri
│   ├── navigation.tsx     # Navigasyon menüsü
│   └── ProtectedRoute.tsx # Auth guard component
├── lib/                   # Yardımcı fonksiyonlar
│   ├── api-client.ts      # API istekleri + JWT interceptor
│   ├── auth-storage.ts    # LocalStorage auth yönetimi
│   └── utils.ts           # Utility fonksiyonlar
├── types/                 # TypeScript tipleri
│   └── receipt.ts         # Fiş veri modelleri
└── public/                # Statik dosyalar
```

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
cd frontend
npm install
```

2. **Ortam değişkenlerini ayarlayın:**

`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

Uygulama şu adreste çalışacak: `http://localhost:3000`

## 📦 Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production başlat
npm start

# Linter
npm run lint
```

## 🎨 Sayfalar

### Landing Page (`/`) 🔓
- Proje tanıtımı ve özellikler
- Giriş yap / Kayıt ol butonları
- Modern gradient tasarım

### Login (`/login`) 🔓
- Split-screen tasarım
- JWT token ile giriş
- Hata yönetimi

### Register (`/register`) 🔓
- Kullanıcı kaydı formu
- Form validasyonu
- Otomatik giriş

### Dashboard (`/dashboard`) 🔒
- Toplam fiş sayısı
- Toplam harcama tutarı
- Ortalama fiş tutarı
- Son yüklenen fişler

### Fiş Yükle (`/upload`) 🔒
- Drag & drop dosya yükleme
- Görsel önizleme
- AI ile otomatik işleme
- Sonuç ekranı

### Fişlerim (`/receipts`) 🔒
- Tüm fişleri listeleme
- Tarih ve mağaza adı ile filtreleme
- Sayfalama
- Kategori bazlı gruplandırma

### Fiş Detayı (`/receipts/[id]`) 🔒
- Fiş bilgileri
- Ürün listesi
- Kategori bazlı toplam
- KDV detayları

**Not:** 🔒 işaretli sayfalar authentication gerektirir.

## 🔧 Yapılandırma

### API Bağlantısı
`lib/api-client.ts` dosyasında API base URL'i ayarlayın:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

### JWT Authentication
API client otomatik olarak her istekte JWT token ekler:
```typescript
// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Auto token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
  }
);
```

### Tailwind CSS
`tailwind.config.ts` dosyasında tema renklerini özelleştirebilirsiniz.

## 📱 Responsive Tasarım

Uygulama mobil, tablet ve desktop cihazlarda mükemmel çalışır:
- Mobile-first yaklaşım
- Flexbox ve Grid layout
- Responsive navigation
- Touch-friendly UI

## 🚀 Deployment

### Vercel (Önerilen)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t smartreceipt-frontend .
docker run -p 3000:3000 smartreceipt-frontend
```

### Static Export
```bash
npm run build
npm run export
```

## 🎯 Geliştirme Kılavuzu

### Yeni Sayfa Ekleme
1. `app/` klasörüne yeni klasör oluşturun
2. İçine `page.tsx` dosyası ekleyin
3. Navigation'a link ekleyin

### Yeni Component Ekleme
1. `components/` klasörüne yeni dosya oluşturun
2. Export edin ve istediğiniz sayfada kullanın

### API İsteği Ekleme
`lib/api-client.ts` dosyasına yeni method ekleyin:
```typescript
export const receiptsApi = {
  // Mevcut methodlar...
  
  newMethod: async () => {
    const response = await apiClient.get('/endpoint');
    return response.data;
  }
};
```

## 📝 Lisans

MIT License
