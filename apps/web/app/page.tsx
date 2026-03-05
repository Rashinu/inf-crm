import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, LayoutDashboard, LineChart, Briefcase, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              INF <span className="text-blue-600">CRM</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#ozellikler" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Özellikler</a>
            <a href="#fiyatlandirma" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fiyatlandırma</a>
            <a href="#iletisim" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[0_4px_14px_0_rgb(37,99,235,0.39)]">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full -z-10" />

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 border border-blue-200 dark:border-blue-800">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              14 Gün Boyunca Tamamen Ücretsiz Deneyin! Sınırsız Özellikler.
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight font-outfit">
              Influencer ve Ajans Yönetiminin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Geleceği</span>
            </h1>

            <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Markalarınızı, içerik üreticilerinizi, sözleşmeleri ve finansal operasyonlarınızı tek bir merkezden kusursuzca yönetin. Operasyonel maliyetlerinizi düşürün.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[0_8px_20px_0_rgb(37,99,235,0.3)] rounded-xl group transition-all shrink-0">
                  Hemen 14 Gün Ücretsiz Başla
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-slate-300 dark:border-slate-700 dark:text-white rounded-xl bg-white dark:bg-slate-900 shadow-sm shrink-0">
                  Sisteme Giriş Yap
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              Kredi kartı gerektirmez. İptal etmek tamamen ücretsizdir.
            </p>

            {/* Interactive UI Display Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950 z-10 bottom-0 h-32 translate-y-full" />
              <div className="relative rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-slate-900/5 flex items-center justify-center">
                {/* Modern CSS UI Dashboard Mockup */}
                <div className="w-full h-[600px] flex text-left relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19]">
                  {/* Sidebar */}
                  <div className="w-64 border-r border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-[#111827]/50 backdrop-blur-xl p-4 flex flex-col gap-4 hidden md:flex shrink-0">
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white">I</div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">INF CRM</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">Ana Menü</div>
                      <div className="h-9 px-3 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center gap-3 font-medium text-sm shadow-sm border border-blue-100 dark:border-blue-500/10">
                        <LayoutDashboard size={16} /> Panolara Git
                      </div>
                      <div className="h-9 px-3 text-slate-600 dark:text-slate-400 rounded-lg flex items-center gap-3 font-medium text-sm">
                        <Briefcase size={16} /> Fırsatlar
                      </div>
                      <div className="h-9 px-3 text-slate-600 dark:text-slate-400 rounded-lg flex items-center gap-3 font-medium text-sm">
                        <LineChart size={16} /> Finans
                      </div>
                      <div className="h-9 px-3 text-slate-600 dark:text-slate-400 rounded-lg flex items-center gap-3 font-medium text-sm">
                        <Zap size={16} /> Otomasyonlar
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header */}
                    <div className="h-16 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-[#111827]/50 backdrop-blur-xl shrink-0 flex items-center justify-between px-6 z-10 w-full">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Executive Review</div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-white dark:ring-slate-900 shadow-md" />
                    </div>

                    <div className="p-6 flex-1 overflow-hidden pointer-events-none w-full relative">
                      {/* Top Metrics Banner */}
                      <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-6 shadow-lg shadow-blue-500/20 flex items-center justify-between px-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzAiPjxwYXRoIGQ9Ik0wLDMwIEwxMCwyNSBMMjAsMjggTDMwLDE1IEw0MCwxOCBMNTAsNSBMNjAsMTAgTDcwLDIgTDgwLDcgTDkwLDAgTDEwMCwxNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-no-repeat bg-right-bottom opacity-30" />
                        <div className="text-white relative z-10">
                          <div className="text-xs font-medium text-blue-100 mb-1 tracking-wider uppercase">Aylık Toplam Ciro</div>
                          <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">$124,500.00</div>
                        </div>
                      </div>

                      {/* Kanban / Cards Area */}
                      <div className="grid grid-cols-3 gap-6">
                        {[
                          { title: "Yeni Fırsat", count: 12, color: "bg-amber-500", shadow: "shadow-amber-500/20" },
                          { title: "Görüşme Aşamasında", count: 8, color: "bg-blue-500", shadow: "shadow-blue-500/20" },
                          { title: "Onay Bekliyor", count: 3, color: "bg-emerald-500", shadow: "shadow-emerald-500/20" }
                        ].map((col, idx) => (
                          <div key={idx} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${col.color} ${col.shadow} shadow-md`} />
                              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{col.title}</div>
                              <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md ml-auto">{col.count}</div>
                            </div>
                            {/* Mock task cards */}
                            {[1, 2, 3].map((card) => (
                              <div key={card} className={`p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-700/50 shadow-[0_2px_10px_0_rgb(0,0,0,0.02)] ${idx === 2 && card > 1 ? 'opacity-0' : ''}`}>
                                <div className="flex gap-2 mb-3">
                                  <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                  <div className="h-2 w-8 bg-blue-100 dark:bg-blue-900/40 rounded-full" />
                                </div>
                                <div className="h-3 w-5/6 bg-slate-300 dark:bg-slate-600 rounded-full mb-2" />
                                <div className="h-3 w-4/6 bg-slate-200 dark:bg-slate-600/60 rounded-full mb-4" />
                                <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50 dark:border-slate-700/50">
                                  <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-400 border-2 border-white dark:border-[#1E293B] z-10" />
                                    <div className="w-6 h-6 rounded-full bg-rose-400 border-2 border-white dark:border-[#1E293B] z-0" />
                                  </div>
                                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">$3,500</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Bottom Fade Gradient Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-[#0B0F19] to-transparent pointer-events-none z-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Highlights */}
        <section id="ozellikler" className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-outfit">Hızlı, Modern ve Kullanışlı İşletme Araçları</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Tüm süreçlerinizi basitleştirmek ve iş hacminizi artırmak için özel olarak geliştirildi.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <LayoutDashboard size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Satış Süreci (Pipeline)</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Satış fırsatlarınızı, sponsorluklarınızı ve kampanya görüşmelerinizi görsel bir Kanban panosu üzerinden yönetip anlık takip edin.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                  <LineChart size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Gelişmiş Finans & Komisyon</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Her bir anlaşma için marka bütçesini, temsilci komisyonunu ve yayıncı (influencer) hak edişini otomatik hesaplayarak güvenli nakit akışı sağlayın.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Çoklu Kiracı Mimarisi</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Her bir ajansa ve ofise ait verileri, güçlü kullanıcı izolasyonu sayesinde güvenli ve ayrıcalıklı alanlarda barındırın.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trial & Pricing Explanation Section */}
        <section id="fiyatlandirma" className="py-24 bg-blue-600 text-white relative overflow-hidden">
          {/* Abstract circles */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] rounded-full bg-blue-500/50 blur-3xl mix-blend-screen" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] rounded-full bg-indigo-500/50 blur-3xl mix-blend-screen" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 font-outfit">Hiçbir Karta İhtiyaç Duymadan 14 Gün Deneyin</h2>
                  <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                    INF CRM gücünü keşfetmeniz için harika bir fırsat! Hemen kayıt olun ve projenin tüm premium ayrıcalıklarını iki hafta boyunca <strong>100% Ücretsiz ve Limitsiz</strong> deneyimleyin.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Abonelik başlatmadan otomatik 14 gün erişim",
                      "Sınırsız sayıda anlaşma, proje ve bağlantı oluşturma",
                      "Süre dolduğunda otomatik uyarı; veri kaybı yaşanmaz!",
                      "Hesap paneli (Dashboard) üzerinden süre takibi"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-white/20 rounded-full p-1 mt-0.5">
                          <Check size={14} className="text-white" />
                        </div>
                        <span className="text-blue-50">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-xl relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Özel Fiyatlandırma
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-slate-500 font-medium mb-2">Başlangıç Paketi</p>
                    <div className="text-4xl font-extrabold text-slate-900">
                      $29<span className="text-lg text-slate-500 font-medium">/ay</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">1 Kullanıcı (Sistem Sahibi) Dahildir.</p>
                  </div>
                  <hr className="border-slate-100 mb-6" />
                  <div className="space-y-4 mb-8 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 flex items-center gap-2"><Briefcase size={16} className="text-slate-400" /> Ekstra Kullanıcı Başına</span>
                      <span className="font-bold">+$5/ay</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 flex items-center gap-2"><Zap size={16} className="text-slate-400" /> Yıllık Ödemelerde İndirim</span>
                      <span className="font-bold text-emerald-600">%20 İndirim</span>
                    </div>
                  </div>
                  <Button className="w-full h-12 text-md font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                    Paketleri Karşılaştır
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              I
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              INF <span className="text-blue-600">CRM</span>
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Bütün hakları saklıdır &copy; {new Date().getFullYear()} INF CRM.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors text-sm">Gizlilik Sözleşmesi</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors text-sm">Kullanım Şartları</a>
            <a href="#iletisim" className="text-slate-400 hover:text-blue-600 transition-colors text-sm">Destek & İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
