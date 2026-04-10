# Diagrama de Implantação — Sistema RentACar

## 1. Visão Geral

O sistema RentACar utiliza uma arquitetura de **três camadas** containerizada com Docker, permitindo deploy consistente em qualquer ambiente. O frontend serve arquivos estáticos via Nginx, o backend executa a API REST com Micronaut, e o MongoDB persiste os dados.

---

## 2. Diagrama de Implantação (Mermaid)

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
    ReposNode -->|"MongoDB Protocol\n:27017"| MongoProcess
    ReactiveDriver -->|"MongoDB Protocol\n:27017\n(Reactive Streams)"| MongoProcess

    style UserDevice fill:#f3e5f5,stroke:#9C27B0
    style DockerHost fill:#fafafa,stroke:#616161
    style FrontendContainer fill:#e8f4fd,stroke:#2196F3
    style BackendContainer fill:#fff3e0,stroke:#FF9800
    style MongoContainer fill:#e8f5e9,stroke:#4CAF50
```

---

## 3. Nós de Implantação

### 3.1 Dispositivo do Usuário

| Componente | Descrição |
|---|---|
| **Navegador Web** | Qualquer navegador moderno com suporte a ES2020+, Fetch API e SSE |

### 3.2 Container Frontend (`rentacar-frontend`)

| Propriedade | Valor |
|---|---|
| **Imagem base** | `node` (build) → `nginx` (runtime) |
| **Porta exposta** | 3000 → 80 (interno) |
| **Tecnologias** | React 18, TypeScript, Vite, TailwindCSS |
| **Responsabilidade** | Servir SPA; proxy reverso opcional para API |

### 3.3 Container Backend (`rentacar-backend`)

| Propriedade | Valor |
|---|---|
| **Imagem base** | `eclipse-temurin:21-jdk` (build) → `eclipse-temurin:21-jre` (runtime) |
| **Porta exposta** | 8080 |
| **Framework** | Micronaut 4.7.6 |
| **JVM** | Eclipse Temurin JDK 21 |
| **Variáveis de ambiente** | `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRATION` |

### 3.4 Container MongoDB (`rentacar-mongodb`)

| Propriedade | Valor |
|---|---|
| **Imagem** | `mongo:7` |
| **Porta exposta** | 27017 |
| **Volume** | `mongo-data` (persistência de dados) |
| **Database** | `rentacar` |

---

## 4. Protocolos de Comunicação

| Origem | Destino | Protocolo | Porta | Descrição |
|---|---|---|---|---|
| Browser | Frontend | HTTP | 3000 | Carrega SPA (HTML/JS/CSS) |
| Browser | Backend | HTTP | 8080 | Chamadas REST API com JWT + SSE para Load Tests |
| Backend | MongoDB | MongoDB Wire Protocol | 27017 | Consultas e persistência (sync + reactive) |

---

## 5. Configuração Docker Compose

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

## 6. Requisitos de Ambiente

| Requisito | Versão mínima |
|---|---|
| Docker | 20.10+ |
| Docker Compose | 2.0+ |
| JDK (desenvolvimento) | 21 |
| Node.js (desenvolvimento) | 18+ |
| Maven (desenvolvimento) | 3.9+ |
