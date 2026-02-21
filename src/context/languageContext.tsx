import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Locale, type Translations } from '@/locales';

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Default to French
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    return (saved === 'en' || saved === 'fr' ? saved : 'fr') as Locale;
  });

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale) {
      localStorage.setItem('locale', newLocale);
      // Reload page to fetch new content in the new language
      window.location.reload();
    }
  };

  const value: LanguageContextType = {
    locale,
    t: translations[locale],
    setLocale,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
