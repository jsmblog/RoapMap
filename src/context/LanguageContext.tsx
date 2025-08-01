import React, { createContext, useContext, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import i18n from "../config/i18n";

type LanguageContextType = {
  currentLang: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLang, setCurrentLang] = useState("es");

  useEffect(() => {
    const loadLang = async () => {
      const stored = await Preferences.get({ key: "app_language" });
      const lang = stored.value || "es";
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang: string) => {
    await Preferences.set({ key: "app_language", value: lang });
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang]);

  /**para detectar el idioma automaticamente por primera vez 
   *  
  useEffect(() => {
    const loadLang = async () => {
      const stored = await Preferences.get({ key: "app_language" });

      // Detectar idioma del navegador si no hay uno guardado
      const browserLang = navigator.language.startsWith("es") ? "es" : "en";
      
      const lang = stored.value || browserLang;
      
      if (!stored.value) {
        console.log(`[Idioma detectado automáticamente]: ${browserLang}`);
      }
      
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    };
    
    loadLang();
  }, []);
  
  */

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
