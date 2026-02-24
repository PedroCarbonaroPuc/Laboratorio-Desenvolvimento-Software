import React, { useState, useEffect } from "react";
import { Menu, X, Code2, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../theme";
import { useTranslation } from "../../i18n";

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("sobre");
  const [scrolled, setScrolled] = useState(false);

  const navLinks = t.navbar.links;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollPos = window.scrollY + 120;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const section = document.getElementById(navLinks[i].id);
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const ctaLabel = t.navbar.cta;
  const toggleLang = () => setLocale(locale === "pt" ? "en" : "pt");

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        background: scrolled ? "var(--p-nav)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 1px 30px rgba(99, 102, 241, 0.08)" : "none",
        borderBottom: scrolled ? "1px solid var(--p-nav-border)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("sobre")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <Code2 size={26} color="#6366f1" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "var(--p-t1)",
              letterSpacing: "-0.02em",
            }}
          >
            dev
            <span style={{ color: "#6366f1" }}>.</span>
            <span style={{ color: "var(--p-cyan)" }}>portfolio</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "1.5rem" }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: activeSection === link.id ? "#6366f1" : "var(--p-t2)",
                transition: "color 0.2s",
                position: "relative",
                padding: "0.25rem 0",
              }}
            >
              {link.label}
              {activeSection === link.id && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(to right, #6366f1, var(--p-cyan))",
                    borderRadius: "2px",
                  }}
                />
              )}
            </button>
          ))}

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            title={t.navbar.switchLang}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "10px",
              border: "1.5px solid var(--p-border2)",
              background: "var(--p-badge-bg)",
              color: "var(--p-badge-t)",
              cursor: "pointer",
              transition: "all 0.25s",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#6366f1";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(99, 102, 241, 0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--p-border2)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--p-badge-bg)";
            }}
          >
            <Globe size={14} />
            {locale === "pt" ? "PT" : "EN"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={isDark ? t.navbar.lightMode : t.navbar.darkMode}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              border: "1.5px solid var(--p-toggle-border)",
              background: "var(--p-toggle-bg)",
              color: isDark ? "#a5b4fc" : "#ca8a04",
              cursor: "pointer",
              transition: "all 0.25s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.1) rotate(15deg)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1) rotate(0)";
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={() => scrollTo("contato")}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {ctaLabel}
          </button>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden" style={{ alignItems: "center", gap: "0.5rem" }}>
          {/* Language toggle mobile */}
          <button
            onClick={toggleLang}
            title={t.navbar.switchLang}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.3rem 0.625rem",
              borderRadius: "9px",
              border: "1.5px solid var(--p-border2)",
              background: "var(--p-badge-bg)",
              color: "var(--p-badge-t)",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <Globe size={12} />
            {locale === "pt" ? "PT" : "EN"}
          </button>

          {/* Theme toggle mobile */}
          <button
            onClick={toggle}
            title={isDark ? t.navbar.lightMode : t.navbar.darkMode}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              border: "1.5px solid var(--p-toggle-border)",
              background: "var(--p-toggle-bg)",
              color: isDark ? "#a5b4fc" : "#ca8a04",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--p-t2)",
              padding: "0.25rem",
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          style={{
            background: "var(--p-nav-mobile)",
            backdropFilter: "blur(14px)",
            borderTop: "1px solid var(--p-border3)",
            padding: "1rem 1.5rem",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.875rem 0",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: activeSection === link.id ? "#6366f1" : "var(--p-t2)",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--p-border4)",
                cursor: "pointer",
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contato")}
            style={{
              marginTop: "0.75rem",
              width: "100%",
              padding: "0.75rem",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </nav>
  );
}
