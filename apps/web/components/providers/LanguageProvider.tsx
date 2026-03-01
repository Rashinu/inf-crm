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
        // Add more keys as needed
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
