import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { Locale, Translations } from "./types";
import { pt } from "./pt";
import { en } from "./en";

/* ── locale map ─────────────────────────────────────────────────── */

const locales: Record<Locale, Translations> = { pt, en };

/* ── context ────────────────────────────────────────────────────── */

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "pt",
  setLocale: () => {},
  t: pt,
});

/**
 * Hook to access the current translations and locale controls.
 *
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 * ```
 */
export function useTranslation() {
  return useContext(LanguageContext);
}

/* ── provider ───────────────────────────────────────────────────── */

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  const ctx = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: locales[locale] }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={ctx}>
      {children}
    </LanguageContext.Provider>
  );
}
