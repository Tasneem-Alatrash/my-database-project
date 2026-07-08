import { createContext, useContext, useEffect, useState } from "react";
import { translations, languages } from "./translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "resort-ai-lang";

function getInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) return stored;
  return "ar"; // default to Arabic
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    const meta = languages.find((l) => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta?.dir || "ltr";
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  // Resolve a dotted key path (e.g. "marketplace.title") against the active dictionary.
  const t = (path) => {
    const parts = path.split(".");
    let value = translations[lang];
    for (const part of parts) {
      value = value?.[part];
    }
    return value ?? path;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
