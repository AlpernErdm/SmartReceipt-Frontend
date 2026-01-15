import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Blog content database (production'da CMS veya markdown files olabilir)
const blogPosts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  "fis-takibi-neden-onemli": {
    title: "Fiş Takibi Neden Bu Kadar Önemli?",
    date: "15 Ocak 2026",
    readTime: "5 dk okuma",
    category: "Rehber",
    content: `
      <h2>Fiş Takibinin İşletmenize Faydaları</h2>
      <p>Fiş takibi, hem bireysel finans yönetimi hem de işletme muhasebesi için kritik öneme sahiptir. İşte fiş takibinin neden önemli olduğuna dair bazı temel nedenler:</p>
      
      <h3>1. Vergi Avantajları</h3>
      <p>İş giderlerinizi belgelemek, vergi indirimi almak için şarttır. Düzenli fiş takibi sayesinde:</p>
      <ul>
        <li>Tüm indirilebilir giderleri kayıt altına alabilirsiniz</li>
        <li>Vergi beyannamesi hazırlığı kolaşılaşır</li>
        <li>Denetim durumunda belgeleriniz hazırdır</li>
      </ul>

      <h3>2. Harcama Kontrolü</h3>
      <p>Fişlerinizi düzenli takip ederek:</p>
      <ul>
        <li>Gereksiz harcamaları tespit edebilirsiniz</li>
        <li>Bütçe planlaması yapabilirsiniz</li>
        <li>Tasarruf fırsatları bulabilirsiniz</li>
      </ul>

      <h3>3. İş Analizi</h3>
      <p>SmartReceipt gibi AI destekli araçlarla:</p>
      <ul>
        <li>Harcama trendlerini görselleştirebilirsiniz</li>
        <li>Kategori bazlı analiz yapabilirsiniz</li>
        <li>Gelecek döneme daha iyi hazırlanabilirsiniz</li>
      </ul>

      <h2>SmartReceipt ile Fark</h2>
      <p>Geleneksel yöntemlerle fiş takibi zaman alıcı ve hata yapmaya açıktır. SmartReceipt, AI teknolojisi ile:</p>
      <ul>
        <li><strong>Otomatik okuma:</strong> Fişi fotoğraflayın, tüm bilgiler saniyeler içinde kaydedilsin</li>
        <li><strong>Akıllı kategorilendirme:</strong> Harcamalarınız otomatik kategorilere ayrılsın</li>
        <li><strong>Anında raporlama:</strong> İstediğiniz raporu tek tıkla oluşturun</li>
      </ul>

      <h2>Hemen Başlayın</h2>
      <p>SmartReceipt ile fiş takibini sadeleştirin. 7 gün ücretsiz deneyin, kredi kartı gerektirmez!</p>
      <p><a href="/register" style="color: #2563eb; font-weight: bold;">Ücretsiz Deneme Başlat →</a></p>
    `,
  },
  "ai-ile-fis-okuma": {
    title: "AI ile Fiş Okuma: Geleceğin Muhasebe Teknolojisi",
    date: "10 Ocak 2026",
    readTime: "7 dk okuma",
    category: "Teknoloji",
    content: `
      <h2>AI Teknolojisi Muhasebede Devrim Yarattı</h2>
      <p>Yapay zeka (AI) destekli optik karakter tanıma (OCR) teknolojisi, fiş okuma sürecini tamamen değiştirdi. Artık elle veri girişine gerek kalmadan, fişlerinizi saniyeler içinde dijitalleştirebilirsiniz.</p>

      <h3>AI Fiş Okuma Nasıl Çalışır?</h3>
      <ol>
        <li><strong>Görüntü Yakalama:</strong> Fişinizin fotoğrafını çekin veya yükleyin</li>
        <li><strong>Ön İşleme:</strong> AI, görüntüyü optimize eder (kontrast, parlaklık, açı düzeltme)</li>
        <li><strong>OCR:</strong> Yapay zeka metinleri tanır ve çıkarır</li>
        <li><strong>Akıllı Parsing:</strong> Tutar, tarih, mağaza adı gibi bilgiler otomatik ayrıştırılır</li>
        <li><strong>Validasyon:</strong> Çıkarılan veriler mantıksal olarak kontrol edilir</li>
      </ol>

      <h3>Geleneksel Yöntemlerle Kıyaslama</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f3f4f6;">
          <th style="border: 1px solid #e5e7eb; padding: 12px;">Özellik</th>
          <th style="border: 1px solid #e5e7eb; padding: 12px;">Manuel Giriş</th>
          <th style="border: 1px solid #e5e7eb; padding: 12px;">AI ile SmartReceipt</th>
        </tr>
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 12px;">Süre</td>
          <td style="border: 1px solid #e5e7eb; padding: 12px;">2-3 dakika/fiş</td>
          <td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>5 saniye/fiş</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 12px;">Hata Oranı</td>
          <td style="border: 1px solid #e5e7eb; padding: 12px;">%5-10</td>
          <td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>%0.1</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 12px;">Maliyet (100 fiş)</td>
          <td style="border: 1px solid #e5e7eb; padding: 12px;">3-5 saat iş gücü</td>
          <td style="border: 1px solid #e5e7eb; padding: 12px;"><strong>10 dakika</strong></td>
        </tr>
      </table>

      <h2>SmartReceipt'in AI Avantajları</h2>
      <ul>
        <li><strong>Çoklu Dil Desteği:</strong> Türkçe, İngilizce ve diğer dillerdeki fişleri okur</li>
        <li><strong>Bulanık Görüntü Toleransı:</strong> Kötü aydınlatma veya bulanık fotoğrafları bile işleyebilir</li>
        <li><strong>Akıllı Öğrenme:</strong> Kullandıkça daha iyi hale gelir</li>
        <li><strong>Toplu İşlem:</strong> Birden fazla fişi aynı anda işleyebilir</li>
      </ul>

      <h2>Hemen Deneyin</h2>
      <p>SmartReceipt'in AI gücünü kendi fişlerinizde test edin. İlk 10 fiş tamamen ücretsiz!</p>
      <p><a href="/register" style="color: #2563eb; font-weight: bold;">Ücretsiz Başla →</a></p>
    `,
  },
  "vergi-raporu-hazirlama": {
    title: "Vergi Raporu Hazırlamak İçin 5 İpucu",
    date: "5 Ocak 2026",
    readTime: "6 dk okuma",
    category: "Vergi",
    content: `
      <h2>Vergi Dönemine Hazır Olun</h2>
      <p>Vergi dönemi yaklaşırken, düzenli bir fiş takibi sistemi hayat kurtarıcı olabilir. İşte vergi raporu hazırlarken işinizi kolaylaştıracak 5 ipucu:</p>

      <h3>1. Fişlerinizi Düzenli Kategorilere Ayırın</h3>
      <p>Harcamalarınızı kategorilere ayırarak:</p>
      <ul>
        <li>İndirilebilir giderleri kolayca belirleyebilirsiniz</li>
        <li>Kategori bazlı raporlar oluşturabilirsiniz</li>
        <li>SmartReceipt bunu otomatik yapar!</li>
      </ul>

      <h3>2. Dijital Kopyalar Saklayın</h3>
      <p>Kağıt fişler:</p>
      <ul>
        <li>Solabilir, yırtılabilir, kaybolabilir</li>
        <li>Dijital yedekleme şart</li>
        <li>SmartReceipt cloud'da güvenle saklar</li>
      </ul>

      <h3>3. Aylık Kontrol Yapın</h3>
      <p>Her ay sonu mutlaka:</p>
      <ul>
        <li>Tüm fişlerin kaydedildiğinden emin olun</li>
        <li>Eksik veya hatalı kayıtları düzeltin</li>
        <li>SmartReceipt'in aylık özet raporunu inceleyin</li>
      </ul>

      <h3>4. İş ve Kişisel Harcamaları Ayırın</h3>
      <p>Önemli:</p>
      <ul>
        <li>İş harcamalarını ayrı takip edin</li>
        <li>Karışık harcamalar vergi sorununa yol açabilir</li>
        <li>SmartReceipt'te farklı hesaplar oluşturabilirsiniz</li>
      </ul>

      <h3>5. Muhasebeci ile Entegre Çalışın</h3>
      <p>SmartReceipt ile:</p>
      <ul>
        <li>Raporlarınızı Excel/PDF olarak export edin</li>
        <li>Muhasebecinize kolayca gönderin</li>
        <li>API entegrasyonu ile doğrudan muhasebe yazılımına aktarın</li>
      </ul>

      <h2>SmartReceipt ile Vergi Raporlaması</h2>
      <p>SmartReceipt, vergi raporlaması için özel olarak tasarlanmış özellikler sunar:</p>
      <ul>
        <li>Yıllık gelir-gider raporu</li>
        <li>KDV raporu</li>
        <li>Kategori bazlı harcama dökümü</li>
        <li>e-Defter uyumlu format</li>
      </ul>

      <h2>Hazır mısınız?</h2>
      <p>2026 vergi döneminize SmartReceipt ile hazırlanın. İlk ay ücretsiz!</p>
      <p><a href="/register" style="color: #2563eb; font-weight: bold;">Hemen Başla →</a></p>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];
  
  if (!post) {
    return {
      title: "Blog Yazısı Bulunamadı | SmartReceipt",
    };
  }

  return {
    title: `${post.title} | SmartReceipt Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tüm Yazılar
      </Link>

      {/* Article */}
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Featured Image */}
        <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <p className="text-white text-lg">Blog Görseli</p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Meta */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {post.category}
            </span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {post.title}
          </h1>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              lineHeight: '1.8',
            }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              SmartReceipt ile Harcama Yönetiminizi Sadeleştirin
            </h3>
            <p className="text-gray-700 mb-4">
              AI destekli fiş okuma, otomatik kategorizasyon ve vergi raporlaması. 
              İlk 7 gün ücretsiz!
            </p>
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Ücretsiz Başla →
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">İlgili Yazılar</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(blogPosts)
            .filter(([slug]) => slug !== params.slug)
            .slice(0, 2)
            .map(([slug, relatedPost]) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <span className="text-sm text-blue-600 font-medium">{relatedPost.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-600">{relatedPost.date}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
