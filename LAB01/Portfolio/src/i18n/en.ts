import type { Translations } from "./types";

export const en: Translations = {
  /* ── Navbar ─────────────────────────────────────────────────── */
  navbar: {
    links: [
      { id: "sobre", label: "About Me" },
      { id: "projetos", label: "Projects" },
      { id: "experiencias", label: "Experience" },
      { id: "contato", label: "Contact" },
    ],
    cta: "Contact Me",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    switchLang: "Mudar para Português",
  },

  /* ── Hero ───────────────────────────────────────────────────── */
  hero: {
    badge: "Available for opportunities",
    greeting: "Hi, I'm",
    titles: [
      "Full Stack Developer",
      "Software Engineer",
      "React & Node.js Specialist",
      "Passionate about Code",
    ],
    bio: "Developer passionate about creating high-impact digital solutions. Specialized in building modern, scalable applications with exceptional user experiences.",
    ctaProjects: "View Projects",
    ctaContact: "Get in Touch",
  },

  /* ── About ──────────────────────────────────────────────────── */
  about: {
    tag: "about_me",
    title: "About Me",
    intro: "Software Engineering student passionate about technology",
    bio1: "I'm a Software Engineering student, passionate about technology and web development. I constantly seek to learn new technologies and apply my knowledge to practical projects that generate real impact.",
    bio2: "My goal is to contribute to innovative projects that generate positive impact, constantly improving my skills and exploring new technologies. I believe good code is that which solves real problems.",
    infoCards: {
      educationLabel: "Education",
      educationValue: "Software Engineering (in progress)",
      areaLabel: "Area",
      areaValue: "Full Stack Web Development",
      goalLabel: "Goal",
      goalValue: "Contribute to globally impactful products",
      interestsLabel: "Interests",
      interestsValue: "Open Source, DevOps, UX/UI",
    },
    skillsTitle: "Technical Skills",
    techTitle: "Technologies",
  },

  /* ── Projects ───────────────────────────────────────────────── */
  projects: {
    tag: "projects",
    title: "Projects",
    subtitle: "Projects I've developed throughout my journey.",
    items: [
      {
        id: 1,
        year: "2026",
        name: "Personal Portfolio",
        description: "Modern portfolio website with dark/light theme and bilingual PT/EN support",
        longDesc:
          "Personal portfolio built with React, TypeScript and Vite. Features a theme system (dark/light) with CSS custom properties, PT-BR/EN internationalization with React Context, responsive design, smooth animations, contact form and project/experience sections with interactive timeline.",
        techs: ["React", "TypeScript", "Vite", "Tailwind CSS", "Lucide React"],
        image:
          "https://images.unsplash.com/photo-1734277659521-2985326528d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBhcHAlMjBwcm9qZWN0JTIwZGFzaGJvYXJkJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MTg4NjAzMXww&ixlib=rb-4.1.0&q=80&w=1080",
        github: "https://github.com/pedrocarbonarog",
        demo: "#",
        tag: "Full Stack",
      },
    ],
  },

  /* ── Experience ─────────────────────────────────────────────── */
  experience: {
    tag: "experience",
    title: "Experience",
    subtitle: "My journey and the projects that marked my learning.",
    currentLabel: "Current",
    achievementsLabel: "Achievements",
    items: [
      {
        id: 1,
        company: "Academic Project",
        role: "Front-end Developer",
        period: "2026",
        location: "Belo Horizonte, MG",
        type: "Freelance",
        description:
          "Development of a personal portfolio as a project for the Software Development Lab course. SPA application with React, TypeScript and Vite, including theme system, internationalization and responsive design.",
        achievements: [
          "Implemented a theme system (dark/light) with CSS custom properties in an isolated module",
          "Built a PT-BR/EN internationalization architecture with React Context API",
          "Developed a responsive layout with interactive sections and smooth animations",
          "Configured optimized build with Vite and Tailwind CSS v4",
        ],
        techs: ["React", "TypeScript", "Vite", "Tailwind CSS", "Lucide React"],
        current: true,
      },
    ],
  },

  /* ── Contact ────────────────────────────────────────────────── */
  contact: {
    tag: "contact",
    title: "Get in Touch",
    subtitle:
      "Have a project in mind? Let's talk! I'm available for new opportunities and collaborations.",
    available: "Available for projects",
    responseTime: "Response time: < 24h",
    formTitle: "Send a message",
    nameLabel: "Name *",
    namePlaceholder: "Your full name",
    nameError: "Name is required",
    emailLabel: "Email *",
    emailPlaceholder: "you@email.com",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email",
    subjectLabel: "Subject",
    subjectPlaceholder: "What would you like to talk about?",
    messageLabel: "Message *",
    messagePlaceholder: "Describe your project or idea...",
    messageError: "Message is required",
    sending: "Sending...",
    send: "Send Message",
    required: "* Required fields",
    successTitle: "Message sent!",
    successMsg: "Thanks for reaching out. I'll reply soon!",
    errorTitle: "Failed to send",
    errorMsg: "Could not send the message. Please try again or contact me directly via email.",
    location: "Belo Horizonte, MG — Brazil",
  },

  /* ── Footer ─────────────────────────────────────────────────── */
  footer: {
    links: [
      { id: "sobre", label: "About Me" },
      { id: "projetos", label: "Projects" },
      { id: "experiencias", label: "Experience" },
      { id: "contato", label: "Contact" },
    ],
    madeWith: "Made with",
    using: "using React & TypeScript",
    backToTop: "Back to top",
  },
};
