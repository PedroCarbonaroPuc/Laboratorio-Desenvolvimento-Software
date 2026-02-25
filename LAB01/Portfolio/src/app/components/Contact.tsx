import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  Linkedin,
  Github,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useTranslation } from "../../i18n";

// ── FormSubmit.co ──────────────────────────────────────────────
// Sem cadastro, sem API key. Na primeira vez que alguém enviar,
// um link de confirmação será enviado para o e-mail abaixo.
const FORMSUBMIT_URL = "https://formsubmit.co/ajax/pacgoncalves@sga.pucminas.br";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const c = t.contact;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = c.nameError;
    if (!form.email.trim()) {
      newErrors.email = c.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = c.emailInvalid;
    }
    if (!form.message.trim()) newErrors.message = c.messageError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          _subject: form.subject || "Contato via Portfólio",
          message: form.message,
          _template: "table",
        }),
      });

      if (!res.ok) throw new Error("FormSubmit error");

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Form error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputStyle = (hasError?: string) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    border: `1.5px solid ${hasError ? "rgba(239, 68, 68, 0.5)" : "var(--p-border)"}`,
    background: "var(--p-input)",
    color: "var(--p-t1)",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.9375rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  });

  const socialLinks = [
    {
      icon: <Mail size={22} />,
      label: "E-mail",
      value: "pacgoncalves@sga.pucminas.br",
      href: "mailto:pacgoncalves@sga.pucminas.br",
      color: "#6366f1",
    },
    {
      icon: <MessageSquare size={22} />,
      label: "WhatsApp",
      value: "(31) 9 97487085",
      href: "https://wa.me/5531997487085",
      color: "#22c55e",
    },
    {
      icon: <Linkedin size={22} />,
      label: "LinkedIn",
      value: "linkedin.com/in/pedrocarbonaro",
      href: "https://linkedin.com/in/pedrocarbonaro",
      color: "#0a66c2",
    },
    {
      icon: <Github size={22} />,
      label: "GitHub",
      value: "github.com/pedrocarbonarog",
      href: "https://github.com/pedrocarbonarog",
      color: "#6366f1",
    },
  ];

  return (
    <section
      id="contato"
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
              maxWidth: "480px",
              margin: "1rem auto 0",
            }}
          >
            {c.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Left: Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Status card */}
            <div
              style={{
                padding: "1.25rem",
                borderRadius: "14px",
                border: "1px solid var(--p-cyan-border)",
                background: "var(--p-cyan-bg)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "var(--p-cyan)",
                  flexShrink: 0,
                  boxShadow: "0 0 8px var(--p-cyan)",
                  animation: "contact-pulse 2s infinite",
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--p-t1)",
                  }}
                >
                  {c.available}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8125rem",
                    color: "var(--p-t3)",
                    marginTop: "0.125rem",
                  }}
                >
                  {c.responseTime}
                </p>
              </div>
            </div>

            {/* Social links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "1px solid var(--p-border2)",
                    background: "var(--p-card)",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = `${link.color}55`;
                    el.style.background = `${link.color}0d`;
                    el.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--p-border2)";
                    el.style.background = "var(--p-card)";
                    el.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: `${link.color}18`,
                      border: `1px solid ${link.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: link.color,
                      flexShrink: 0,
                    }}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--p-t3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {link.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.9375rem",
                        color: "var(--p-t1)",
                        marginTop: "0.125rem",
                      }}
                    >
                      {link.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Location */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.875rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--p-border3)",
                background: "var(--p-badge-bg)",
              }}
            >
              <MapPin size={16} color="#6366f1" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  color: "var(--p-t2)",
                }}
              >
                {c.location}
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <div
              style={{
                padding: "2rem",
                borderRadius: "16px",
                border: "1px solid var(--p-border2)",
                background: "var(--p-card-alt)",
                boxShadow: "var(--p-shadow2)",
              }}
            >
              {status === "success" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    padding: "3rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "rgba(34, 197, 94, 0.15)",
                      border: "1.5px solid rgba(34, 197, 94, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle size={36} color="#22c55e" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--p-t1)",
                    }}
                  >
                    {c.successTitle}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9375rem",
                      color: "var(--p-t2)",
                    }}
                  >
                    {c.successMsg}
                  </p>
                </div>
              ) : status === "error" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    padding: "3rem 1rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1.5px solid rgba(239, 68, 68, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AlertCircle size={36} color="#ef4444" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--p-t1)",
                    }}
                  >
                    {c.errorTitle}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9375rem",
                      color: "var(--p-t2)",
                    }}
                  >
                    {c.errorMsg}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--p-t1)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {c.formTitle}
                  </h3>

                  {/* Name */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--p-t2)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {c.nameLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={c.namePlaceholder}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle(errors.name)}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.name
                          ? "rgba(239, 68, 68, 0.5)"
                          : "var(--p-border)";
                      }}
                    />
                    {errors.name && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.8125rem",
                          color: "#ef4444",
                          marginTop: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--p-t2)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {c.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder={c.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle(errors.email)}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.email
                          ? "rgba(239, 68, 68, 0.5)"
                          : "var(--p-border)";
                      }}
                    />
                    {errors.email && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.8125rem",
                          color: "#ef4444",
                          marginTop: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--p-t2)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {c.subjectLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={c.subjectPlaceholder}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      style={inputStyle()}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--p-border)";
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--p-t2)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {c.messageLabel}
                    </label>
                    <textarea
                      placeholder={c.messagePlaceholder}
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{
                        ...inputStyle(errors.message),
                        resize: "vertical",
                        minHeight: "120px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6366f1";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.message
                          ? "rgba(239, 68, 68, 0.5)"
                          : "var(--p-border)";
                      }}
                    />
                    {errors.message && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.8125rem",
                          color: "#ef4444",
                          marginTop: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <AlertCircle size={12} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.625rem",
                      padding: "0.875rem",
                      borderRadius: "10px",
                      border: "none",
                      background:
                        status === "sending"
                          ? "rgba(99, 102, 241, 0.5)"
                          : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      cursor: status === "sending" ? "not-allowed" : "pointer",
                      boxShadow:
                        status === "sending"
                          ? "none"
                          : "0 4px 20px rgba(99, 102, 241, 0.35)",
                      transition: "all 0.2s",
                    }}
                  >
                    {status === "sending" ? (
                      <>
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            border: "2.5px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            animation: "contact-spin 0.8s linear infinite",
                          }}
                        />
                        {c.sending}
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {c.send}
                      </>
                    )}
                  </button>

                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.8125rem",
                      color: "var(--p-t4)",
                      textAlign: "center",
                    }}
                  >
                    {c.required}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes contact-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        @keyframes contact-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
