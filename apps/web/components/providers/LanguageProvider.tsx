"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        "nav.dashboard": "Dashboard",
        "nav.pipeline": "Pipeline",
        "nav.deals": "Deals",
        "nav.brands": "Brands",
        "nav.contacts": "Contacts",
        "nav.calendar": "Calendar",
        "nav.finance": "Finance",
        "nav.leaderboard": "Leaderboard",
        "nav.automations": "Automations",
        "nav.settings": "Settings",
        "nav.logout": "Logout",
        "dashboard.welcome": "Welcome back",
        "dashboard.monthly_revenue": "Monthly Revenue",
        "dashboard.active_pipeline": "Active Pipeline",
        "dashboard.win_rate": "Win Rate",
        "dashboard.executive_review": "Executive Review",
        "dashboard.view_all_deals": "View all deals closing this month",
        "dashboard.view_finance": "View finance report",
        "finance.title": "Finance & Overview",
        "finance.subtitle": "Track your earnings, overdue payments, and expected commissions.",
        "finance.tab_overview": "Overview",
        "finance.tab_commissions": "Commissions Engine",
        "finance.total_expected": "Total Expected",
        "finance.total_collected": "Total Collected",
        "finance.overdue_risk": "Overdue / Risk",
        "finance.monthly_revenue": "Monthly Revenue",
        "finance.top_brands": "🏆 Top Paying Brands",
        "finance.scheduled_payments": "All Scheduled Payments",
        "finance.commission_breakdown": "Commission Breakdown",
        "finance.sales_rep_commissions": "Total Sales Rep Commissions",
        "finance.influencer_commissions": "Total Influencer Commissions",
        "leaderboard.title": "Leaderboard & Performance",
        "leaderboard.subtitle": "Track the LTV and performance scores of your network.",
        "pipeline.title": "Sales Pipeline",
        "pipeline.subtitle": "Manage and track deals through their lifecycle.",
        "common.create": "Create",
        "common.cancel": "Cancel",
        "common.save": "Save",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.search": "Search...",
        "brands.title": "Brands & Clients",
        "brands.subtitle": "Manage your brand relationships and company profiles.",
        "brands.new_brand": "New Brand",
        "contacts.title": "Contacts & People",
        "contacts.subtitle": "Manage external stakeholders, influencers, and brand reps.",
        "contacts.new_contact": "New Contact",
        "deals.title": "Deals & Contracts",
        "deals.subtitle": "View and manage all active contracts and documents.",
        "deals.new_deal": "New Deal",
        "deals.ai_autofill": "AI Contract Autofill",
        "calendar.title": "Calendar & Events",
        "calendar.subtitle": "Manage deal schedules, meetings, and important dates.",
        "automations.title": "Automations & Hooks",
        "automations.subtitle": "Configure AI hooks, email sequences, and background tasks.",
        "billing.title": "Billing & Subscription",
        "billing.subtitle": "Manage your pricing plan, users, and invoices.",
        "dashboard.monthly_revenue_sub": "Total revenue collected this month",
        "dashboard.active_pipeline_sub": "Across {count} active deals",
        "dashboard.win_rate_sub": "Percentage of won deals",
        "dashboard.overdue_payments": "Overdue Payments",
        "dashboard.overdue_payments_sub": "Across {count} invoices",
        "dashboard.todays_tasks": "Today's Tasks",
        "dashboard.deliverables_due": "Deliverables Due",
        "dashboard.payments_due": "Payments Due",
        "dashboard.weekly_overview": "Weekly Deliverables Overview",
        "dashboard.deliverables_due_today": "Deliverables Due Today",
        "dashboard.total_deals": "Total Deals",
        "dashboard.pipeline_overview": "Pipeline Overview",
        "dashboard.recent_activity": "Recent Activity",
        "dashboard.no_pipeline_data": "No pipeline data available.",
        "dashboard.no_recent_activity": "No recent activity.",
        "common.title": "Title",
        "common.brand": "Brand",
        "common.stage": "Stage",
        "common.value": "Value",
        "common.platform": "Platform",
        "common.actions": "Actions",
        "common.loading": "Loading...",
        "deals.no_deals": "No deals found. Create one from the Pipeline page!",
        "deals.view_details": "View Details",
        "deals.delete_deal": "Delete Deal",
        "deals.details_title": "Deal Details",
        "deals.created_at": "Created At",
        "deals.contact_person": "Contact Person",
        "deals.ai_score": "AI Deal Prediction Score",
        "deals.notes": "Notes",
        "deals.no_notes": "No notes added for this deal.",
        "stage.LEAD": "Lead",
        "stage.NEGOTIATION": "Negotiation",
        "stage.APPROVED": "Approved",
        "stage.COMPLETED": "Completed"
    },
    tr: {
        "nav.dashboard": "Ana Ekran",
        "nav.pipeline": "İş Akışı",
        "nav.deals": "Fırsatlar",
        "nav.brands": "Markalar",
        "nav.contacts": "Kişiler",
        "nav.calendar": "Takvim",
        "nav.finance": "Finans",
        "nav.leaderboard": "Liderlik Tablosu",
        "nav.automations": "Otomasyonlar",
        "nav.settings": "Ayarlar",
        "nav.logout": "Çıkış Yap",
        "dashboard.welcome": "Tekrar Hoşgeldin",
        "dashboard.monthly_revenue": "Aylık Ciro",
        "dashboard.active_pipeline": "Aktif Fırsat Değeri",
        "dashboard.win_rate": "Kazanma Oranı",
        "dashboard.executive_review": "Patron Paneli",
        "dashboard.view_all_deals": "Bu ay kapanacak olanları gör",
        "dashboard.view_finance": "Finansal rapora git",
        "finance.title": "Finans ve Özet",
        "finance.subtitle": "Kazançları, gecikmiş ödemeleri ve beklenen primleri takip edin.",
        "finance.tab_overview": "Genel Bakış",
        "finance.tab_commissions": "Komisyon Motoru",
        "finance.total_expected": "Beklenen Toplam",
        "finance.total_collected": "Tahsil Edilen Toplam",
        "finance.overdue_risk": "Gecikmiş / Riskli",
        "finance.monthly_revenue": "Aylık Ciro",
        "finance.top_brands": "🏆 En Çok Kazandıran Markalar",
        "finance.scheduled_payments": "Tüm Planlı Ödemeler",
        "finance.commission_breakdown": "Komisyon Dağılımı",
        "finance.sales_rep_commissions": "Toplam Satışçı Primleri",
        "finance.influencer_commissions": "Toplam İçerik Üretici Primleri",
        "leaderboard.title": "Liderlik Tablosu ve Performans",
        "leaderboard.subtitle": "Ağınızın LTV ve performans puanlarını takip edin.",
        "pipeline.title": "Satış Süreci",
        "pipeline.subtitle": "Fırsatları yaşam döngüleri boyunca yönetin ve takip edin.",
        "common.create": "Oluştur",
        "common.cancel": "İptal",
        "common.save": "Kaydet",
        "common.edit": "Düzenle",
        "common.delete": "Sil",
        "common.search": "Ara...",
        "brands.title": "Markalar ve Müşteriler",
        "brands.subtitle": "Marka ilişkilerini ve şirket profillerini yönetin.",
        "brands.new_brand": "Yeni Marka",
        "contacts.title": "Kişiler ve Temsilciler",
        "contacts.subtitle": "Dış paydaşları, içerik üreticilerini ve marka temsilcilerini yönetin.",
        "contacts.new_contact": "Yeni Kişi",
        "deals.title": "Sözleşmeler ve Fırsatlar",
        "deals.subtitle": "Tüm aktif sözleşmeleri ve belgeleri görüntüleyin ve yönetin.",
        "deals.new_deal": "Yeni Fırsat",
        "deals.ai_autofill": "Yapay Zeka Sözleşme Doldurma",
        "calendar.title": "Takvim ve Etkinlikler",
        "calendar.subtitle": "Fırsat programlarını, toplantıları ve önemli tarihleri yönetin.",
        "automations.title": "Otomasyonlar ve Kancalar",
        "automations.subtitle": "Yapay zeka kancalarını, e-posta sıralarını ve arka plan görevlerini yapılandırın.",
        "billing.title": "Abonelik ve Faturalama",
        "billing.subtitle": "Fiyatlandırma planınızı, kullanıcılarınızı ve faturalarınızı yönetin.",
        "dashboard.monthly_revenue_sub": "Bu ay toplanan toplam gelir",
        "dashboard.active_pipeline_sub": "{count} aktif fırsat üzerinden",
        "dashboard.win_rate_sub": "Kazanılan fırsatların yüzdesi",
        "dashboard.overdue_payments": "Gecikmiş Ödemeler",
        "dashboard.overdue_payments_sub": "{count} fatura üzerinden",
        "dashboard.todays_tasks": "Bugünün Görevleri",
        "dashboard.deliverables_due": "Teslim Edilecekler",
        "dashboard.payments_due": "Bekleyen Ödemeler",
        "dashboard.weekly_overview": "Haftalık Teslimat Özeti",
        "dashboard.deliverables_due_today": "Bugün Teslim Edilecekler",
        "dashboard.total_deals": "Toplam Fırsat",
        "dashboard.pipeline_overview": "Satış Süreci Özeti",
        "dashboard.recent_activity": "Son Hareketler",
        "dashboard.no_pipeline_data": "Satış süreci verisi bulunamadı.",
        "dashboard.no_recent_activity": "Son hareket bulunamadı.",
        "common.title": "Başlık",
        "common.brand": "Marka",
        "common.stage": "Aşama",
        "common.value": "Tutar",
        "common.platform": "Platform",
        "common.actions": "İşlemler",
        "common.loading": "Yükleniyor...",
        "deals.no_deals": "Fırsat bulunamadı. Satış Süreci sayfasından yeni bir fırsat oluşturun!",
        "deals.view_details": "Detayları Görüntüle",
        "deals.delete_deal": "Fırsatı Sil",
        "deals.details_title": "Fırsat Detayları",
        "deals.created_at": "Oluşturulma Tarihi",
        "deals.contact_person": "İlgili Kişi",
        "deals.ai_score": "Yapay Zeka Başarı Tahmini",
        "deals.notes": "Notlar",
        "deals.no_notes": "Bu fırsat için not eklenmemiş.",
        "stage.LEAD": "Aday (Lead)",
        "stage.NEGOTIATION": "Görüşme",
        "stage.APPROVED": "Onaylandı",
        "stage.COMPLETED": "Tamamlandı"
    }
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('inf_crm_lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
            setLanguageState(savedLang);
        } else {
            // Check browser language
            const browserLang = navigator.language.startsWith('tr') ? 'tr' : 'en';
            setLanguageState(browserLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('inf_crm_lang', lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
