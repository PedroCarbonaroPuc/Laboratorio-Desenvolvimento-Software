import React, { useState } from "react";
import { Github, ExternalLink, Calendar, Tag } from "lucide-react";
import { useTranslation } from "../../i18n";
import type { ProjectItem } from "../../i18n/types";

const tagColors: Record<string, string> = {
  "Full Stack": "#6366f1",
  "Mobile First": "#0891b2",
  "Data Science": "#a855f7",
};

export function Projects() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const projects = t.projects.items;

  return (
    <section
      id="projetos"
      style={{
        background: "var(--p-bg2)",
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
            &lt; {t.projects.tag} /&gt;
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
            {t.projects.title}
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
            {t.projects.subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "linear-gradient(to bottom, #6366f1, #8b5cf6, var(--p-cyan))",
              opacity: 0.3,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", position: "relative" }}
                className="md:grid-cols-[1fr_auto_1fr]"
              >
                {/* Left side (even) */}
                <div
                  className={`hidden md:flex ${index % 2 === 0 ? "justify-end" : ""}`}
                  style={{ alignItems: "center" }}
                >
                  {index % 2 === 0 && (
                    <ProjectCard
                      project={project}
                      isSelected={selected === project.id}
                      onSelect={() =>
                        setSelected(selected === project.id ? null : project.id)
                      }
                    />
                  )}
                </div>

                {/* Timeline dot */}
                <div
                  className="hidden md:flex"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, var(--p-cyan))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={18} color="#fff" />
                  </div>
                  <span
                    style={{
                      fontFamily: "Fira Code, monospace",
                      fontSize: "0.8125rem",
                      color: "#6366f1",
                      fontWeight: 600,
                    }}
                  >
                    {project.year}
                  </span>
                </div>

                {/* Right side (odd) */}
                <div className="hidden md:flex" style={{ alignItems: "center" }}>
                  {index % 2 !== 0 && (
                    <ProjectCard
                      project={project}
                      isSelected={selected === project.id}
                      onSelect={() =>
                        setSelected(selected === project.id ? null : project.id)
                      }
                    />
                  )}
                </div>

                {/* Mobile card */}
                <div className="md:hidden">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, var(--p-cyan))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Calendar size={14} color="#fff" />
                    </div>
                    <span
                      style={{
                        fontFamily: "Fira Code, monospace",
                        fontSize: "0.875rem",
                        color: "#6366f1",
                        fontWeight: 600,
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <ProjectCard
                    project={project}
                    isSelected={selected === project.id}
                    onSelect={() =>
                      setSelected(selected === project.id ? null : project.id)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  isSelected,
  onSelect,
}: {
  project: ProjectItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const tagColor = tagColors[project.tag] || "#6366f1";

  return (
    <div
      style={{
        borderRadius: "16px",
        border: `1px solid ${isSelected ? "rgba(99, 102, 241, 0.5)" : "var(--p-border2)"}`,
        background: isSelected ? "var(--p-card-hover)" : "var(--p-card)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        width: "100%",
        maxWidth: "480px",
        boxShadow: isSelected ? "var(--p-shadow)" : "var(--p-shadow2)",
      }}
      onClick={onSelect}
    >
      {/* Image */}
      <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
        <img
          src={project.image}
          alt={project.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: isSelected ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, var(--p-bg2) 0%, transparent 60%)",
            opacity: 0.7,
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            background: `${tagColor}22`,
            border: `1px solid ${tagColor}55`,
            fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: tagColor,
          }}
        >
          {project.tag}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem" }}>
        <h3
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--p-t1)",
            marginBottom: "0.5rem",
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
            color: "var(--p-t2)",
            lineHeight: 1.6,
          }}
        >
          {isSelected ? project.longDesc : project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.875rem" }}>
          {project.techs.map((tech) => (
            <span
              key={tech}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.1875rem 0.625rem",
                borderRadius: "6px",
                background: "var(--p-badge-bg)",
                border: "1px solid var(--p-border3)",
                fontFamily: "Fira Code, monospace",
                fontSize: "0.75rem",
                color: "var(--p-badge-t)",
              }}
            >
              <Tag size={10} />
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--p-border)",
              background: "var(--p-badge-bg)",
              color: "var(--p-badge-t)",
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            <Github size={14} />
            GitHub
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--p-cyan-border)",
                background: "var(--p-cyan-bg)",
                color: "var(--p-cyan)",
                textDecoration: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <ExternalLink size={14} />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
