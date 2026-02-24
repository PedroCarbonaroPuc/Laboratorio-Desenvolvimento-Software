import React, { useState } from "react";
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "../../i18n";

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  Freelance: { bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.3)", text: "#a855f7" },
  "Estágio": { bg: "var(--p-cyan-bg)", border: "var(--p-cyan-border)", text: "var(--p-cyan)" },
  Internship: { bg: "var(--p-cyan-bg)", border: "var(--p-cyan-border)", text: "var(--p-cyan)" },
  CLT: { bg: "var(--p-badge-bg)", border: "var(--p-border)", text: "var(--p-badge-t)" },
  "Full-time": { bg: "var(--p-badge-bg)", border: "var(--p-border)", text: "var(--p-badge-t)" },
};

export function Experience() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(3);

  const c = t.experience;
  const experiences = c.items;

  return (
    <section
      id="experiencias"
      style={{
        background: "var(--p-bg1)",
        padding: "6rem 1.5rem",
        transition: "background 0.3s",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              fontFamily: "Fira Code, monospace",
              fontSize: "0.875rem",
              color: "#6366f1",
              letterSpacing: "0.1em",
            }}
          >
            &lt; {c.tag} /&gt;
          </span>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--p-t1)",
              marginTop: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            {c.title}
          </h2>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(to right, #6366f1, var(--p-cyan))",
              borderRadius: "2px",
              margin: "1rem auto 0",
            }}
          />
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9375rem",
              color: "var(--p-t3)",
              marginTop: "1rem",
            }}
          >
            {c.subtitle}
          </p>
        </div>

        {/* Timeline list */}
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "23px",
              top: "24px",
              bottom: "24px",
              width: "2px",
              background: "linear-gradient(to bottom, #6366f1 0%, #8b5cf6 50%, var(--p-cyan) 100%)",
              opacity: 0.3,
            }}
          />

          {experiences.map((exp, index) => {
            const typeKey = exp.type;
            const typeStyle = typeColors[typeKey] || typeColors["CLT"];
            const isExpanded = expanded === exp.id;

            return (
              <div
                key={exp.id}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  paddingBottom: index < experiences.length - 1 ? "2rem" : "0",
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: exp.current
                        ? "linear-gradient(135deg, #6366f1, var(--p-cyan))"
                        : "var(--p-badge-bg)",
                      border: `2px solid ${exp.current ? "#6366f1" : "var(--p-border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: exp.current ? "0 0 20px rgba(99, 102, 241, 0.4)" : "none",
                    }}
                  >
                    <Briefcase size={18} color={exp.current ? "#fff" : "#6366f1"} />
                  </div>
                </div>

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    borderRadius: "14px",
                    border: `1px solid ${isExpanded ? "rgba(99, 102, 241, 0.4)" : "var(--p-border2)"}`,
                    background: isExpanded ? "var(--p-card-hover)" : "var(--p-card)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    boxShadow: isExpanded ? "var(--p-shadow)" : "none",
                  }}
                >
                  {/* Card header */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : exp.id)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "1.25rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                          flexWrap: "wrap",
                          marginBottom: "0.375rem",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--p-t1)",
                          }}
                        >
                          {exp.role}
                        </h3>
                        {exp.current && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              padding: "0.125rem 0.5rem",
                              borderRadius: "999px",
                              background: "var(--p-cyan-bg)",
                              border: "1px solid var(--p-cyan-border)",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              color: "var(--p-cyan)",
                            }}
                          >
                            <span
                              style={{
                                width: "5px",
                                height: "5px",
                                borderRadius: "50%",
                                background: "var(--p-cyan)",
                                animation: "exp-pulse 2s infinite",
                              }}
                            />
                            {c.currentLabel}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "#6366f1",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {exp.company}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.8125rem",
                            color: "var(--p-t3)",
                          }}
                        >
                          <Calendar size={12} />
                          {exp.period}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.8125rem",
                            color: "var(--p-t3)",
                          }}
                        >
                          <MapPin size={12} />
                          {exp.location}
                        </span>
                        <span
                          style={{
                            padding: "0.125rem 0.5rem",
                            borderRadius: "6px",
                            background: typeStyle.bg,
                            border: `1px solid ${typeStyle.border}`,
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: typeStyle.text,
                          }}
                        >
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    <div style={{ color: "var(--p-t3)", flexShrink: 0, marginTop: "0.25rem" }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 1.25rem 1.25rem",
                        borderTop: "1px solid var(--p-border3)",
                        paddingTop: "1rem",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.875rem",
                          color: "var(--p-t2)",
                          lineHeight: 1.7,
                          marginBottom: "1rem",
                        }}
                      >
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <div style={{ marginBottom: "1rem" }}>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "#6366f1",
                            marginBottom: "0.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {c.achievementsLabel}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {exp.achievements.map((ach, i) => (
                            <li
                              key={i}
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.8125rem",
                                color: "var(--p-t2)",
                                lineHeight: 1.5,
                                paddingBottom: "0.375rem",
                              }}
                            >
                              <span style={{ color: "var(--p-cyan)", flexShrink: 0 }}>▸</span>
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech stack */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                        {exp.techs.map((tech) => (
                          <span
                            key={tech}
                            style={{
                              padding: "0.1875rem 0.625rem",
                              borderRadius: "6px",
                              background: "var(--p-badge-bg)",
                              border: "1px solid var(--p-border3)",
                              fontFamily: "Fira Code, monospace",
                              fontSize: "0.75rem",
                              color: "var(--p-badge-t)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes exp-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
