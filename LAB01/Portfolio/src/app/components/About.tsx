import React from "react";
import { User, Globe, Code, Target } from "lucide-react";
import { useTranslation } from "../../i18n";

const skills = [
  { name: "React / Next.js", level: 90, color: "#61dafb" },
  { name: "TypeScript", level: 85, color: "#3178c6" },
  { name: "Node.js / Express", level: 80, color: "#68a063" },
  { name: "PostgreSQL / MongoDB", level: 75, color: "#336791" },
  { name: "Docker / CI/CD", level: 65, color: "#2496ed" },
];

const techBadges = [
  "React", "TypeScript", "JavaScript", "Node.js",
  "SQL", "Git", "Docker", "AWS", "REST APIs", "GraphQL", "Linux",
];

export function About() {
  const { t } = useTranslation();
  const c = t.about;

  return (
    <section
      id="sobre"
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
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left: Bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Avatar */}
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, var(--p-cyan) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "1.75rem",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                }}
              >
                PC
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--p-t1)",
                  }}
                >
                  Pedro Carbonaro
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.9375rem",
                    color: "#6366f1",
                    marginTop: "0.25rem",
                  }}
                >
                  {c.intro}
                </p>
              </div>
            </div>

            {/* Bio text */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "var(--p-t2)",
                lineHeight: 1.8,
              }}
            >
              {c.bio1}
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "var(--p-t2)",
                lineHeight: 1.8,
              }}
            >
              {c.bio2}
            </p>

            {/* Info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { icon: <Code size={14} />, label: c.infoCards.educationLabel, value: c.infoCards.educationValue },
                { icon: <User size={14} />, label: c.infoCards.areaLabel, value: c.infoCards.areaValue },
                { icon: <Target size={14} />, label: c.infoCards.goalLabel, value: c.infoCards.goalValue },
                { icon: <Globe size={14} />, label: c.infoCards.interestsLabel, value: c.infoCards.interestsValue },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "0.875rem",
                    borderRadius: "10px",
                    border: "1px solid var(--p-border3)",
                    background: "var(--p-badge-bg)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      color: "#6366f1",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {item.icon}
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#6366f1",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.8125rem",
                      color: "var(--p-t1)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Skills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Skill bars */}
            <div>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--p-t1)",
                  marginBottom: "1.25rem",
                }}
              >
                {c.skillsTitle}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.375rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.875rem",
                          color: "var(--p-t2)",
                        }}
                      >
                        {skill.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "Fira Code, monospace",
                          fontSize: "0.8125rem",
                          color: skill.color,
                        }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        borderRadius: "3px",
                        background: "var(--p-skill-track)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${skill.level}%`,
                          borderRadius: "3px",
                          background: `linear-gradient(to right, #6366f1, ${skill.color})`,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech badges */}
            <div>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--p-t1)",
                  marginBottom: "1rem",
                }}
              >
                {c.techTitle}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {techBadges.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: "0.3125rem 0.75rem",
                      borderRadius: "999px",
                      border: "1px solid var(--p-border)",
                      background: "var(--p-badge-bg)",
                      fontFamily: "Fira Code, monospace",
                      fontSize: "0.8125rem",
                      color: "var(--p-badge-t)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
