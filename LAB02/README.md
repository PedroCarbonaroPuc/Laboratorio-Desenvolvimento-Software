<!-- [![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo) [![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999)
-->

<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# 🚗 RentACar — Sistema de Aluguel de Carros 👨‍💻

> [!NOTE]
> Sistema completo de aluguel de automóveis com avaliação financeira e gestão de contratos de crédito. **Conectando clientes a veículos com segurança e praticidade.**

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>RentACar</b> é um sistema web full-stack para gerenciamento de aluguel de automóveis, desenvolvido como projeto acadêmico na disciplina de <i>Laboratório de Desenvolvimento de Software</i> da <a href="https://www.pucminas.br/">PUC Minas</a>. O sistema permite que <b>clientes</b> consultem veículos disponíveis, criem pedidos de aluguel e acompanhem o status de suas solicitações, enquanto <b>agentes (empresas)</b> avaliam financeiramente os pedidos, aprovam ou rejeitam contratos e gerenciam a frota de veículos. O <b>administrador geral (dono da empresa)</b> possui um painel completo de gestão com visão de todos os usuários, métricas do sistema e controle administrativo. Desenvolvido com <b>Java 21/Micronaut</b> no backend e <b>React/TypeScript</b> no frontend, o projeto adota boas práticas de arquitetura em camadas, autenticação JWT, banco de dados MongoDB e orquestração via Docker, promovendo uma experiência de <i>desenvolvimento profissional</i> desde a documentação até o deploy.
      </div>
    </td>
    <td>
      <div>
        <img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo RentACar" width="120px"/>
      </div>
    </td>
  </tr> 
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/) ![Java](https://img.shields.io/badge/Java-21-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Micronaut](https://img.shields.io/badge/Micronaut-4.7.6-007ec6?style=for-the-badge&logo=micronaut&logoColor=white) ![React](https://img.shields.io/badge/React-18-007ec6?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-007ec6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-7-007ec6?style=for-the-badge&logo=mongodb&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-007ec6?style=for-the-badge&logo=docker&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-007ec6?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
    - [1 Back-end (Micronaut)](#1-back-end-micronaut)
    - [2 Front-end (React, Vite)](#2-front-end-react-vite)
  - [Instalação de Dependências](#-instalação-de-dependências)
    - [Front-end (React)](#front-end-react)
    - [Back-end (Micronaut)](#back-end-micronaut)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
    - [Terminal 1: Back-end (Micronaut)](#terminal-1-back-end-micronaut)
    - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
    - [Execução Local Completa com Docker Compose](#-execução-local-completa-com-docker-compose)
    - [Passos para build, inicialização e execução](#-passos-para-build-inicialização-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
  - [Aplicação Web](#-aplicação-web)
  - [Exemplo de saída no Terminal (API)](#-exemplo-de-saída-no-terminal-api)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O **RentACar** foi criado como projeto da disciplina de **Laboratório de Desenvolvimento de Software** na PUC Minas, com o objetivo de simular um sistema real de aluguel de automóveis que engloba todo o ciclo de vida — desde a consulta de veículos disponíveis até a formalização de contratos de crédito.

- **Por que ele existe:** Atender à necessidade acadêmica de desenvolver um sistema completo (full-stack) aplicando padrões de arquitetura, boas práticas de engenharia de software e tecnologias modernas de mercado.
- **Qual problema ele resolve:** Automatiza o processo de aluguel de automóveis, incluindo cadastro de clientes e agentes, criação de pedidos, avaliação financeira, aprovação/rejeição de contratos e gestão de frota.
- **Contexto:** Projeto acadêmico com padrão profissional, simulando um ambiente real de desenvolvimento.
- **Onde pode ser utilizado:** Locadoras de veículos, concessionárias com serviço de aluguel, ou como referência para projetos de sistemas de gestão.

O sistema possui três perfis de acesso:
- **Cliente:** Pessoa física que cria pedidos de aluguel, consulta veículos e acompanha o status das solicitações.
- **Agente:** Empresa que avalia pedidos financeiramente, aprova/rejeita contratos, cadastra e gerencia veículos.
- **Admin Geral:** Dono da empresa RentACar, com painel de gestão de usuários (métricas, listagem, detalhamento de clientes/agentes, exclusão de contas) e módulo de testes de carga.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura:** Cadastro e login com JWT (JSON Web Token) e senha criptografada com BCrypt.
- 👤 **Três Perfis de Acesso:** Cliente (pessoa física), Agente (empresa) e Admin Geral (dono da empresa) com dashboards e funcionalidades específicas. Rotas protegidas por role impedem acesso cruzado entre perfis.
- 🛡️ **Painel Administrativo:** Painel de gestão de usuários para o Admin Geral com métricas, listagem, detalhamento de clientes/agentes e exclusão de contas.
- ✏️ **Edição de Perfil:** Modal para atualização de dados cadastrais acessado pela barra de navegação lateral, com campos específicos por perfil e máscaras de entrada.
- 🌓 **Modo Claro/Escuro:** Alternância de tema (dark/light mode) em toda a interface, com persistência em localStorage e detecção automática de preferência do sistema.
- 🧪 **Testes de Carga (Reactive vs Sync):** Módulo exclusivo do Admin Geral para comparação em tempo real entre Micronaut Sync (bloqueante) e Micronaut Reactive (reativo). Inclui 4 tipos de teste, streaming SSE com progresso em tempo real, métricas detalhadas (P50/P95/P99, throughput, threads, memória), barras de comparação visual, análise automática dos resultados e histórico de testes.
- 🚗 **Catálogo de Veículos:** Listagem de veículos disponíveis com busca por marca, modelo e faixa de preço.
- 📋 **Gestão de Pedidos:** Criação, consulta, modificação e cancelamento de pedidos de aluguel com cálculo automático de valores.
- 📊 **Avaliação Financeira:** Agentes analisam dados financeiros do cliente (profissão, empregadores, rendimentos) e emitem parecer.
- ✅ **Aprovação de Contratos:** Fluxo completo de aprovação/rejeição de pedidos com atualização de status em tempo real.
- 🏎️ **Gestão de Frota:** CRUD completo de veículos com controle de disponibilidade automático.
- 📄 **Contratos de Crédito:** Criação de contratos de crédito vinculados a pedidos aprovados com cálculo automático de parcelas.
- 📈 **Dashboards:** Painéis com estatísticas de pedidos, receita e indicadores para clientes e agentes.- 💰 **Máscaras de Entrada:** CPF, RG, CNPJ, telefone, CEP e valores monetários com formatação automática em tempo real.
- 🎯 **Busca de CEP:** Integração com a API ViaCEP para preenchimento automático de endereço.
- 🔀 **Multi-Tab:** Suporte a login simultâneo em múltiplas abas do navegador com sessões independentes.
- 🌱 **Dados Iniciais:** Seed automático de banco de dados com empresa, cliente, 10 veículos e 2 aluguéis ativos para testes.
---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

| Tecnologia         | Versão | Descrição                                  |
|--------------------|--------|--------------------------------------------|
| **React**          | 18.x   | Biblioteca de UI para construção de interfaces reativas |
| **TypeScript**     | 5.x    | Superset de JavaScript com tipagem estática |
| **Vite**           | 5.x    | Build tool ultrarrápida para desenvolvimento |
| **React Router**   | 6.x    | Roteamento SPA (Single Page Application)   |
| **Axios**          | 1.x    | Cliente HTTP para comunicação com a API    |
| **Tailwind CSS**   | 3.x    | Framework de estilos utilitários           |
| **Lucide React**   | 0.x    | Biblioteca de ícones moderna               |

### 🖥️ Back-end

| Tecnologia              | Versão | Descrição                                |
|-------------------------|--------|------------------------------------------|
| **Java**                | 21     | Linguagem principal (JDK)                |
| **Micronaut**           | 4.7.6  | Framework principal para API REST        |
| **Micronaut Security**  | 4.11.2 | Autenticação e autorização (Bearer JWT)   |
| **Micronaut Data MongoDB** | 4.10.5 | Acesso e mapeamento ao banco de dados |
| **Micronaut Reactor**   | 3.5.3  | Módulo reativo para testes de performance |
| **MongoDB Reactive Streams Driver** | 5.x | Driver reativo do MongoDB para testes |
| **Micronaut Serde Jackson** | 2.12.1 | Serialização/desserialização JSON     |
| **MongoDB**             | 7.0    | Banco de dados NoSQL orientado a documentos |
| **JWT (jjwt)**          | 0.12.5 | Geração e validação de tokens JWT        |
| **Lombok**              | 1.18.x | Redução de boilerplate em classes Java   |
| **Maven**               | 3.9.x  | Gerenciamento de dependências e build    |

### ⚙️ Infraestrutura & DevOps

| Tecnologia         | Descrição                                              |
|--------------------|--------------------------------------------------------|
| **Docker**         | Containerização de todos os serviços                   |
| **Docker Compose** | Orquestração dos containers (MongoDB + Backend + Frontend) |
| **Nginx**          | Servidor web para servir o frontend e proxy reverso    |

---

## 🏗 Arquitetura

O sistema adota uma **arquitetura cliente-servidor em camadas (Layered Architecture)** com separação clara entre Frontend (SPA) e Backend (API REST), comunicando-se via HTTP/JSON.

### Backend — Padrão em Camadas

O backend segue o padrão **Controller → Service → Repository**, com DTOs para transferência de dados e tratamento centralizado de exceções:

- **Controller:** Recebe requisições HTTP, valida entrada, delega para services e retorna DTOs.
- **Service:** Implementa regras de negócio, orquestra operações e gerencia transações.
- **Repository:** Abstrai acesso ao MongoDB via Micronaut Data.
- **Model:** Entidade unificada `User` (Client/Agent/Admin diferenciados pelo campo `role`) e objetos de valor embarcados (`Address`, `Employer`, `FinancialAnalysis`).
- **Security:** Autenticação JWT stateless com `JwtTokenValidator` e autorização baseada em roles (`CLIENT`, `AGENT`, `ADMIN`) via `@Secured`.
- **Módulo Reativo (Reactor):** Micronaut Reactor coexiste com operações síncronas para testes comparativos de performance. MongoDB Reactive Streams Driver + `LoadTestService` executam testes bloqueantes e reativos com streaming SSE em tempo real (`Flux<Event>`).

### Frontend — Componentização React

- **Pages:** Telas completas organizadas por perfil (`/auth`, `/client`, `/agent`, `/admin`).
- **Components:** Elementos de UI reutilizáveis (Layout, Common).
- **Layout — Sidebar:** Barra de navegação lateral com animação de expansão/colapso ao hover que empurra o conteúdo principal (layout flex), exibição do usuário logado e controles de perfil/logout integrados na parte inferior.
- **Contexts:** Estado global de autenticação via Context API e tema claro/escuro via ThemeContext.
- **API Layer:** Comunicação HTTP centralizada com interceptors Axios + cliente SSE nativo para testes de carga.

### Padrões de Design Adotados

- **Repository Pattern** — Abstração de acesso a dados
- **DTO Pattern** — Separação entre modelo e transporte
- **Service Layer** — Encapsulamento de regras de negócio
- **Builder Pattern** (via Lombok `@SuperBuilder`) — Construção de objetos complexos com herança
- **Interceptor Pattern** — `JwtTokenValidator` para autenticação JWT automática

### API Endpoints

| Grupo                  | Método | Endpoint                               | Acesso       |
|------------------------|--------|----------------------------------------|--------------|
| **Autenticação**       | POST   | `/api/auth/register/client`            | Público      |
|                        | POST   | `/api/auth/register/agent`             | Público      |
|                        | POST   | `/api/auth/login`                      | Público      |
| **Clientes**           | GET    | `/api/clients/me`                      | CLIENT       |
|                        | PUT    | `/api/clients/me`                      | CLIENT       |
| **Agentes**            | GET    | `/api/agents/me`                       | AGENT        |
|                        | PUT    | `/api/agents/me`                       | AGENT        |
| **Veículos**           | GET    | `/api/vehicles`                        | Autenticado  |
|                        | GET    | `/api/vehicles/{id}`                   | Autenticado  |
|                        | POST   | `/api/vehicles`                        | AGENT        |
|                        | PUT    | `/api/vehicles/{id}`                   | AGENT        |
|                        | DELETE | `/api/vehicles/{id}`                   | AGENT        |
| **Pedidos de Aluguel** | POST   | `/api/rental-orders`                   | CLIENT       |
|                        | GET    | `/api/rental-orders/my`                | CLIENT       |
|                        | GET    | `/api/rental-orders/{id}`              | Autenticado  |
|                        | PUT    | `/api/rental-orders/{id}`              | CLIENT/AGENT |
|                        | PATCH  | `/api/rental-orders/{id}/cancel`       | CLIENT       |
|                        | GET    | `/api/rental-orders/pending`           | AGENT        |
|                        | PATCH  | `/api/rental-orders/{id}/analyze`      | AGENT        |
|                        | PATCH  | `/api/rental-orders/{id}/approve`      | AGENT        |
|                        | PATCH  | `/api/rental-orders/{id}/reject`       | AGENT        |
| **Contratos**          | POST   | `/api/credit-contracts`                | AGENT        |
|                        | GET    | `/api/credit-contracts/{id}`           | Autenticado  |
|                        | GET    | `/api/credit-contracts/order/{orderId}`| Autenticado  |
| **Admin Geral**        | GET    | `/api/admin/me`                        | ADMIN        |
|                        | PUT    | `/api/admin/me`                        | ADMIN        |
|                        | GET    | `/api/admin/dashboard`                 | ADMIN        |
|                        | GET    | `/api/admin/clients/{id}`              | ADMIN        |
|                        | GET    | `/api/admin/agents/{id}`               | ADMIN        |
|                        | DELETE | `/api/admin/users/{id}`                | ADMIN        |
| **Testes de Carga**    | POST   | `/api/load-tests/run`                  | ADMIN (SSE)  |

---

## 🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK:** Versão **21** ou superior (necessário para o Back-end Micronaut)
* **Node.js:** Versão LTS (v18.x ou superior) (necessário para o Front-end React)
* **Gerenciador de Pacotes:** npm
* **Docker & Docker Compose** (recomendado para execução completa)
* **MongoDB:** Versão 7.x (ou via Docker)

---

### 🔑 Variáveis de Ambiente

#### 1 Back-end (Micronaut)

Configure no `application.yml` ou como variáveis de ambiente do sistema:

| Variável                     | Descrição                          | Padrão                                     |
|------------------------------|------------------------------------|----------------------------------------------|
| `MONGODB_URI`                | URI de conexão com o MongoDB       | `mongodb://localhost:27017/rentacar`          |
| `JWT_SECRET`                 | Chave secreta para assinatura JWT  | (chave de desenvolvimento, alterar em prod)   |
| `JWT_EXPIRATION`             | Tempo de expiração do token (ms)   | `86400000` (24 horas)                         |
| `SERVER_PORT`                | Porta do servidor Micronaut       | `8080`                                        |

#### 2 Front-end (React, Vite)

O frontend se comunica com a API via URL base configurada no Axios (`http://localhost:8080/api`). Em produção com Docker, o Nginx faz proxy reverso automaticamente.

---

### 📦 Instalação de Dependências

1. **Clone o Repositório:**

```bash
git clone <URL_DO_SEU_REPOSITÓRIO>
cd LAB02
```

2. **Instale as Dependências:**

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Micronaut)

O Micronaut utiliza o **Maven Wrapper** (`./mvnw`) para gerenciar dependências:

```bash
cd backend
./mvnw clean install
cd ..
```

---

### ⚡ Como Executar a Aplicação

Execute a aplicação em modo de desenvolvimento em **dois terminais separados** (com MongoDB rodando via Docker ou localmente).

#### Terminal 1: Back-end (Micronaut)

```bash
cd backend
./mvnw mn:run
```
🚀 *O Back-end estará disponível em **http://localhost:8080**.*

---

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm run dev
```
🎨 *O Front-end estará disponível em **http://localhost:3000**.*

---

#### 🐳 Execução Local Completa com Docker Compose

Para executar todos os serviços (MongoDB + Backend + Frontend) de uma só vez, o projeto inclui scripts de orquestração na pasta `docker/`.

Antes de tudo, certifique-se de que o **Docker Desktop** (no Mac/Windows) ou o **serviço Docker** (em Linux) está em execução.

- **No Mac/Windows**: basta abrir o aplicativo **Docker Desktop**.
- **No Linux**: rode o comando abaixo para iniciar o serviço:

```bash
sudo systemctl start docker
```

---

#### 📦 Passos para build, inicialização e execução

1. Acesse a pasta `docker/` do projeto:

```bash
cd docker
```

2. Suba todos os serviços com o script fornecido:

```bash
./docker-up.sh
```

> [!NOTE]
> 💡 O script executa `docker compose up -d --build`, garantindo que as imagens mais recentes sejam construídas e os containers rodem em segundo plano.

3. Verifique se os containers estão rodando:

```bash
docker ps
```

4. Abra no navegador:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080
   - **MongoDB:** localhost:27017

> [!TIP]
> 🌱 Na primeira execução, o sistema cria automaticamente dados iniciais de teste. As credenciais são exibidas nos logs do backend:
> ```
> docker logs rentacar-backend | tail -20
> ```
> **Credenciais padrão:**
> | Perfil      | E-mail                  | Senha       |
> |-------------|-------------------------|-------------|
> | Admin Geral | admin@rentacar.com      | admin123    |
> | Agente      | empresa@rentacar.com    | agent123    |
> | Cliente     | cliente@rentacar.com    | client123   |
>
> 🔀 **Multi-Tab:** Cada aba do navegador mantém sessão independente, permitindo testar os três perfis simultaneamente.

5. Para parar e remover todos os containers:

```bash
./docker-down.sh
```

✅ **Em resumo:** Usar **Docker Compose** simplifica a execução do ambiente completo, isolando as dependências de **Java 21 (Micronaut)**, **Node.js (React)** e **MongoDB** em containers independentes.

---

## 📂 Estrutura de Pastas

```
.
├── .gitignore                   # 🧹 Ignora arquivos não versionados.
├── README.md                    # 📘 Documentação principal do projeto.
│
├── /docs                        # 📚 Documentação técnica do sistema
│   ├── /modelagem
│   │   ├── casos-de-uso.md      # 📋 Diagrama e especificação de 16 casos de uso
│   │   ├── historias-usuario.md  # 📖 20 histórias de usuário em 10 épicos (108 story points)
│   │   ├── diagrama-classes.md   # 🧬 Diagrama de classes com entidade User unificada
│   │   ├── diagrama-pacotes.md   # 📦 Diagramas de pacotes (backend e frontend)
│   │   ├── diagrama-componentes.md # 🔧 Diagrama de componentes do sistema
│   │   └── diagrama-implantacao.md # 🚀 Diagrama de implantação (Docker)
│   ├── /backend
│   │   └── arquitetura.md       # 🖥️ Arquitetura, endpoints e segurança do backend
│   └── /frontend
│       └── arquitetura.md       # 💻 Arquitetura, roteamento e design system do frontend
│
├── /backend                     # 📁 API REST Micronaut
│   ├── .gitignore               # 🧹 Ignora target/, .idea/, .env
│   ├── Dockerfile               # 🐳 Build multi-stage (JDK 21 → JRE 21)
│   ├── pom.xml                  # 🛠️ Dependências Maven (Micronaut BOM)
│   └── /src/main/java/com/rentacar
│       ├── RentACarApplication.java
│       ├── /config              # 🔧 DataSeeder (seed de dados iniciais)
│       ├── /controller          # 🎮 8 REST Controllers (@Controller, @Secured)
│       ├── /dto
│       │   ├── /request         # ✉️ 8 Request DTOs com validação Jakarta
│       │   ├── /response        # ✉️ 11 Response DTOs (@Serdeable)
│       │   └── /loadtest        # 📊 3 DTOs para testes de carga
│       ├── /exception           # 💥 GlobalExceptionHandler (@Error global) + exceções customizadas
│       ├── /model               # 🧬 Entidades (User unificado, Vehicle, RentalOrder, CreditContract)
│       │   └── /enums           # 📊 UserRole, OrderStatus, OwnerType, ContractStatus
│       ├── /repository          # 🗄️ 4 Repositórios Micronaut Data MongoDB (@MongoRepository)
│       ├── /security            # 🛡️ JwtTokenProvider, JwtTokenValidator, PasswordEncoder
│       └── /service             # ⚙️ 8 Services (@Singleton) com regras de negócio
│
├── /frontend                    # 📁 SPA React/TypeScript
│   ├── .gitignore               # 🧹 Ignora node_modules/, dist/, .env
│   ├── Dockerfile               # 🐳 Build multi-stage (Node 20 → Nginx)
│   ├── nginx.conf               # 🌐 SPA fallback + proxy reverso para API
│   ├── package.json             # 📦 Dependências e scripts
│   ├── vite.config.ts           # ⚡ Configuração Vite
│   ├── tailwind.config.js       # 🎨 Design system customizado
│   ├── tsconfig.json            # 📝 Configuração TypeScript
│   └── /src
│       ├── App.tsx              # 🗺️ Router principal com rotas protegidas por role
│       ├── main.tsx             # 🚀 Entry point React 18
│       ├── index.css            # 🎨 Tailwind layers + componentes customizados
│       ├── /api                 # 🔌 Camada HTTP (Axios instance + 7 módulos de API: auth, vehicles, orders, contracts, admin, profile, loadtest)
│       ├── /components
│       │   ├── /common          # 🧱 Badge, Loading, Modal, Navbar, ProfessionSelect, AddressForm, CarIllustration, ProfileEditModal
│       │   └── /layout          # 📐 AppLayout, AuthLayout, Sidebar
│       ├── /contexts            # 🔑 AuthContext (JWT + roles), ThemeContext (modo claro/escuro)
│       ├── /pages
│       │   ├── /auth            # 🔐 Login, Register (multi-step)
│       │   ├── /client          # 👤 Dashboard, VehicleList, MyOrders
│       │   ├── /agent           # 🏢 Dashboard, OrderManagement, VehicleManagement
│       │   └── /admin           # 🛡️ Usuários (gestão), ClientDetail, AgentDetail, LoadTests (testes de carga)
│       ├── /types               # 📋 TypeScript interfaces
│       └── /utils               # 🛠️ Formatadores (moeda, data, CPF, CNPJ, status) e máscaras de input
│
└── /docker                      # 🐳 Orquestração Docker
    ├── .gitignore               # 🧹 Ignora .env
    ├── docker-compose.yml       # 📄 MongoDB + Backend + Frontend
    ├── docker-up.sh             # 🟢 Script para subir todos os containers
    └── docker-down.sh           # 🔴 Script para parar todos os containers
```

---

### 💻 Exemplo de saída no Terminal (API)

#### 1. Cadastro de Cliente

```bash
curl -X POST 'http://localhost:8080/api/auth/register/client' \
     -H 'Content-Type: application/json' \
     -d '{
       "email": "cliente@email.com",
       "password": "senha12345",
       "name": "João Silva",
       "cpf": "12345678901",
       "rg": "MG1234567",
       "profession": "Engenheiro",
       "address": {
         "street": "Rua das Flores",
         "number": "123",
         "neighborhood": "Centro",
         "city": "Belo Horizonte",
         "state": "MG",
         "zipCode": "30100000"
       },
       "employers": [
         { "name": "Tech Corp", "phone": "31999999999", "income": 8500.00 }
       ]
     }'
```

**Saída Esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "CLIENT",
  "name": "João Silva"
}
```

#### 2. Login

```bash
curl -X POST 'http://localhost:8080/api/auth/login' \
     -H 'Content-Type: application/json' \
     -d '{ "email": "cliente@email.com", "password": "senha12345" }'
```

**Saída Esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "CLIENT",
  "name": "João Silva"
}
```

#### 3. Listar Veículos Disponíveis

```bash
curl -X GET 'http://localhost:8080/api/vehicles' \
     -H 'Authorization: Bearer <seu-jwt-token>'
```

**Saída Esperada:**
```json
[
  {
    "id": "6650a1b2c3d4e5f6a7b8c9d0",
    "registrationNumber": "ABC-1234",
    "year": 2024,
    "brand": "Toyota",
    "model": "Corolla",
    "licensePlate": "BRA2E19",
    "ownerType": "COMPANY",
    "dailyRate": 250.00,
    "available": true
  }
]
```

---

## 🔗 Documentações utilizadas

* 📖 **React:** [Documentação Oficial do React](https://react.dev/reference/react)
* 📖 **Vite:** [Guia de Configuração do Vite](https://vitejs.dev/config/)
* 📖 **Micronaut:** [Documentação Oficial do Micronaut](https://docs.micronaut.io/latest/guide/)
* 📖 **Micronaut Security:** [Documentação do Micronaut Security](https://micronaut-projects.github.io/micronaut-security/latest/guide/)
* 📖 **Micronaut Data MongoDB:** [Documentação do Micronaut Data MongoDB](https://micronaut-projects.github.io/micronaut-data/latest/guide/#mongo)
* 📖 **Tailwind CSS:** [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
* 📖 **Docker:** [Documentação de Referência do Docker](https://docs.docker.com/)
* 📖 **JWT (jjwt):** [Documentação do JJWT](https://github.com/jwtk/jjwt)
* 📖 **MongoDB:** [Manual do MongoDB](https://www.mongodb.com/docs/manual/)
* 📖 **Conventional Commits:** [Padrão de Mensagens de Commit](https://www.conventionalcommits.org/en/v1.0.0/)
* 📖 **Documentação Interna do Projeto:**
  * [Casos de Uso](./docs/modelagem/casos-de-uso.md)
  * [Histórias de Usuário](./docs/modelagem/historias-usuario.md)
  * [Diagrama de Classes](./docs/modelagem/diagrama-classes.md)
  * [Diagrama de Pacotes](./docs/modelagem/diagrama-pacotes.md)
  * [Diagrama de Componentes](./docs/modelagem/diagrama-componentes.md)
  * [Diagrama de Implantação](./docs/modelagem/diagrama-implantacao.md)
  * [Arquitetura Backend](./docs/backend/arquitetura.md)
  * [Arquitetura Frontend](./docs/frontend/arquitetura.md)


---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos valiosos ensinamentos sobre **Arquitetura de Software** e **Padrões de Projeto** na disciplina de Laboratório de Desenvolvimento de Software.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.

---