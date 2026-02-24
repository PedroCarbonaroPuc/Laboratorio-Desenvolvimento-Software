import React from "react";
import { Code2, Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import { useTranslation } from "../../i18n";

export function Footer() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: "var(--p-bg3)",
        borderTop: "1px solid var(--p-border3)",
        padding: "3rem 1.5rem 2rem",
        transition: "background 0.3s",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Logo */}
          <button
            onClick={scrollToTop}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Code2 size={24} color="#6366f1" />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "var(--p-t1)",
                letterSpacing: "-0.02em",
              }}
            >
              dev<span style={{ color: "#6366f1" }}>.</span>
              <span style={{ color: "var(--p-cyan)" }}>portfolio</span>
            </span>
          </button>

          {/* Nav links */}
          <nav
            style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {t.footer.links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  color: "var(--p-t3)",
                  transition: "color 0.2s",
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#6366f1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--p-t3)";
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {[
              { icon: <Github size={18} />, href: "https://github.com/pedrocarbonarog", label: "GitHub" },
              { icon: <Linkedin size={18} />, href: "https://linkedin.com/in/pedrocarbonaro", label: "LinkedIn" },
              { icon: <Mail size={18} />, href: "mailto:pedrocarbonaro73@gmail.com.br", label: "Email" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "9px",
                  border: "1px solid var(--p-border3)",
                  background: "var(--p-badge-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--p-t3)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#6366f1";
                  el.style.borderColor = "rgba(99, 102, 241, 0.4)";
                  el.style.background = "rgba(99, 102, 241, 0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--p-t3)";
                  el.style.borderColor = "var(--p-border3)";
                  el.style.background = "var(--p-badge-bg)";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "var(--p-divider)",
            }}
          />

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.8125rem",
                color: "var(--p-t4)",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                flexWrap: "wrap",
              }}
            >
              © 2026 Pedro Carbonaro · {t.footer.madeWith}{" "}
              <Heart size={12} color="#6366f1" fill="#6366f1" style={{ display: "inline" }} />{" "}
              {t.footer.using}
            </p>

            <button
              onClick={scrollToTop}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "var(--p-badge-bg)",
                border: "1px solid var(--p-border3)",
                borderRadius: "8px",
                padding: "0.375rem 0.875rem",
                color: "var(--p-badge-t)",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.8125rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(99, 102, 241, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--p-badge-bg)";
              }}
            >
              <ArrowUp size={14} />
              {t.footer.backToTop}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
