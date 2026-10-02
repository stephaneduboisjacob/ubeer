import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { localeLabels, translations, type Locale } from "./locales";

export type LanguagePreference = Locale | "auto";

type LocalizationValue = {
  locale: Locale;
  preference: LanguagePreference;
  chooseLanguage: (preference: LanguagePreference) => void;
  applyRegionLanguage: (localeCode: string) => void;
};

const STORAGE_KEY = "ubeer-language";
const LocalizationContext = createContext<LocalizationValue | null>(null);
let activeLocale: Locale = "en";

function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fr" || value === "it" || value === "es" || value === "zh" || value === "ru";
}

function browserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  for (const language of navigator.languages.length ? navigator.languages : [navigator.language]) {
    const base = language.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return "en";
}

function formatJsxText(source: string): string {
  if (!source.includes("\n")) return source;
  const lines = source.split(/\r?\n/);
  const nonEmpty = lines.map((line) => line.trim().length > 0);
  const first = nonEmpty.findIndex(Boolean);
  const last = nonEmpty.lastIndexOf(true);
  if (first < 0) return "";
  return lines.slice(first, last + 1).map((line, index) => {
    let value = line;
    if (first + index > 0) value = value.replace(/^\s+/, "");
    if (first + index < lines.length - 1) value = value.replace(/\s+$/, "");
    return value;
  }).join(" ");
}

export function t(source: string): string {
  const formatted = formatJsxText(source);
  const normalized = formatted.replace(/\s+/g, " ").trim();
  if (!normalized) return source;
  const leading = /^\s/.test(formatted) ? " " : "";
  const trailing = /\s$/.test(formatted) ? " " : "";
  const translated = translations[normalized]?.[activeLocale] ?? normalized;
  return `${leading}${translated}${trailing}`;
}

export function useLocalization(): LocalizationValue {
  const value = useContext(LocalizationContext);
  if (!value) throw new Error("useLocalization must be used inside LocalizationProvider");
  return value;
}

export function LanguagePicker() {
  const { preference, chooseLanguage } = useLocalization();
  return <label className="language-picker" aria-label={t("Select display language")}>
    <span aria-hidden="true">◎</span>
    <select value={preference} onChange={(event) => chooseLanguage(event.target.value as LanguagePreference)} aria-label={t("Language")}>
      <option value="auto">{t("Automatic (based on your region)")}</option>
      {Object.entries(localeLabels).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
    </select>
  </label>;
}

export function CryptoAcceptanceBanner() {
  useLocalization();
  return <aside className="crypto-acceptance" aria-label={t("Over 2,000 cryptocurrencies accepted")}>
    <strong>{t("We accept over 2,000 cryptocurrencies")}</strong>
    <span>{t("Including Bitcoin and Lightning")}</span>
  </aside>;
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<LanguagePreference>(() => {
    if (typeof localStorage === "undefined") return "auto";
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "auto" || isLocale(saved) ? saved : "auto";
  });
  const [locale, setLocale] = useState<Locale>(() => preference === "auto" ? browserLocale() : preference);
  activeLocale = locale;

  useEffect(() => {
    if (preference !== "auto") return;
    let cancelled = false;
    void fetch("/api/locale", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() as Promise<{ locale?: string }> : Promise.reject(new Error("Locale lookup failed")))
      .then((result) => { if (!cancelled && isLocale(result.locale)) setLocale(result.locale); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [preference]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    document.title = t("uBeer — Local drinks, delivered");
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = t("uBeer — local drinks, delivered responsibly.");
  }, [locale]);

  const value = useMemo<LocalizationValue>(() => ({
    locale,
    preference,
    chooseLanguage: (next) => {
      setPreference(next);
      if (next === "auto") {
        localStorage.removeItem(STORAGE_KEY);
        setLocale(browserLocale());
      } else {
        localStorage.setItem(STORAGE_KEY, next);
        setLocale(next);
      }
    },
    applyRegionLanguage: (code) => { if (preference === "auto" && isLocale(code)) setLocale(code); },
  }), [locale, preference]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}
