# Documentação do Backend — Sistema de Aluguel de Carros

## 1. Stack Tecnológica

| Tecnologia         | Versão  | Descrição                              |
|--------------------|---------|----------------------------------------|
| Java               | 21      | Linguagem principal                    |
| Spring Boot        | 3.2.x   | Framework principal                    |
| Spring Security    | 6.x     | Autenticação e autorização             |
| Spring Data MongoDB| 4.x     | Acesso ao banco de dados               |
| Spring WebFlux     | 3.2.x   | Módulo reativo (testes de carga)       |
| Spring Data MongoDB Reactive | 4.x | Driver reativo do MongoDB      |
| MongoDB            | 7.0     | Banco de dados NoSQL                   |
| JWT (jjwt)         | 0.12.x  | Geração e validação de tokens          |
| Lombok             | 1.18.x  | Redução de boilerplate                 |
| Maven              | 3.9.x   | Gerenciamento de dependências e build  |

## 2. Estrutura de Pacotes

```
src/main/java/com/rentacar/
├── RentACarApplication.java          # Ponto de entrada
├── config/                           # Configurações Spring
│   ├── SecurityConfig.java
│   ├── MongoConfig.java
│   ├── WebConfig.java
│   └── DataSeeder.java              # Seed automático de dados iniciais
├── controller/                       # Endpoints REST
│   ├── AuthController.java
│   ├── ClientController.java
│   ├── AgentController.java
│   ├── AdminController.java
│   ├── VehicleController.java
│   ├── RentalOrderController.java
│   ├── CreditContractController.java
│   └── LoadTestController.java       # SSE streaming - testes de carga
├── dto/                              # Data Transfer Objects
│   ├── request/
│   ├── response/
│   │   ├── AuthResponse.java
│   │   └── ... (11 Response DTOs)
│   └── loadtest/                     # DTOs para testes de carga
│       ├── LoadTestRequest.java
│       ├── LoadTestResult.java
│       └── LoadTestEvent.java
│       ├── ClientResponse.java
│       ├── AgentResponse.java
│       ├── AdminResponse.java
│       ├── UserSummaryResponse.java
│       ├── AdminDashboardResponse.java
│       ├── AdminClientDetailResponse.java
│       ├── AdminAgentDetailResponse.java
│       ├── VehicleResponse.java
│       ├── RentalOrderResponse.java
│       └── CreditContractResponse.java
├── exception/                        # Tratamento de exceções
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BusinessException.java
│   └── UnauthorizedException.java
├── model/                            # Entidades do domínio
│   ├── User.java
│   ├── Client.java
│   ├── Agent.java
│   ├── Admin.java
│   ├── Vehicle.java
│   ├── RentalOrder.java
│   ├── CreditContract.java
│   ├── Address.java
│   ├── Employer.java
│   ├── FinancialAnalysis.java
│   └── enums/
├── repository/                       # Acesso ao MongoDB
│   ├── UserRepository.java
│   ├── ClientRepository.java
│   ├── AgentRepository.java
│   ├── AdminRepository.java
│   ├── VehicleRepository.java
│   ├── RentalOrderRepository.java
│   ├── CreditContractRepository.java
│   └── reactive/                     # Repositórios reativos (WebFlux)
│       ├── ReactiveVehicleRepository.java
│       └── ReactiveRentalOrderRepository.java
├── security/                         # JWT e autenticação
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
└── service/                          # Lógica de negócio
    ├── AuthService.java
    ├── ClientService.java
    ├── AgentService.java
    ├── AdminService.java
    ├── VehicleService.java
    ├── RentalOrderService.java
    ├── CreditContractService.java
    └── LoadTestService.java          # Engine de testes bloqueante vs reativo
```

## 3. API Endpoints

### 3.1 Autenticação (`/api/auth`)

| Método | Endpoint              | Descrição                    | Acesso  |
|--------|-----------------------|------------------------------|---------|
| POST   | `/api/auth/register/client` | Cadastro de cliente     | Público |
| POST   | `/api/auth/register/agent`  | Cadastro de agente      | Público |
| POST   | `/api/auth/login`           | Login                   | Público |

### 3.2 Clientes (`/api/clients`)

| Método | Endpoint              | Descrição                    | Acesso  |
|--------|-----------------------|------------------------------|---------|
| GET    | `/api/clients/me`     | Dados do cliente logado      | CLIENT  |
| PUT    | `/api/clients/me`     | Atualizar perfil             | CLIENT  |

### 3.3 Agentes (`/api/agents`)

| Método | Endpoint              | Descrição                    | Acesso  |
|--------|-----------------------|------------------------------|---------|
| GET    | `/api/agents/me`      | Dados do agente logado       | AGENT   |
| PUT    | `/api/agents/me`      | Atualizar perfil             | AGENT   |

### 3.4 Veículos (`/api/vehicles`)

| Método | Endpoint              | Descrição                    | Acesso        |
|--------|-----------------------|------------------------------|---------------|
| GET    | `/api/vehicles`       | Listar veículos disponíveis  | Autenticado   |
| GET    | `/api/vehicles/{id}`  | Detalhes do veículo          | Autenticado   |
| POST   | `/api/vehicles`       | Cadastrar veículo            | AGENT         |
| PUT    | `/api/vehicles/{id}`  | Atualizar veículo            | AGENT         |
| DELETE | `/api/vehicles/{id}`  | Remover veículo              | AGENT         |

### 3.5 Pedidos de Aluguel (`/api/rental-orders`)

| Método | Endpoint                                 | Descrição                        | Acesso  |
|--------|------------------------------------------|----------------------------------|---------|
| POST   | `/api/rental-orders`                     | Criar pedido                     | CLIENT  |
| GET    | `/api/rental-orders/my`                  | Listar meus pedidos              | CLIENT  |
| GET    | `/api/rental-orders/{id}`                | Detalhes do pedido               | Autenticado |
| PUT    | `/api/rental-orders/{id}`                | Modificar pedido                 | CLIENT/AGENT |
| PATCH  | `/api/rental-orders/{id}/cancel`         | Cancelar pedido                  | CLIENT  |
| GET    | `/api/rental-orders/pending`             | Listar pedidos pendentes         | AGENT   |
| PATCH  | `/api/rental-orders/{id}/analyze`        | Registrar análise financeira     | AGENT   |
| PATCH  | `/api/rental-orders/{id}/approve`        | Aprovar pedido                   | AGENT   |
| PATCH  | `/api/rental-orders/{id}/reject`         | Rejeitar pedido                  | AGENT   |

### 3.6 Contratos de Crédito (`/api/credit-contracts`)

| Método | Endpoint                        | Descrição                    | Acesso  |
|--------|---------------------------------|------------------------------|---------|
| POST   | `/api/credit-contracts`         | Criar contrato de crédito    | AGENT   |
| GET    | `/api/credit-contracts/{id}`    | Detalhes do contrato         | Autenticado |
| GET    | `/api/credit-contracts/order/{orderId}` | Contrato por pedido  | Autenticado |
### 3.7 Administração (`/api/admin`)

| Método | Endpoint                        | Descrição                          | Acesso  |
|--------|---------------------------------|--------------------------------------|---------|--------|
| GET    | `/api/admin/me`                 | Dados do admin logado                | ADMIN   |
| PUT    | `/api/admin/me`                 | Atualizar perfil do admin            | ADMIN   |
| GET    | `/api/admin/dashboard`          | Dashboard com métricas e usuários    | ADMIN   |
| GET    | `/api/admin/clients/{id}`       | Detalhe do cliente (perfil + pedidos)| ADMIN   |
| GET    | `/api/admin/agents/{id}`        | Detalhe do agente (perfil + veículos)| ADMIN   |
| DELETE | `/api/admin/users/{id}`         | Excluir usuário do sistema           | ADMIN   |

### 3.8 Testes de Carga (`/api/load-tests`)

| Método | Endpoint                        | Descrição                                  | Acesso  |
|--------|---------------------------------|--------------------------------------------|---------|
| POST   | `/api/load-tests/run`           | Executar teste comparativo (SSE streaming) | ADMIN   |

**Detalhes do endpoint SSE:**
- Retorna `text/event-stream` (Server-Sent Events)
- Timeout de 5 minutos (`SseEmitter` com 300.000ms)
- Eventos emitidos: `progress` (andamento), `result` (métricas finais), `error`, `complete`
- Parâmetros de entrada: `testType` (database_read, io_simulation, concurrent_load, mixed_workload), `totalRequests`, `concurrencyLevel`, `ioDelayMs`

## 4. Módulo Reativo (Spring WebFlux)

O sistema inclui um módulo de **programação reativa** com Spring WebFlux para comparação de performance com o módulo bloqueante tradicional (Spring MVC). Ambos coexistem no mesmo projeto — o Spring Boot opera em modo servlet (MVC) por padrão.

### Componentes Reativos

| Componente                           | Descrição                                                |
|--------------------------------------|----------------------------------------------------------|
| `ReactiveVehicleRepository`          | Repository reativo do MongoDB para veículos (`Flux<Vehicle>`) |
| `ReactiveRentalOrderRepository`      | Repository reativo do MongoDB para pedidos (`Flux<RentalOrder>`) |
| `LoadTestService`                    | Engine de execução de testes bloqueantes e reativos       |
| `LoadTestController`                 | Endpoint SSE para streaming de resultados em tempo real    |

### Tipos de Teste

| Tipo              | Bloqueante (MVC)                           | Reativo (WebFlux)                               |
|-------------------|--------------------------------------------|--------------------------------------------------|
| database_read     | `vehicleRepository.findAll()` + `orderRepo.findAll()` | `reactiveVehicleRepo.findAll()` + `reactiveOrderRepo.findAll()` |
| io_simulation     | `Thread.sleep(ioDelayMs)`                  | `Mono.delay(Duration.ofMillis(ioDelayMs))`       |
| concurrent_load   | findAll() + Thread.sleep(10ms)             | Flux findAll() + Mono.delay(10ms)                |
| mixed_workload    | findAll() + sleep + CPU burn               | Flux findAll() + Mono.delay + CPU burn           |

### Métricas Coletadas

- **Latência:** média, mín, máx, P50, P95, P99 (percentis)
- **Throughput:** requisições por segundo
- **Threads:** pico de threads ativas (`ThreadMXBean`)
- **Memória:** consumo em MB (`Runtime.totalMemory() - freeMemory()`)

## 5. Segurança

- **Autenticação:** JWT Bearer Token no header `Authorization`.
- **Hashing de senha:** BCrypt com salt.
- **Autorização:** Role-based (CLIENT, AGENT, ADMIN) com Spring Security.
- **CORS:** Configurado para aceitar requisições do frontend (localhost:3000, localhost:5173, localhost).
- **Endpoints públicos:** Apenas `/api/auth/**`.
- **Endpoints administrativos:** `/api/admin/**` restritos exclusivamente ao role ADMIN.

## 6. Dados Iniciais (Seed)

Ao iniciar com o banco vazio, o `DataSeeder` cria automaticamente:

| Entidade       | Quantidade | Detalhes                                        |
|----------------|------------|-------------------------------------------------|
| Admin Geral    | 1          | Administrador Geral (admin@rentacar.com)         |
| Agente         | 1          | RentaCar Veículos Ltda (empresa@rentacar.com)    |
| Cliente        | 1          | João da Silva (cliente@rentacar.com)             |
| Veículos       | 10         | Diversas marcas (8 disponíveis, 2 alugados)      |
| Pedidos        | 2          | Ambos com status ACTIVE                         |

As credenciais são **sempre** exibidas nos logs do backend na inicialização, mesmo que o banco já possua dados.

**Credenciais padrão:**
| Perfil      | E-mail                  | Senha       |
|-------------|-------------------------|-------------|
| Admin Geral | admin@rentacar.com      | admin123    |
| Agente      | empresa@rentacar.com    | agent123    |
| Cliente     | cliente@rentacar.com    | client123   |

## 5. Variáveis de Ambiente

| Variável                     | Descrição                        | Padrão                    |
|------------------------------|----------------------------------|---------------------------|
| `MONGODB_URI`                | URI de conexão ao MongoDB        | `mongodb://localhost:27017/rentacar` |
| `JWT_SECRET`                 | Chave secreta para assinatura JWT| (obrigatório)             |
| `JWT_EXPIRATION`             | Tempo de expiração do token (ms) | `86400000` (24h)          |
| `SERVER_PORT`                | Porta do servidor                | `8080`                    |
