import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Blog post metadata
const blogPosts = [
  {
    slug: "fis-takibi-neden-onemli",
    title: "Fiş Takibi Neden Bu Kadar Önemli?",
    excerpt: "İşletmeniz veya kişisel finanslarınız için fiş takibinin önemini ve faydalarını keşfedin.",
    date: "15 Ocak 2026",
    readTime: "5 dk okuma",
    category: "Rehber",
  },
  {
    slug: "ai-ile-fis-okuma",
    title: "AI ile Fiş Okuma: Geleceğin Muhasebe Teknolojisi",
    excerpt: "Yapay zeka destekli fiş okuma teknolojisinin nasıl çalıştığını ve avantajlarını öğrenin.",
    date: "10 Ocak 2026",
    readTime: "7 dk okuma",
    category: "Teknoloji",
  },
  {
    slug: "vergi-raporu-hazirlama",
    title: "Vergi Raporu Hazırlamak İçin 5 İpucu",
    excerpt: "Vergi döneminde işinizi kolaylaştıracak pratik ipuçları ve SmartReceipt kullanım önerileri.",
    date: "5 Ocak 2026",
    readTime: "6 dk okuma",
    category: "Vergi",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Featured Post */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
        <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <p className="text-white text-lg">Öne Çıkan Yazı Görseli</p>
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {blogPosts[0].category}
            </span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{blogPosts[0].date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{blogPosts[0].readTime}</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {blogPosts[0].title}
          </h2>
          <p className="text-gray-600 mb-6">
            {blogPosts[0].excerpt}
          </p>
          <Link
            href={`/blog/${blogPosts[0].slug}`}
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
          >
            Devamını Oku
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {blogPosts.slice(1).map((post) => (
          <div key={post.slug} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <p className="text-white">Görsel</p>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm"
              >
                Oku
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mt-12 text-center">
        <h3 className="text-2xl font-bold mb-2">Yeni Yazılardan Haberdar Olun</h3>
        <p className="text-blue-100 mb-6">
          Fiş takibi, muhasebe ve vergi konularında haftalık ipuçları
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          />
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Abone Ol
          </button>
        </div>
      </div>
    </div>
  );
}
