import React, { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "../../i18n";

const bgImage =
  "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjB3b3Jrc3BhY2UlMjBjb2RpbmclMjBzZXR1cCUyMGRhcmt8ZW58MXx8fHwxNzcxODg2MDI4fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  const { t, locale } = useTranslation();
  const [currentTitle, setCurrentTitle] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  const titles = t.hero.titles;
  const c = t.hero;

  // Reset typing animation when language changes
  useEffect(() => {
    setDisplayed("");
    setTyping(true);
    setCurrentTitle(0);
  }, [locale]);

  useEffect(() => {
    const target = titles[currentTitle];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
        }, 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 30);
        return () => clearTimeout(t);
      } else {
        setCurrentTitle((prev) => (prev + 1) % titles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, currentTitle, titles]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--p-bg1)",
        transition: "background 0.3s",
      }}
    >
      {/* Background image with opacity via CSS var */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "var(--p-hero-img)" as any,
        }}
      />

      {/* Gradient overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 20% 50%, var(--p-hero-radial1) 0%, transparent 60%)",
          transition: "background 0.3s",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 80% 50%, var(--p-hero-radial2) 0%, transparent 60%)",
          transition: "background 0.3s",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${[3, 4, 2, 5, 3, 4][i]}px`,
            height: `${[3, 4, 2, 5, 3, 4][i]}px`,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#6366f1" : "var(--p-cyan)",
            opacity: 0.4,
            top: `${[20, 70, 40, 85, 15, 60][i]}%`,
            left: `${[10, 80, 60, 25, 45, 90][i]}%`,
            animation: `particle-pulse ${[3, 4, 3.5, 5, 2.5, 4.5][i]}s ease-in-out infinite`,
          }}
        />
      ))}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "7rem 1.5rem 4rem",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Badge */}
          <div style={{ display: "flex" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 1rem",
                borderRadius: "999px",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                background: "var(--p-badge-bg)",
                fontFamily: "Fira Code, monospace",
                fontSize: "0.8125rem",
                color: "var(--p-badge-t)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--p-cyan)",
                  animation: "hero-pulse 2s ease-in-out infinite",
                }}
              />
              {c.badge}
            </span>
          </div>

          {/* Name */}
          <div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1.125rem",
                color: "var(--p-t2)",
                marginBottom: "0.5rem",
              }}
            >
              {c.greeting}
            </p>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 800,
                color: "var(--p-t1)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Pedro{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, var(--p-cyan) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Carbonaro
              </span>
            </h1>
          </div>

          {/* Animated title */}
          <div
            style={{
              fontFamily: "Fira Code, monospace",
              fontSize: "clamp(1rem, 2.5vw, 1.375rem)",
              color: "var(--p-cyan)",
              minHeight: "2em",
            }}
          >
            <span style={{ color: "#6366f1", marginRight: "0.5rem" }}>&gt;</span>
            {displayed}
            <span
              style={{
                display: "inline-block",
                width: "3px",
                height: "1.2em",
                background: "var(--p-cyan)",
                marginLeft: "2px",
                verticalAlign: "text-bottom",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>

          {/* Bio */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1.0625rem",
              color: "var(--p-t2)",
              lineHeight: 1.75,
              maxWidth: "560px",
            }}
          >
            {c.bio}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => scrollTo("projetos")}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: "10px",
                padding: "0.75rem 1.75rem",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(99, 102, 241, 0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 32px rgba(99, 102, 241, 0.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 24px rgba(99, 102, 241, 0.35)";
              }}
            >
              {c.ctaProjects}
            </button>
            <button
              onClick={() => scrollTo("contato")}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--p-t1)",
                background: "transparent",
                border: "1.5px solid var(--p-border)",
                borderRadius: "10px",
                padding: "0.75rem 1.75rem",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "#6366f1";
                el.style.background = "var(--p-badge-bg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "var(--p-border)";
                el.style.background = "transparent";
              }}
            >
              {c.ctaContact}
            </button>
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {[
              { icon: <Github size={20} />, href: "https://github.com/pedrocarbonarog", label: "GitHub" },
              { icon: <Linkedin size={20} />, href: "https://linkedin.com/in/pedrocarbonaro", label: "LinkedIn" },
              { icon: <Mail size={20} />, href: "mailto:pacgoncalves@sga.pucminas.br", label: "Email" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  border: "1px solid var(--p-border)",
                  background: "var(--p-badge-bg)",
                  color: "var(--p-t2)",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#6366f1";
                  el.style.borderColor = "rgba(99, 102, 241, 0.5)";
                  el.style.background = "rgba(99, 102, 241, 0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--p-t2)";
                  el.style.borderColor = "var(--p-border)";
                  el.style.background = "var(--p-badge-bg)";
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("sobre")}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          color: "var(--p-t3)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          animation: "bounce 2s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          scroll
        </span>
        <ArrowDown size={16} />
      </button>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes particle-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
