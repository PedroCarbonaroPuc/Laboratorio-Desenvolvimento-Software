import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { darkTheme, lightTheme, type ThemeColors } from "./colors";

/* ── helpers ────────────────────────────────────────────────────── */

/** Convert camelCase key to kebab-case CSS var: cardAlt → --p-card-alt */
function toVar(key: string): string {
  return "--p-" + key.replace(/([A-Z])/g, (m) => "-" + m.toLowerCase());
}

/** Build a CSS rule body from a ThemeColors object */
function buildVars(colors: ThemeColors): string {
  return (Object.entries(colors) as [string, string][])
    .map(([k, v]) => `${toVar(k)}:${v}`)
    .join(";");
}

/* ── context ────────────────────────────────────────────────────── */

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/* ── provider ───────────────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  const ctx = useMemo<ThemeContextValue>(
    () => ({ isDark, toggle: () => setIsDark((d) => !d) }),
    [isDark],
  );

  const darkVars = useMemo(() => buildVars(darkTheme), []);
  const lightVars = useMemo(() => buildVars(lightTheme), []);

  return (
    <ThemeContext.Provider value={ctx}>
      {/* Inject CSS custom properties for both themes */}
      <style>{`
        [data-theme="dark"]{${darkVars}}
        [data-theme="light"]{${lightVars}}
        html{scroll-behavior:smooth}
        *{box-sizing:border-box}
        ::selection{background:rgba(99,102,241,0.3);color:var(--p-t1)}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:var(--p-bg1)}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.4);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(99,102,241,0.6)}
        input::placeholder,textarea::placeholder{color:var(--p-t3)}
      `}</style>

      <div
        data-theme={isDark ? "dark" : "light"}
        style={{
          fontFamily: "Inter, sans-serif",
          background: "var(--p-bg1)",
          minHeight: "100vh",
          color: "var(--p-t1)",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
