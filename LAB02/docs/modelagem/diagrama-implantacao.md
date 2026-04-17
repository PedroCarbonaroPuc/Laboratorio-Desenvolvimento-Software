# Diagrama de Implantação — Sistema RentACar

## 1. Visão Geral

O sistema RentACar utiliza uma arquitetura de **três camadas** containerizada com Docker. Em ambiente local, os containers são orquestrados via Docker Compose. Em **produção**, a arquitetura é implantada na **AWS** utilizando serviços gerenciados: **ECS Fargate** para os containers, **Amazon DocumentDB** (compatível com MongoDB) para persistência, **Application Load Balancer (ALB)** para distribuição de tráfego e **Amazon CloudFront** como CDN para entrega do frontend.

---

## 2. Diagrama de Implantação — Ambiente Local (Docker Compose)

```mermaid
graph TB
    subgraph UserDevice["👤 Dispositivo do Usuário"]
        Browser["Navegador Web\n(Chrome, Firefox, Safari)"]
    end

    subgraph DockerHost["🐳 Docker Host"]
        subgraph DockerNetwork["Rede Docker: rentacar-net"]

            subgraph FrontendContainer["📦 Container: rentacar-frontend"]
                direction TB
                Nginx["Nginx\n(Servidor Web)"]
                StaticFiles["Arquivos Estáticos\n(HTML, JS, CSS)\nReact + Vite Build"]
                Nginx --> StaticFiles
            end

            subgraph BackendContainer["📦 Container: rentacar-backend"]
                direction TB
                JVM["JVM (Eclipse Temurin 21)"]
                MicronautApp["Micronaut Application\n(JAR executável)"]
                subgraph AppLayers["Camadas da Aplicação"]
                    ControllersNode["Controllers\n(REST API)"]
                    ServicesNode["Services\n(Lógica de Negócio)"]
                    SecurityNode["Security\n(JWT + BCrypt)"]
                    ReposNode["Repositories\n(Micronaut Data)"]
                    ReactiveDriver["MongoDB Reactive\nStreams Driver"]
                end
                JVM --> MicronautApp
                MicronautApp --> AppLayers
            end

            subgraph MongoContainer["📦 Container: rentacar-mongodb"]
                direction TB
                MongoProcess["mongod\n(MongoDB 7)"]
                subgraph Collections["Collections"]
                    UsersCol["users"]
                    VehiclesCol["vehicles"]
                    OrdersCol["rental_orders"]
                    ContractsCol["credit_contracts"]
                end
                MongoVolume[("Volume:\nmongo-data")]
                MongoProcess --> Collections
                MongoProcess --> MongoVolume
            end

        end
    end

    Browser -->|"HTTP :3000\n(HTML/JS/CSS)"| Nginx
    Browser -->|"HTTP :8080\n(REST API + SSE)\nJSON + Bearer JWT"| MicronautApp
    ReposNode -->|"MongoDB Wire Protocol\n:27017"| MongoProcess
    ReactiveDriver -->|"MongoDB Wire Protocol\n:27017\n(Reactive Streams)"| MongoProcess

    style UserDevice fill:#f3e5f5,stroke:#9C27B0
    style DockerHost fill:#fafafa,stroke:#616161
    style FrontendContainer fill:#e8f4fd,stroke:#2196F3
    style BackendContainer fill:#fff3e0,stroke:#FF9800
    style MongoContainer fill:#e8f5e9,stroke:#4CAF50
```

---

## 3. Diagrama de Implantação — Produção (AWS Cloud)

```mermaid
graph TB
    subgraph Users["👤 Usuários"]
        Browser["Navegador Web"]
    end

    subgraph AWS["☁️ AWS Cloud — sa-east-1 (São Paulo)"]
        subgraph Edge["Amazon CloudFront (CDN)"]
            CloudFront["CloudFront\nDistribution\n(Cache + HTTPS)"]
        end

        subgraph VPC["VPC: rentacar-vpc (10.0.0.0/16)"]
            subgraph PublicSubnet["Subnet Pública (10.0.1.0/24)"]
                ALB["Application\nLoad Balancer\n(ALB)"]
            end

            subgraph PrivateSubnet1["Subnet Privada A (10.0.10.0/24)"]
                subgraph ECSFrontend["ECS Fargate Service\nrentacar-frontend"]
                    FrontendTask["Task: Nginx\n+ React Build\n(512 CPU / 1GB RAM)"]
                end

                subgraph ECSBackend["ECS Fargate Service\nrentacar-backend"]
                    BackendTask["Task: JVM 21\n+ Micronaut API\n(1024 CPU / 2GB RAM)"]
                end
            end

            subgraph PrivateSubnet2["Subnet Privada B (10.0.20.0/24)"]
                subgraph DocDB["Amazon DocumentDB\n(Compatível MongoDB)"]
                    DocDBPrimary["Primary Instance\n(db.r6g.large)"]
                    DocDBReplica["Read Replica\n(db.r6g.large)"]
                end
            end
        end

        subgraph Supporting["Serviços Auxiliares"]
            ECR["Amazon ECR\n(Registry de Imagens)"]
            SecretsManager["AWS Secrets Manager\n(JWT_SECRET,\nDB Credentials)"]
            CloudWatch["Amazon CloudWatch\n(Logs + Métricas)"]
            Route53["Amazon Route53\n(DNS)"]
        end
    end

    Browser -->|"HTTPS :443\nTLS 1.3"| Route53
    Route53 -->|"DNS\nA Record"| CloudFront
    CloudFront -->|"HTTPS :443\nStatic Assets\n(Cache Hit)"| FrontendTask
    CloudFront -->|"HTTPS :443\n/api/*\n(Cache Bypass)"| ALB
    ALB -->|"HTTP :8080\nTarget Group\nHealth Check"| BackendTask
    ALB -->|"HTTP :80\nTarget Group"| FrontendTask
    BackendTask -->|"MongoDB Wire Protocol\n:27017\nTLS"| DocDBPrimary
    BackendTask -->|"HTTPS\nIAM Auth"| SecretsManager
    ECSFrontend -.->|"Pull Image"| ECR
    ECSBackend -.->|"Pull Image"| ECR
    BackendTask -.->|"Logs\nStdout/Stderr"| CloudWatch
    FrontendTask -.->|"Logs\nAccess Log"| CloudWatch

    style AWS fill:#fef9ef,stroke:#FF9900
    style VPC fill:#f0f8ff,stroke:#2196F3
    style PublicSubnet fill:#fff8e1,stroke:#FFC107
    style PrivateSubnet1 fill:#e8f5e9,stroke:#4CAF50
    style PrivateSubnet2 fill:#fce4ec,stroke:#E91E63
    style Edge fill:#e3f2fd,stroke:#1565C0
    style Supporting fill:#f3e5f5,stroke:#9C27B0
    style ECSFrontend fill:#e8f4fd,stroke:#2196F3
    style ECSBackend fill:#fff3e0,stroke:#FF9800
    style DocDB fill:#e8f5e9,stroke:#4CAF50
```

---

## 4. Nós de Implantação

### 4.1 Dispositivo do Usuário

| Componente | Descrição |
|---|---|
| **Navegador Web** | Qualquer navegador moderno com suporte a ES2020+, Fetch API e SSE |

### 4.2 Container Frontend (`rentacar-frontend`)

| Propriedade | Local | Produção (AWS) |
|---|---|---|
| **Imagem base** | `node` → `nginx` | `node` → `nginx` (via ECR) |
| **Porta** | 3000 → 80 | 80 (via ALB) |
| **Tecnologias** | React 18, TypeScript, Vite, TailwindCSS | Mesmo |
| **Compute** | Docker local | ECS Fargate (512 CPU / 1GB) |

### 4.3 Container Backend (`rentacar-backend`)

| Propriedade | Local | Produção (AWS) |
|---|---|---|
| **Imagem base** | `eclipse-temurin:21-jdk` → `21-jre` | Mesmo (via ECR) |
| **Porta** | 8080 | 8080 (via ALB Target Group) |
| **Framework** | Micronaut 4.7.6 | Mesmo |
| **Compute** | Docker local | ECS Fargate (1024 CPU / 2GB) |
| **Secrets** | `.env` / `docker-compose.yml` | AWS Secrets Manager |

### 4.4 Banco de Dados

| Propriedade | Local | Produção (AWS) |
|---|---|---|
| **Serviço** | MongoDB 7 (container) | Amazon DocumentDB |
| **Porta** | 27017 | 27017 (TLS) |
| **Persistência** | Volume Docker (`mongo-data`) | Storage gerenciado AWS |
| **Alta disponibilidade** | N/A | Primary + Read Replica |

---

## 5. Protocolos de Comunicação

| Origem | Destino | Protocolo | Porta | Descrição |
|---|---|---|---|---|
| Browser | CloudFront/Frontend | HTTPS (TLS 1.3) | 443 | Carrega SPA (HTML/JS/CSS) |
| Browser | CloudFront → ALB → Backend | HTTPS → HTTP | 443/8080 | Chamadas REST API com JWT + SSE |
| Backend | DocumentDB/MongoDB | MongoDB Wire Protocol + TLS | 27017 | Consultas e persistência (sync + reactive) |
| ECS Tasks | ECR | HTTPS | 443 | Pull de imagens Docker |
| Backend | Secrets Manager | HTTPS + IAM | 443 | Recuperação de secrets (JWT, DB credentials) |
| All Services | CloudWatch | HTTPS | 443 | Envio de logs e métricas |

---

## 6. Configuração Docker Compose (Local)

```yaml
services:
  mongodb:        # Porta 27017, volume mongo-data
  backend:        # Porta 8080, depende de mongodb
  frontend:       # Porta 3000, depende de backend

networks:
  rentacar-net:   # Bridge network para comunicação entre containers

volumes:
  mongo-data:     # Persistência do MongoDB
```

---

## 7. Infraestrutura AWS (Produção)

| Serviço AWS | Função | Justificativa |
|---|---|---|
| **ECS Fargate** | Compute serverless para containers | Sem gerenciamento de servidores, auto-scaling |
| **Application Load Balancer** | Roteamento de tráfego HTTP/HTTPS | Health checks, distribuição entre tasks |
| **Amazon DocumentDB** | Banco de dados compatível MongoDB | Gerenciado, alta disponibilidade, backups automáticos |
| **Amazon ECR** | Registry privado de imagens Docker | Integração nativa com ECS, scan de vulnerabilidades |
| **AWS Secrets Manager** | Gerenciamento de secrets | Rotação de secrets, integração com ECS task definitions |
| **Amazon CloudFront** | CDN e terminação TLS | Cache global de assets estáticos, certificado SSL/TLS |
| **Amazon CloudWatch** | Observabilidade | Logs centralizados, métricas, alarmes |
| **Amazon Route53** | DNS gerenciado | Resolução de domínio, health checks DNS |

---

## 8. Requisitos de Ambiente

| Requisito | Desenvolvimento | Produção |
|---|---|---|
| Docker | 20.10+ | — (ECS gerenciado) |
| Docker Compose | 2.0+ | — |
| JDK | 21 | 21 (Temurin, via imagem) |
| Node.js | 18+ | 20 (build via ECR) |
| Maven | 3.9+ | 3.9+ (build pipeline) |
| AWS CLI | — | 2.x |
| Conta AWS | — | Com permissões para ECS, DocumentDB, ALB, ECR, etc. |
