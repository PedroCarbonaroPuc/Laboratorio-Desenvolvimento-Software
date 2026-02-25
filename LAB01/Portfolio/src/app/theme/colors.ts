/**
 * Theme color palettes for dark and light modes.
 *
 * Edit this file to adjust any theme color.
 * Each key maps to a CSS custom property: e.g. `bg1` → `--p-bg1`.
 */

export interface ThemeColors {
  bg1: string;
  bg2: string;
  bg3: string;
  card: string;
  cardAlt: string;
  cardHover: string;
  input: string;
  nav: string;
  navMobile: string;
  t1: string;
  t2: string;
  t3: string;
  t4: string;
  border: string;
  border2: string;
  border3: string;
  border4: string;
  badgeBg: string;
  badgeT: string;
  cyan: string;
  cyanBg: string;
  cyanBorder: string;
  skillTrack: string;
  heroRadial1: string;
  heroRadial2: string;
  heroImg: string;
  divider: string;
  shadow: string;
  shadow2: string;
  navBorder: string;
  toggleBg: string;
  toggleBorder: string;
}

export const darkTheme: ThemeColors = {
  bg1: "#080814",
  bg2: "#0d0d1f",
  bg3: "#050510",
  card: "rgba(13, 13, 31, 0.85)",
  cardAlt: "rgba(10, 10, 20, 0.95)",
  cardHover: "rgba(99, 102, 241, 0.08)",
  input: "rgba(13, 13, 31, 0.8)",
  nav: "rgba(8, 8, 20, 0.95)",
  navMobile: "rgba(8, 8, 20, 0.98)",
  t1: "#f1f5f9",
  t2: "#94a3b8",
  t3: "#64748b",
  t4: "#475569",
  border: "rgba(99, 102, 241, 0.2)",
  border2: "rgba(99, 102, 241, 0.15)",
  border3: "rgba(99, 102, 241, 0.1)",
  border4: "rgba(99, 102, 241, 0.08)",
  badgeBg: "rgba(99, 102, 241, 0.1)",
  badgeT: "#a5b4fc",
  cyan: "#22d3ee",
  cyanBg: "rgba(34, 211, 238, 0.1)",
  cyanBorder: "rgba(34, 211, 238, 0.25)",
  skillTrack: "rgba(99, 102, 241, 0.1)",
  heroRadial1: "rgba(99, 102, 241, 0.15)",
  heroRadial2: "rgba(34, 211, 238, 0.08)",
  heroImg: "0.07",
  divider: "rgba(99, 102, 241, 0.08)",
  shadow: "0 8px 32px rgba(99, 102, 241, 0.2)",
  shadow2: "0 2px 12px rgba(0, 0, 0, 0.2)",
  navBorder: "rgba(99, 102, 241, 0.1)",
  toggleBg: "rgba(99, 102, 241, 0.15)",
  toggleBorder: "rgba(99, 102, 241, 0.3)",
};

export const lightTheme: ThemeColors = {
  /* ── backgrounds: clean cool whites ─────────────────────────── */
  bg1: "#f8fafc",
  bg2: "#f1f5f9",
  bg3: "#e2e8f0",

  /* ── surfaces ───────────────────────────────────────────────── */
  card: "#ffffff",
  cardAlt: "#ffffff",
  cardHover: "rgba(99, 102, 241, 0.06)",
  input: "#ffffff",
  nav: "rgba(248, 250, 252, 0.88)",
  navMobile: "rgba(248, 250, 252, 0.98)",

  /* ── typography ─────────────────────────────────────────────── */
  t1: "#0f172a",
  t2: "#334155",
  t3: "#64748b",
  t4: "#94a3b8",

  /* ── borders ────────────────────────────────────────────────── */
  border: "rgba(99, 102, 241, 0.30)",
  border2: "rgba(15, 23, 42, 0.10)",
  border3: "rgba(15, 23, 42, 0.07)",
  border4: "rgba(15, 23, 42, 0.04)",

  /* ── badges ─────────────────────────────────────────────────── */
  badgeBg: "rgba(99, 102, 241, 0.08)",
  badgeT: "#4338ca",

  /* ── accent (teal) ──────────────────────────────────────────── */
  cyan: "#0d9488",
  cyanBg: "rgba(13, 148, 136, 0.08)",
  cyanBorder: "rgba(13, 148, 136, 0.22)",

  /* ── misc ───────────────────────────────────────────────────── */
  skillTrack: "rgba(15, 23, 42, 0.06)",
  heroRadial1: "rgba(99, 102, 241, 0.10)",
  heroRadial2: "rgba(13, 148, 136, 0.06)",
  heroImg: "0.018",
  divider: "rgba(15, 23, 42, 0.08)",

  /* ── shadows ────────────────────────────────────────────────── */
  shadow: "0 2px 4px rgba(15, 23, 42, 0.06), 0 8px 28px rgba(15, 23, 42, 0.10)",
  shadow2: "0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.05)",

  /* ── nav / toggle ───────────────────────────────────────────── */
  navBorder: "rgba(15, 23, 42, 0.08)",
  toggleBg: "rgba(251, 191, 36, 0.14)",
  toggleBorder: "rgba(251, 191, 36, 0.35)",
};
