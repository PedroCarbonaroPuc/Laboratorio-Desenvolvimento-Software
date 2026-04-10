# Diagrama de Componentes do Sistema — RentACar

## 1. Visão Geral

O sistema RentACar é composto por três grandes componentes de implantação: **Frontend** (SPA React), **Backend** (API REST Micronaut) e **Banco de Dados** (MongoDB). O diagrama abaixo detalha os componentes internos de cada camada e suas dependências.

---

## 2. Diagrama de Componentes (Mermaid)

```mermaid
graph TB
    subgraph Frontend["🖥️ Frontend (React + TypeScript)"]
        direction TB
        subgraph Pages["Páginas"]
            AuthPages["Auth\n(Login / Register)"]
            ClientPages["Client\n(Dashboard, Vehicles, Orders)"]
            AgentPages["Agent\n(Dashboard, Vehicles, Orders)"]
            AdminPages["Admin\n(Dashboard, Details, LoadTests)"]
        end

        subgraph FEComponents["Componentes Compartilhados"]
            Navbar["Navbar"]
            Sidebar["Sidebar"]
            Modal["Modal / Forms"]
            Layouts["Layouts\n(AuthLayout, AppLayout)"]
        end

        subgraph FEServices["Camada de Serviço"]
            AuthAPI["auth.api"]
            VehiclesAPI["vehicles.api"]
            OrdersAPI["orders.api"]
            ContractsAPI["contracts.api"]
            AdminAPI["admin.api"]
            LoadTestAPI["loadtest.api"]
            AxiosInstance["Axios Instance\n(Interceptors + JWT)"]
        end

        subgraph FEContexts["Contextos"]
            AuthContext["AuthContext\n(JWT + Roles)"]
            ThemeContext["ThemeContext\n(Dark/Light)"]
        end

        Pages --> FEComponents
        Pages --> FEServices
        Pages --> FEContexts
        FEServices --> AxiosInstance
    end

    subgraph Backend["⚙️ Backend (Micronaut + Java 21)"]
        direction TB
        subgraph Controllers["Controller Layer"]
            AuthCtrl["AuthController\n/api/auth"]
            ClientCtrl["ClientController\n/api/clients"]
            AgentCtrl["AgentController\n/api/agents"]
            AdminCtrl["AdminController\n/api/admin"]
            VehicleCtrl["VehicleController\n/api/vehicles"]
            OrderCtrl["RentalOrderController\n/api/rental-orders"]
            ContractCtrl["CreditContractController\n/api/credit-contracts"]
            LoadTestCtrl["LoadTestController\n/api/load-tests"]
        end

        subgraph Services["Service Layer"]
            AuthSvc["AuthService"]
            ClientSvc["ClientService"]
            AgentSvc["AgentService"]
            AdminSvc["AdminService"]
            VehicleSvc["VehicleService"]
            OrderSvc["RentalOrderService"]
            ContractSvc["CreditContractService"]
            LoadTestSvc["LoadTestService"]
        end

        subgraph Security["Security Layer"]
            JwtProvider["JwtTokenProvider\n(Geração JWT)"]
            JwtValidator["JwtTokenValidator\n(Validação JWT)"]
            PwdEncoder["PasswordEncoder\n(BCrypt)"]
        end

        subgraph Repositories["Repository Layer"]
            UserRepo["UserRepository"]
            VehicleRepo["VehicleRepository"]
            OrderRepo["RentalOrderRepository"]
            ContractRepo["CreditContractRepository"]
        end

        subgraph Models["Domain Model"]
            UserModel["User\n(Client/Agent/Admin)"]
            VehicleModel["Vehicle"]
            OrderModel["RentalOrder"]
            ContractModel["CreditContract"]
            EmbeddedModels["Address, Employer,\nFinancialAnalysis"]
            Enums["UserRole, OrderStatus,\nOwnerType, ContractStatus"]
        end

        subgraph Config["Configuração"]
            DataSeeder["DataSeeder\n(Seed inicial)"]
        end

        subgraph ExceptionHandling["Tratamento de Erros"]
            GlobalHandler["GlobalExceptionHandler"]
            CustomExceptions["BusinessException\nResourceNotFoundException\nUnauthorizedException"]
        end

        Controllers --> Services
        Controllers --> Security
        Services --> Repositories
        Services --> Security
        Repositories --> Models
        Config --> Repositories
        Config --> Security
    end

    subgraph Database["🗄️ MongoDB"]
        UsersCol[("users")]
        VehiclesCol[("vehicles")]
        OrdersCol[("rental_orders")]
        ContractsCol[("credit_contracts")]
    end

    AxiosInstance -->|"HTTP/REST\nJSON + Bearer JWT"| Controllers
    Repositories -->|"Micronaut Data\nMongoDB Driver"| Database
    LoadTestSvc -->|"Reactive Streams\nMongoDB Driver"| Database

    style Frontend fill:#e8f4fd,stroke:#2196F3
    style Backend fill:#fff3e0,stroke:#FF9800
    style Database fill:#e8f5e9,stroke:#4CAF50
```

---

## 3. Descrição dos Componentes

### 3.1 Frontend (React + TypeScript + Vite)

| Componente | Responsabilidade |
|---|---|
| **Páginas (Pages)** | Telas principais organizadas por role: Auth, Client, Agent, Admin |
| **Componentes Compartilhados** | Navbar, Sidebar, Modal, Formulários reutilizáveis |
| **Camada de Serviço (API)** | Módulos de comunicação HTTP com o backend via Axios |
| **Contextos** | Gerenciamento de estado global (autenticação e tema) |

### 3.2 Backend (Micronaut + Java 21)

| Componente | Responsabilidade |
|---|---|
| **Controllers** | Exposição dos endpoints REST, validação de entrada, autorização via `@Secured` |
| **Services** | Lógica de negócio, orquestração de operações |
| **Security** | Geração/validação JWT, encoding de senhas com BCrypt |
| **Repositories** | Acesso a dados via Micronaut Data MongoDB (`@MongoRepository`) |
| **Domain Model** | Entidades persistidas (User, Vehicle, RentalOrder, CreditContract) e value objects |
| **Config** | Seed de dados iniciais no startup da aplicação |
| **Exception Handling** | Tratamento global de erros com respostas padronizadas |

### 3.3 Banco de Dados (MongoDB 7)

| Collection | Entidade | Descrição |
|---|---|---|
| `users` | User | Todos os usuários (Client, Agent, Admin) diferenciados pelo campo `role` |
| `vehicles` | Vehicle | Veículos disponíveis para aluguel |
| `rental_orders` | RentalOrder | Pedidos de aluguel com análise financeira embutida |
| `credit_contracts` | CreditContract | Contratos de crédito vinculados a pedidos aprovados |

---

## 4. Fluxos Principais

### 4.1 Autenticação
```
Frontend → AuthController → AuthService → UserRepository → MongoDB
                                        → JwtTokenProvider (gera token)
                                        → PasswordEncoder (valida senha)
```

### 4.2 Criação de Pedido de Aluguel
```
Frontend → RentalOrderController → RentalOrderService → RentalOrderRepository → MongoDB
                                                       → VehicleService (verifica disponibilidade)
                                                       → ClientService (valida cliente)
```

### 4.3 Teste de Carga (SSE)
```
Frontend → LoadTestController → LoadTestService
                               ├─ Sync: VehicleRepository + RentalOrderRepository (bloqueante)
                               └─ Reactive: MongoClient Reactive Streams (não-bloqueante)
           ← Server-Sent Events (Flux<Event<LoadTestEvent>>)
```
