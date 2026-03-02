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
        "pipeline.subtitle": "Manage and track deals through their lifecycle."
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
        "pipeline.subtitle": "Fırsatları yaşam döngüleri boyunca yönetin ve takip edin."
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
