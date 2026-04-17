# Diagrama de Pacotes (Visão Lógica) — Sistema de Aluguel de Carros

## 1. Visão Geral da Arquitetura

O sistema segue uma arquitetura **cliente-servidor** com separação clara entre Frontend (SPA) e Backend (API REST), comunicando-se via HTTP/JSON. O banco de dados MongoDB é utilizado para persistência.

```mermaid
graph TB
    subgraph "Camada de Apresentação"
        FE[Frontend - React/TypeScript]
    end

    subgraph "Camada de Aplicação"
        BE[Backend - Micronaut/Java]
    end

    subgraph "Camada de Dados"
        DB[(MongoDB)]
    end

    FE -->|"HTTPS/REST\nJSON + Bearer JWT\n«IRestAPI»"| BE
    BE -->|"MongoDB Wire Protocol\nMicronaut Data\n«IDataStore»"| DB
```

### Visualização do Diagrama — Visão Geral

![Diagrama de Pacotes](images/DiagramaDePacotes.png)

---

## 2. Diagrama de Pacotes — Backend (Java/Micronaut)

```mermaid
graph TB
    subgraph "com.rentacar"
        direction TB

        subgraph "controller"
            AuthController
            ClientController
            AgentController
            AdminController
            VehicleController
            RentalOrderController
            CreditContractController
            LoadTestController
        end

        subgraph "dto"
            subgraph "dto.request"
                LoginRequest
                RegisterClientRequest
                RegisterAgentRequest
                CreateRentalOrderRequest
                UpdateRentalOrderRequest
                FinancialAnalysisRequest
                CreateVehicleRequest
                CreateCreditContractRequest
            end
            subgraph "dto.response"
                AuthResponse
                ClientResponse
                AgentResponse
                AdminResponse
                UserSummaryResponse
                AdminDashboardResponse
                AdminClientDetailResponse
                AdminAgentDetailResponse
                VehicleResponse
                RentalOrderResponse
                CreditContractResponse
            end
            subgraph "dto.loadtest"
                LoadTestRequest
                LoadTestResult
                LoadTestEvent
            end
        end

        subgraph "service"
            AuthService
            ClientService
            AgentService
            AdminService
            VehicleService
            RentalOrderService
            CreditContractService
            LoadTestService
        end

        subgraph "repository"
            UserRepository
            VehicleRepository
            RentalOrderRepository
            CreditContractRepository
        end

        subgraph "model"
            User
            Vehicle
            RentalOrder
            CreditContract
            Address
            Employer
            FinancialAnalysis
            subgraph "model.enums"
                UserRole
                OrderStatus
                OwnerType
                ContractStatus
            end
        end

        subgraph "security"
            JwtTokenProvider
            JwtTokenValidator
            PasswordEncoder
        end

        subgraph "config"
            DataSeeder
        end

        subgraph "exception"
            GlobalExceptionHandler
            ResourceNotFoundException
            BusinessException
            UnauthorizedException
        end
    end

    controller --> dto
    controller -->|"«usa»\nIService"| service
    service -->|"«usa»\nIRepository"| repository
    service -->|"«usa»\nIDomainModel"| model
    repository -->|"«usa»\nIDomainModel"| model
    controller -->|"«usa»\nISecurityProvider"| security
    security --> config
```

### Visualização do Diagrama — Backend

![Diagrama de Pacotes Backend](images/DiagramaDePacotesBackend.png)

---

## 3. Diagrama de Pacotes — Frontend (React/TypeScript)

```mermaid
graph TB
    subgraph "src/"
        direction TB

        subgraph "pages"
            subgraph "pages/auth"
                LoginPage
                RegisterPage
            end
            subgraph "pages/client"
                ClientDashboard
                VehicleListPage
                MyOrdersPage
                OrderDetailsPage
            end
            subgraph "pages/agent"
                AgentDashboard
                OrderManagementPage
                VehicleManagementPage
                OrderEvaluationPage
            end
            subgraph "pages/admin"
                AdminDashboardPage
                AdminClientDetailPage
                AdminAgentDetailPage
                LoadTestsPage
            end
        end

        subgraph "components"
            subgraph "components/common"
                Button
                Input
                Modal
                Card
                Table
                Badge
                Loading
                Navbar
                ProfileEditModal
            end
            subgraph "components/layout"
                AppLayout
                AuthLayout
                Sidebar
            end
            subgraph "components/forms"
                RentalOrderForm
                VehicleForm
            end
        end

        subgraph "api"
            AxiosInstance
            AuthAPI
            VehiclesAPI
            OrdersAPI
            ContractsAPI
            AdminAPI
            ProfileAPI
            LoadTestAPI
        end

        subgraph "contexts"
            AuthContext
            ThemeContext
        end

        subgraph "hooks"
            useAuth
            useApi
        end

        subgraph "types"
            TypeDefinitions
        end

        subgraph "utils"
            Formatters
            Validators
            Masks
            Professions
        end
    end

    pages -->|"«usa»\nIComponent"| components
    pages -->|"«usa»\nIApiService"| api
    pages -->|"«usa»\nIHook"| hooks
    pages -->|"«usa»\nIContext"| contexts
    components -->|"«usa»\nIType"| types
    api -->|"«usa»\nIType"| types
    hooks -->|"«usa»\nIApiService"| api
    hooks -->|"«usa»\nIContext"| contexts
```

### Visualização do Diagrama — Frontend

![Diagrama de Pacotes Frontend](images/DiagramaDePacotesFrontend.png)

---

## 4. Dependências entre Camadas

### Backend — Fluxo de Dependências

```
Controller → DTO (Request/Response)
Controller → Service
Service → Repository
Service → Model
Service → Exception
Repository → Model
Security → Config
Controller → Security (via annotations)
```

**Princípios aplicados:**
- **Inversão de Dependência (DIP):** Services dependem de abstrações (interfaces de repositórios Micronaut Data).
- **Responsabilidade Única (SRP):** Cada camada tem responsabilidade bem definida.
- **Separação de Concerns:** Controllers não acessam repositórios diretamente.

### Frontend — Fluxo de Dependências

```
Pages → Components (UI reutilizável)
Pages → Hooks (lógica reutilizável)
Pages → API (chamadas HTTP)
Hooks → Contexts (estado global de auth)
Hooks → API
API → Types (tipagem strong)
Components → Types
```

**Princípios aplicados:**
- **Composição:** Componentes são compostos para formar páginas.
- **Custom Hooks:** Lógica de negócio encapsulada em hooks reutilizáveis.
- **Context API:** Estado de autenticação compartilhado globalmente.
- **Type Safety:** Tipagem estrita com TypeScript em toda a aplicação.

---

## 5. Responsabilidades das Camadas

| Camada (Backend)    | Responsabilidade                                                                 |
|---------------------|----------------------------------------------------------------------------------|
| **controller**      | Receber requisições HTTP, validar entrada, delegar para services, retornar DTOs  |
| **service**         | Implementar regras de negócio, orquestrar operações, gerenciar transações        |
| **repository**      | Abstrair acesso ao MongoDB via Micronaut Data                                    |
| **model**           | Representar entidades do domínio e objetos de valor                              |
| **dto**             | Transferir dados entre camadas sem expor entidades                               |
| **security**        | Autenticação JWT, autorização baseada em roles                                   |
| **config**          | Seed de dados iniciais na inicialização da aplicação                             |
| **exception**       | Tratamento centralizado de exceções com respostas padronizadas                   |

| Camada (Frontend)   | Responsabilidade                                                                 |
|---------------------|----------------------------------------------------------------------------------|
| **pages**           | Telas completas da aplicação, composição de componentes                          |
| **components**      | Elementos de UI reutilizáveis e stateless                                        |
| **api**             | Comunicação HTTP com o backend via Axios                                         |
| **contexts**        | Estado global compartilhado (autenticação)                                       |
| **hooks**           | Lógica reutilizável e efeitos colaterais                                         |
| **types**           | Definições TypeScript para tipagem forte                                         |
| **utils**           | Funções utilitárias (formatação, validação)                                      |
