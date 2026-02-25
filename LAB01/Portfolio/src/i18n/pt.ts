import type { Translations } from "./types";

export const pt: Translations = {
  /* ── Navbar ─────────────────────────────────────────────────── */
  navbar: {
    links: [
      { id: "sobre", label: "Sobre Mim" },
      { id: "projetos", label: "Projetos" },
      { id: "experiencias", label: "Experiências" },
      { id: "contato", label: "Contato" },
    ],
    cta: "Fale Comigo",
    lightMode: "Modo claro",
    darkMode: "Modo escuro",
    switchLang: "Switch to English",
  },

  /* ── Hero ───────────────────────────────────────────────────── */
  hero: {
    badge: "Disponível para oportunidades",
    greeting: "Olá, eu sou",
    titles: [
      "Desenvolvedor Full Stack",
      "Engenheiro de Software",
      "Especialista em React & Node.js",
      "Apaixonado por Código",
    ],
    bio: "Desenvolvedor apaixonado por criar soluções digitais de alto impacto. Especializado em construir aplicações modernas, escaláveis e com experiências de usuário excepcionais.",
    ctaProjects: "Ver Projetos",
    ctaContact: "Entre em Contato",
  },

  /* ── About ──────────────────────────────────────────────────── */
  about: {
    tag: "sobre_mim",
    title: "Sobre Mim",
    intro: "Estudante de Engenharia de Software apaixonado por tecnologia",
    bio1: "Sou estudante de Engenharia de Software, apaixonado por tecnologia e desenvolvimento web. Busco constantemente aprender novas tecnologias e aplicar meus conhecimentos em projetos práticos que gerem impacto real.",
    bio2: "Meu objetivo é contribuir com projetos inovadores que gerem impacto positivo, constantemente aprimorando minhas habilidades e explorando novas tecnologias. Acredito que o bom código é aquele que resolve problemas reais.",
    infoCards: {
      educationLabel: "Formação",
      educationValue: "Engenharia de Software (cursando)",
      areaLabel: "Área",
      areaValue: "Desenvolvimento Web Full Stack",
      goalLabel: "Objetivo",
      goalValue: "Contribuir com produtos de impacto global",
      interestsLabel: "Interesses",
      interestsValue: "Open Source, DevOps, UX/UI",
    },
    skillsTitle: "Habilidades Técnicas",
    techTitle: "Tecnologias",
  },

  /* ── Projects ───────────────────────────────────────────────── */
  projects: {
    tag: "projetos",
    title: "Projetos",
    subtitle: "Projetos que desenvolvi ao longo da minha jornada.",
    items: [
      {
        id: 1,
        year: "2026",
        name: "Portfolio Pessoal",
        description: "Site portfólio moderno com tema escuro/claro e suporte bilíngue PT/EN",
        longDesc:
          "Portfólio pessoal desenvolvido com React, TypeScript e Vite. Possui sistema de temas (dark/light) com CSS custom properties, internacionalização PT-BR/EN com React Context, design responsivo, animações suaves, formulário de contato e seções de projetos e experiências com timeline interativa.",
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
    tag: "experiencias",
    title: "Experiências",
    subtitle: "Minha trajetória e os projetos que marcaram meu aprendizado.",
    currentLabel: "Atual",
    achievementsLabel: "Conquistas",
    items: [
      {
        id: 1,
        company: "Projeto Acadêmico",
        role: "Desenvolvedor Front-end",
        period: "2026",
        location: "Belo Horizonte, MG",
        type: "Freelance",
        description:
          "Desenvolvimento de portfólio pessoal como projeto da disciplina de Laboratório de Desenvolvimento de Software. Aplicação SPA com React, TypeScript e Vite, incluindo sistema de temas, internacionalização e design responsivo.",
        achievements: [
          "Implementou sistema de temas (dark/light) com CSS custom properties isolado em módulo próprio",
          "Criou arquitetura de internacionalização PT-BR/EN com React Context API",
          "Desenvolveu layout responsivo com seções interativas e animações suaves",
          "Configurou build otimizado com Vite e Tailwind CSS v4",
        ],
        techs: ["React", "TypeScript", "Vite", "Tailwind CSS", "Lucide React"],
        current: true,
      },
    ],
  },

  /* ── Contact ────────────────────────────────────────────────── */
  contact: {
    tag: "contato",
    title: "Entre em Contato",
    subtitle:
      "Tem um projeto em mente? Vamos conversar! Estou disponível para novas oportunidades e colaborações.",
    available: "Disponível para projetos",
    responseTime: "Tempo de resposta: < 24h",
    formTitle: "Envie uma mensagem",
    nameLabel: "Nome *",
    namePlaceholder: "Seu nome completo",
    nameError: "Nome é obrigatório",
    emailLabel: "E-mail *",
    emailPlaceholder: "seu@email.com",
    emailRequired: "E-mail é obrigatório",
    emailInvalid: "E-mail inválido",
    subjectLabel: "Assunto",
    subjectPlaceholder: "Sobre o que você quer falar?",
    messageLabel: "Mensagem *",
    messagePlaceholder: "Descreva seu projeto ou ideia...",
    messageError: "Mensagem é obrigatória",
    sending: "Enviando...",
    send: "Enviar Mensagem",
    required: "* Campos obrigatórios",
    successTitle: "Mensagem enviada!",
    successMsg: "Obrigado pelo contato. Responderei em breve!",
    errorTitle: "Erro ao enviar",
    errorMsg: "Não foi possível enviar a mensagem. Tente novamente ou entre em contato diretamente pelo e-mail.",
    location: "Belo Horizonte, MG — Brasil",
  },

  /* ── Footer ─────────────────────────────────────────────────── */
  footer: {
    links: [
      { id: "sobre", label: "Sobre Mim" },
      { id: "projetos", label: "Projetos" },
      { id: "experiencias", label: "Experiências" },
      { id: "contato", label: "Contato" },
    ],
    madeWith: "Feito com",
    using: "usando React & TypeScript",
    backToTop: "Voltar ao topo",
  },
};
