"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Lang, LANGS, I18N, getStoredLang, setStoredLang } from "./i18n";

type TranslationRecord = Record<string, string>;

function buildRecord(lang: Lang): TranslationRecord {
  const out: TranslationRecord = {};
  for (const [key, dict] of Object.entries(I18N)) {
    const val = (dict as Record<string, unknown>)[lang] ?? (dict as Record<string, unknown>).en ?? key;
    out[key] = Array.isArray(val) ? val.join("\n") : String(val ?? "");
  }
  return out;
}

const LanguageContext = createContext<{
  lang: Lang;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
  allLangs: typeof LANGS;
} | null>(null);

export function I18NProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    setStoredLang(next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const record = buildRecord(lang);
      let value = record[key] ?? key;
      if (params) {
        value = value.replace(/\{(\w+)\}/g, (_m, k) => {
          const v = params[k];
          if (v === undefined) return `{${k}}`;
          return String(v);
        });
      }
      return value;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, allLangs: LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within an I18NProvider");
  }
  return ctx;
}

export function useT() {
  const { t } = useLang();
  return t;
}
