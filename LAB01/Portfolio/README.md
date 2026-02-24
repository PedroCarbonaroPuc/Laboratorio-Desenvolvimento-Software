<!-- [![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo) -->

---

# 🏷️ dev.portfolio — Portfólio Pessoal de Desenvolvedor 👨‍💻

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        Portfólio pessoal interativo construído com <b>React</b>, <b>TypeScript</b> e <b>Vite</b>. A aplicação apresenta seções de <i>apresentação (Hero)</i>, <i>sobre mim</i>, <i>projetos</i>, <i>experiências profissionais</i> e <i>contato</i>, tudo com suporte a <b>tema claro/escuro</b> e <b>internacionalização PT-BR / EN</b>. A arquitetura foi projetada para ser <b>modular, escalável e de fácil manutenção</b>, com sistema de temas e traduções desacoplados via React Context API.
      </div>
    </td>
    <td>
      <div>
        <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/code-2.svg" alt="Logo do Projeto" width="100px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Versão](https://img.shields.io/badge/Versão-v0.0.1-blue?style=for-the-badge) ![React](https://img.shields.io/badge/React-18.3.1-007ec6?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ec6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-6.3.5-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-007ec6?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📚 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação de Dependências](#-instalação-de-dependências)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Wireframes / Figma](#-wireframes--figma)
- [Documentações Utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

Este projeto é um **portfólio pessoal de desenvolvedor** criado no contexto da disciplina de **Laboratório de Desenvolvimento de Software** da PUC Minas. Ele simula um portfólio real, apresentando informações profissionais organizadas em seções interativas.

- **Por que ele existe:** Servir como vitrine profissional para apresentar habilidades, projetos e experiências de um desenvolvedor full stack, além de ser um exercício prático de arquitetura front-end moderna.
- **Qual problema resolve:** Centraliza informações profissionais em uma aplicação web elegante, responsiva e bilíngue, substituindo currículos estáticos.
- **Contexto:** Projeto acadêmico da disciplina LAB-DEV-SOFT, com design inspirado em portfólios profissionais do mercado.
- **Destaques técnicos:** Arquitetura modular com sistema de temas isolado (cores em arquivo único) e internacionalização type-safe via TypeScript, ambos desacoplados dos componentes através de React Context API.

---

## ✨ Funcionalidades Principais

- 🌐 **Internacionalização (i18n):** Alternância completa entre Português (PT-BR) e Inglês (EN) com sistema type-safe.
- 🌓 **Tema Claro / Escuro:** Alternância de tema com cores centralizadas em um único arquivo para fácil personalização.
- ⌨️ **Animação de Digitação:** Efeito typewriter na seção Hero com títulos rotativos.
- 📂 **Timeline de Projetos:** Apresentação cronológica dos projetos com cards expansíveis, imagens e links.
- 💼 **Timeline de Experiências:** Linha do tempo profissional com cards expansíveis contendo conquistas e tecnologias.
- 📬 **Formulário de Contato:** Formulário com validação em tempo real e feedback visual (simulação de envio).
- 📱 **Design Responsivo:** Layout adaptável para desktop e dispositivos móveis com menu hamburger.
- 🧭 **Navegação Suave:** Scroll suave entre seções com indicador de seção ativa na navbar.

---

## 🛠 Tecnologias Utilizadas

As seguintes ferramentas, frameworks e bibliotecas foram utilizados na construção deste projeto.

### 💻 Front-end

| Tecnologia | Versão | Descrição |
| :--- | :--- | :--- |
| **React** | 18.3.1 | Biblioteca para construção de interfaces de usuário |
| **TypeScript** | 5.x | Superset tipado de JavaScript |
| **Vite** | 6.3.5 | Build tool e dev server ultrarrápido |
| **Tailwind CSS** | 4.1.12 | Framework CSS utility-first (usado via plugin Vite) |
| **Lucide React** | 0.487.0 | Biblioteca de ícones SVG |
| **Radix UI** | Diversos | Componentes de UI acessíveis e não-estilizados |
| **React Context API** | — | Gerenciamento de estado para tema e idioma |

### ⚙️ Ferramentas de Build & Dev

| Ferramenta | Versão | Descrição |
| :--- | :--- | :--- |
| **@vitejs/plugin-react** | 4.7.0 | Plugin React para Vite (Fast Refresh) |
| **@tailwindcss/vite** | 4.1.12 | Integração Tailwind CSS v4 com Vite |
| **PostCSS** | — | Processador CSS (configurado via `postcss.config.mjs`) |

---

## 🏗 Arquitetura

O projeto segue uma arquitetura **modular baseada em contextos**, separando responsabilidades em camadas bem definidas:

### Visão Geral

```
App.tsx
  └── ThemeProvider        → Gerencia tema (dark/light) + injeta CSS vars
       └── LanguageProvider → Gerencia idioma (pt/en) + fornece traduções
            └── Componentes → Consomem tema e traduções via hooks
```

### Padrões Adotados

- **Context + Hook Pattern:** `ThemeProvider` / `useTheme()` e `LanguageProvider` / `useTranslation()` eliminam prop drilling.
- **CSS Custom Properties:** Todas as cores do tema são injetadas como variáveis CSS (`--p-*`), permitindo que inline styles referenciem o tema atual sem re-render.
- **Locale Files Type-Safe:** Cada idioma é um arquivo (`pt.ts`, `en.ts`) que implementa a interface `Translations`. Adicionar um campo esquecido gera erro de compilação.
- **Single Source of Truth:**
  - **Cores:** Editáveis em `src/app/theme/colors.ts`
  - **Textos:** Editáveis em `src/i18n/pt.ts` e `src/i18n/en.ts`

### Fluxo de Dados

| Camada | Arquivo(s) | Responsabilidade |
| :--- | :--- | :--- |
| **Tema** | `theme/colors.ts` | Define paletas dark e light |
| **Tema** | `theme/ThemeContext.tsx` | Provider + hook + CSS var injection |
| **i18n** | `i18n/types.ts` | Interfaces TypeScript para traduções |
| **i18n** | `i18n/pt.ts`, `i18n/en.ts` | Arquivos de locale com todo conteúdo |
| **i18n** | `i18n/LanguageContext.tsx` | Provider + hook |
| **UI** | `components/*.tsx` | Componentes visuais (consomem hooks) |

---

## 🔧 Instalação e Execução

### Pré-requisitos

- **Node.js:** Versão LTS (v18.x ou superior)
- **Gerenciador de Pacotes:** npm (incluído no Node.js)

---

### 📦 Instalação de Dependências

1. **Clone o Repositório:**

```bash
git clone <URL_DO_SEU_REPOSITÓRIO>
cd Portfolio
```

2. **Instale as Dependências:**

```bash
npm install
```

---

### ⚡ Como Executar a Aplicação

**Modo de Desenvolvimento:**

```bash
npm run dev
```

🎨 *A aplicação estará disponível em **http://localhost:5173**.*

**Build de Produção:**

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

---

## 🚀 Deploy

1. **Gere o build de produção:**

```bash
npm run build
```

2. **Sirva os arquivos estáticos** da pasta `dist/` usando qualquer servidor web ou plataforma de hospedagem:

```bash
# Exemplo local com o pacote 'serve':
npx serve -s dist
```

> 💡 **Plataformas recomendadas:** Vercel, Netlify ou GitHub Pages — basta conectar o repositório e configurar o comando de build como `npm run build` e o diretório de saída como `dist`.

---

## 📂 Estrutura de Pastas

```
.
├── index.html                    # 📄 Ponto de entrada HTML
├── package.json                  # 📦 Dependências e scripts
├── vite.config.ts                # ⚙️ Configuração do Vite
├── postcss.config.mjs            # ⚙️ Configuração do PostCSS
├── ATTRIBUTIONS.md               # 📜 Atribuições de assets
│
├── /figma_screens                # 🎨 Wireframes exportados do Figma (.h2d)
│   ├── PortfolioDark.h2d         # 🌑 Tela Dark Mode (PT-BR)
│   ├── PorfolioDarkENG.h2d       # 🌑 Tela Dark Mode (EN)
│   ├── PortfolioLight.h2d        # ☀️ Tela Light Mode (PT-BR)
│   └── PortfolioLightENG.h2d     # ☀️ Tela Light Mode (EN)
│
├── /guidelines                   # 📚 Diretrizes do projeto
│   └── Guidelines.md
│
├── /src                          # 📂 Código-fonte
│   ├── main.tsx                  # 🚀 Ponto de entrada React
│   │
│   ├── /app                      # 📂 Aplicação principal
│   │   ├── App.tsx               # 🧩 Componente raiz (providers + layout)
│   │   │
│   │   ├── /theme                # 🎨 Sistema de temas
│   │   │   ├── colors.ts         # 🎨 Paletas dark & light (single source)
│   │   │   ├── ThemeContext.tsx   # 🌓 Provider + hook useTheme()
│   │   │   └── index.ts          # 📤 Barrel exports
│   │   │
│   │   └── /components           # 🧱 Componentes de UI
│   │       ├── Navbar.tsx        # 🧭 Navegação + toggles de tema e idioma
│   │       ├── Hero.tsx          # 🏠 Seção inicial com typewriter
│   │       ├── About.tsx         # 👤 Sobre mim + habilidades
│   │       ├── Projects.tsx      # 📂 Timeline de projetos
│   │       ├── Experience.tsx    # 💼 Timeline de experiências
│   │       ├── Contact.tsx       # 📬 Formulário de contato
│   │       ├── Footer.tsx        # 📋 Rodapé
│   │       ├── /figma            # 🖼️ Componentes auxiliares (Figma)
│   │       └── /ui               # 🧱 Componentes base (Radix/shadcn)
│   │
│   ├── /i18n                     # 🌐 Sistema de internacionalização
│   │   ├── types.ts              # 📝 Interfaces TypeScript das traduções
│   │   ├── pt.ts                 # 🇧🇷 Locale Português
│   │   ├── en.ts                 # 🇺🇸 Locale Inglês
│   │   ├── LanguageContext.tsx   # 🌐 Provider + hook useTranslation()
│   │   └── index.ts              # 📤 Barrel exports
│   │
│   └── /styles                   # 🎨 Estilos globais
│       ├── index.css             # 📄 Importação principal
│       ├── fonts.css             # ✒️ Declarações de fontes
│       ├── tailwind.css          # 🎨 Configuração Tailwind
│       └── theme.css             # 🎨 Variáveis CSS base
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

| Variante | Idioma | Descrição |
| :---: | :---: | :--- |
| 🌑 Dark Mode | PT-BR | Tema escuro com textos em português |
| 🌑 Dark Mode | EN | Tema escuro com textos em inglês |
| ☀️ Light Mode | PT-BR | Tema claro com textos em português |
| ☀️ Light Mode | EN | Tema claro com textos em inglês |

> Para visualizar a aplicação localmente, execute `npm run dev` e acesse **http://localhost:5173**.

---

## 🎨 Wireframes / Figma

Os wireframes do projeto foram criados no Figma utilizando o plugin **html.to.design**, que importa a aplicação web real diretamente como layers editáveis. As 4 variantes (Dark/Light × PT/EN) foram capturadas e estão disponíveis tanto no Figma quanto como arquivos `.h2d` no repositório.

🔗 **Link do Figma:** [Portfolio — Figma](https://www.figma.com/design/n4aTrwdn8f4mY0tkjoDJbA/Portfolio?node-id=0-1&t=xJEvwMZFZLo1szeY-1)

### Arquivos `.h2d` (html.to.design)

Os arquivos exportados ficam na pasta [`figma_screens/`](figma_screens/):

| Arquivo | Tema | Idioma |
| :--- | :---: | :---: |
| `PortfolioDark.h2d` | 🌑 Dark | 🇧🇷 PT-BR |
| `PorfolioDarkENG.h2d` | 🌑 Dark | 🇺🇸 EN |
| `PortfolioLight.h2d` | ☀️ Light | 🇧🇷 PT-BR |
| `PortfolioLightENG.h2d` | ☀️ Light | 🇺🇸 EN |

---

## 🔗 Documentações Utilizadas

- 📖 **React:** [Documentação Oficial](https://react.dev/reference/react)
- 📖 **Vite:** [Guia de Configuração](https://vitejs.dev/config/)
- 📖 **Tailwind CSS v4:** [Documentação Oficial](https://tailwindcss.com/docs)
- 📖 **TypeScript:** [Handbook](https://www.typescriptlang.org/docs/handbook/)
- 📖 **Lucide Icons:** [Referência de Ícones](https://lucide.dev/icons/)
- 📖 **Radix UI:** [Documentação de Componentes](https://www.radix-ui.com/primitives/docs/overview/introduction)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub |
|---------|-----------------|
| Pedro Carbonaro | [![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=flat-square&logo=github)](https://github.com/pedrocarbonaro) |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`).
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request (PR)**.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina de **Laboratório de Desenvolvimento de Software** — PUC Minas.

---
