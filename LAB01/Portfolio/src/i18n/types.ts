/**
 * Master type definition for all translatable content.
 *
 * When you add a new section or field, TypeScript will enforce that
 * every locale file (pt.ts, en.ts, …) implements it.
 */

/* ── Data item types ────────────────────────────────────────────── */

export interface Skill {
  name: string;
  level: number;
  color: string;
}

export interface ProjectItem {
  id: number;
  year: string;
  name: string;
  description: string;
  longDesc: string;
  techs: string[];
  image: string;
  github: string;
  demo?: string;
  tag: string;
}

export interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  techs: string[];
  current?: boolean;
}

export interface SocialLink {
  icon: string; // lucide icon name used as key
  label: string;
  value: string;
  href: string;
  color: string;
}

/* ── Section translations ───────────────────────────────────────── */

export interface NavbarTranslations {
  links: { id: string; label: string }[];
  cta: string;
  lightMode: string;
  darkMode: string;
  switchLang: string;
}

export interface HeroTranslations {
  badge: string;
  greeting: string;
  titles: string[];
  bio: string;
  ctaProjects: string;
  ctaContact: string;
}

export interface AboutTranslations {
  tag: string;
  title: string;
  intro: string;
  bio1: string;
  bio2: string;
  infoCards: {
    educationLabel: string;
    educationValue: string;
    areaLabel: string;
    areaValue: string;
    goalLabel: string;
    goalValue: string;
    interestsLabel: string;
    interestsValue: string;
  };
  skillsTitle: string;
  techTitle: string;
}

export interface ProjectsTranslations {
  tag: string;
  title: string;
  subtitle: string;
  items: ProjectItem[];
}

export interface ExperienceTranslations {
  tag: string;
  title: string;
  subtitle: string;
  currentLabel: string;
  achievementsLabel: string;
  items: ExperienceItem[];
}

export interface ContactTranslations {
  tag: string;
  title: string;
  subtitle: string;
  available: string;
  responseTime: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  nameError: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailRequired: string;
  emailInvalid: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  messageError: string;
  sending: string;
  send: string;
  required: string;
  successTitle: string;
  successMsg: string;
  location: string;
}

export interface FooterTranslations {
  links: { id: string; label: string }[];
  madeWith: string;
  using: string;
  backToTop: string;
}

/* ── Root translation object ────────────────────────────────────── */

export interface Translations {
  navbar: NavbarTranslations;
  hero: HeroTranslations;
  about: AboutTranslations;
  projects: ProjectsTranslations;
  experience: ExperienceTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
}

/** Supported locale codes */
export type Locale = "pt" | "en";
