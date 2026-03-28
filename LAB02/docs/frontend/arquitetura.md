# Documentação do Frontend — Sistema de Aluguel de Carros

## 1. Stack Tecnológica

| Tecnologia         | Versão  | Descrição                              |
|--------------------|---------|----------------------------------------|
| TypeScript         | 5.x     | Linguagem principal                    |
| React              | 18.x    | Biblioteca de UI                       |
| Vite               | 5.x     | Build tool e dev server                |
| React Router       | 6.x     | Roteamento SPA                         |
| Axios              | 1.x     | Cliente HTTP                           |
| Tailwind CSS       | 3.x     | Framework de estilos utilitários       |
| Lucide React       | 0.x     | Biblioteca de ícones                   |
| React Hook Form    | 7.x     | Gerenciamento de formulários           |
| Zod                | 3.x     | Validação de schemas                   |

## 2. Estrutura de Diretórios

```
src/
├── api/                    # Comunicação com o backend
│   ├── axios.ts            # Instância Axios configurada
│   ├── auth.api.ts         # Endpoints de autenticação
│   ├── vehicles.api.ts     # Endpoints de veículos
│   ├── orders.api.ts       # Endpoints de pedidos
│   ├── contracts.api.ts    # Endpoints de contratos
│   ├── admin.api.ts        # Endpoints de administração (dashboard, detalhes, exclusão)
│   ├── profile.api.ts      # Endpoints de edição de perfil (cliente/agente)
│   └── loadtest.api.ts     # Cliente SSE para testes de carga (fetch streaming)
├── components/             # Componentes reutilizáveis
│   ├── common/             # Botões, inputs, modais, badges, ProfessionSelect, AddressForm, CarIllustration, ProfileEditModal
│   ├── layout/             # AppLayout, AuthLayout, Sidebar (collapsible hover)
│   └── forms/              # Formulários de domínio
├── contexts/               # Contextos React
│   ├── AuthContext.tsx      # Autenticação global
│   └── ThemeContext.tsx     # Modo claro/escuro (dark mode)
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          # Hook de autenticação
│   └── useApi.ts           # Hook para chamadas API
├── pages/                  # Páginas da aplicação
│   ├── auth/               # Login e Registro
│   ├── client/             # Dashboard, veículos, pedidos
│   ├── agent/              # Dashboard, gestão de pedidos e veículos
│   └── admin/              # Usuários (gestão), ClientDetail, AgentDetail, LoadTests
├── types/                  # Definições TypeScript
│   └── index.ts
├── utils/                  # Utilitários
│   ├── formatters.ts       # Formatação de valores
│   ├── masks.ts            # Máscaras de input (CPF, CNPJ, moeda, CEP, telefone)
│   ├── professions.ts      # Lista de profissões brasileiras
│   └── validators.ts       # Validadores de CPF, CNPJ
├── App.tsx                 # Componente raiz com rotas
├── main.tsx                # Ponto de entrada
└── index.css               # Estilos globais (Tailwind)
```

## 3. Roteamento

| Rota                         | Componente              | Acesso       |
|------------------------------|-------------------------|--------------|
| `/login`                     | LoginPage               | Público      |
| `/register`                  | RegisterPage            | Público      |
| `/client/dashboard`          | ClientDashboard         | CLIENT       |
| `/client/vehicles`           | VehicleListPage         | CLIENT       |
| `/client/orders`             | MyOrdersPage            | CLIENT       |
| `/client/orders/:id`         | OrderDetailsPage        | CLIENT       |
| `/agent/dashboard`           | AgentDashboard          | AGENT        |
| `/agent/orders`              | OrderManagementPage     | AGENT        |
| `/agent/orders/:id/evaluate` | OrderEvaluationPage     | AGENT        |
| `/agent/vehicles`            | VehicleManagementPage   | AGENT        |
| `/admin/dashboard`           | Redireciona para `/admin/users` | ADMIN        |
| `/admin/users`               | AdminDashboard (Usuários) | ADMIN        |
| `/admin/clients/:id`         | AdminClientDetail       | ADMIN        |
| `/admin/agents/:id`          | AdminAgentDetail        | ADMIN        |
| `/admin/load-tests`          | LoadTests               | ADMIN        |

> **Proteção por Role:** Todas as rotas protegidas utilizam o componente `RoleGuard`, que verifica se o `user.role` do token JWT corresponde ao perfil exigido. Caso um usuário tente acessar uma rota de outro perfil (ex.: admin acessando `/agent/dashboard`), ele é automaticamente redirecionado para a página inicial do seu perfil.

## 4. Design System

### Paleta de Cores

| Nome            | Hex       | Uso                                    |
|-----------------|-----------|----------------------------------------|
| Primary         | `#0F172A` | Backgrounds principais, textos         |
| Primary Light   | `#1E293B` | Cards, sidebars                        |
| Accent          | `#3B82F6` | Botões primários, links, destaques     |
| Accent Hover    | `#2563EB` | Hover em elementos interativos         |
| Success         | `#10B981` | Status aprovado, confirmações          |
| Warning         | `#F59E0B` | Status em análise, alertas             |
| Danger          | `#EF4444` | Status rejeitado/cancelado, erros      |
| Surface         | `#F8FAFC` | Backgrounds de páginas                 |
| Surface Alt     | `#F1F5F9` | Backgrounds alternados                 |
| Border          | `#E2E8F0` | Bordas de cards e inputs               |
| Text Primary    | `#0F172A` | Textos principais                      |
| Text Secondary  | `#64748B` | Textos secundários                     |

### Tipografia

- **Headings:** Inter, peso 600-700
- **Body:** Inter, peso 400-500
- **Monospace:** JetBrains Mono (para dados técnicos como placas)

### Componentes Base

- **Button:** Variantes primary, secondary, outline, danger, ghost. Tamanhos sm, md, lg.
- **Input:** Com label, placeholder, mensagem de erro, ícone opcional.
- **Card:** Container com sombra suave, padding consistente, cantos arredondados.
- **Badge:** Para status dos pedidos, com cores correspondentes.
- **Table:** Responsiva, com linhas alternadas, hover, paginação.
- **Sidebar:** Barra lateral com animação de expansão/colapso ao hover (colapsada: apenas ícones `w-20`; expandida: `w-64` com labels). Utiliza layout flex (não fixo), empurrando o conteúdo principal ao expandir para um movimento fluido. Inclui navegação, perfil do usuário logado e controle de logout na parte inferior.

## 5. Estado e Autenticação

- **AuthContext** gerencia o estado de autenticação global.
- O token JWT é armazenado no `sessionStorage` (permitindo sessões independentes por aba).
- O Axios interceptor adiciona o token automaticamente em todas as requisições.
- Em caso de token expirado (401), o usuário é redirecionado para o login.
- Rotas protegidas verificam role do usuário (CLIENT/AGENT/ADMIN) via componente `RoleGuard` que bloqueia acesso cruzado entre perfis.
- Cada aba do navegador mantém uma sessão independente, permitindo login simultâneo com contas diferentes.
- O `AuthContext` expõe flags de convenências: `isClient`, `isAgent` e `isAdmin` para controle de acesso em componentes.- O `ThemeContext` gerencia o **modo claro/escuro** (dark mode) da aplicação:
  - Persiste preferência no `localStorage` (`rentacar-dark-mode`).
  - Detecta automaticamente `prefers-color-scheme: dark` do sistema na primeira visita.
  - Adiciona/remove a classe `.dark` no `<html>` para ativar as variantes `dark:` do Tailwind CSS.
  - Toggle acessível pelo botão 🌙/☀️ na Sidebar (entre perfil e logout).
  - Envolve toda a aplicação via `<ThemeProvider>` no `main.tsx`.- O componente `ProfileEditModal` permite edição de perfil por qualquer tipo de usuário, acessado pelo botão de usuário na sidebar, com campos específicos por role e máscaras de entrada (CPF, CNPJ, telefone, moeda, CEP).
- A **Sidebar** utiliza layout flex com `flex-shrink-0` e animação de largura via `transition-all duration-300`, colapsando para `w-20` (apenas ícones) e expandindo para `w-64` on hover. Ao expandir, o conteúdo principal é empurrado para a direita (push), em vez de sobreposto. O usuário logado e o botão de logout são exibidos na parte inferior da sidebar.
