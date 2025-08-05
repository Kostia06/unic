"use client";
import { createContext, useState, useContext } from 'react';
import { translations } from './translations';

const TranslationContext = createContext({
    language: 'es',
    setLanguage: () => {},
    t: () => ''
});

export function TranslationProvider({ children }) {
    const [language, setLanguage] = useState('es');

    const t = (key) => {
        const keys = key.split('.');
        return keys.reduce((obj, k) => obj[k], translations[language]);
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </TranslationContext.Provider>
    );
}

export const useTranslation = () => useContext(TranslationContext);