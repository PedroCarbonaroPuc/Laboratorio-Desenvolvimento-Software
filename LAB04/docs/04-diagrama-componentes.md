# Diagrama de Componentes — Sistema de Moeda Estudantil

> Lab03S01 — Modelagem do sistema

![Diagrama de Componentes](images/diagrama-componentes.png)

> Imagem gerada com PlantUML. Fonte: [`diagrams/plantuml/diagrama-componentes.puml`](diagrams/plantuml/diagrama-componentes.puml) · versão vetorial: [`images/diagrama-componentes.svg`](images/diagrama-componentes.svg)

<details>
<summary>Código Mermaid (visualização alternativa)</summary>

```mermaid
flowchart TB
    subgraph Client["🖥️ Frontend (React + Vite + Tailwind)"]
        UI[Componentes de UI]
        ApiClient[Cliente HTTP / Axios]
        UI --> ApiClient
    end

    subgraph Backend["☕ Backend (Spring Boot - MVC)"]
        direction TB
        Controllers[Camada Controller \n REST API]
        Services[Camada Service \n Regras de negócio]
        Repositories[Camada Repository \n Spring Data / DAO]
        Security[Módulo de Segurança \n JWT + Filtros]
        Messaging[Módulo de Mensageria \n Producer RabbitMQ]
        EmailConsumer[Consumer de Email \n Templates Thymeleaf]

        Controllers --> Services
        Services --> Repositories
        Services --> Messaging
        Controllers --> Security
        Messaging --> EmailConsumer
    end

    subgraph Infra["🐳 Infraestrutura (Docker)"]
        Mongo[(MongoDB)]
        Rabbit{{RabbitMQ}}
        Mail[/MailHog - SMTP/]
    end

    ApiClient -->|HTTP/JSON| Controllers
    Repositories -->|Driver Mongo| Mongo
    Messaging -->|AMQP publish| Rabbit
    Rabbit -->|AMQP consume| EmailConsumer
    EmailConsumer -->|SMTP| Mail
```

</details>

## Arquitetura de implantação (Docker Compose)

![Arquitetura de Implantação](images/arquitetura.png)

> Diagrama de implantação dos containers Docker. Fonte: [`diagrams/plantuml/arquitetura.puml`](diagrams/plantuml/arquitetura.puml) · versão vetorial: [`images/arquitetura.svg`](images/arquitetura.svg)

## Descrição dos componentes

| Componente | Responsabilidade |
|------------|------------------|
| **Frontend (React)** | Interface do usuário, formulários de CRUD, telas de envio de moedas, extrato, vantagens e resgate. Consome a API REST. |
| **Controller** | Expõe os endpoints REST, recebe requisições, valida entradas e delega aos services. |
| **Service** | Concentra as regras de negócio (saldo, envio de moedas, resgate, recarga semestral). |
| **Repository (DAO)** | Abstrai o acesso ao MongoDB via Spring Data. |
| **Security (JWT)** | Autenticação e autorização por papel (aluno, professor, empresa). |
| **Messaging (Producer)** | Publica eventos de notificação na fila do RabbitMQ. |
| **Email Consumer** | Consome eventos da fila e envia emails com templates (professor, aluno, cupom). |
| **MongoDB** | Banco de dados de documentos para persistência. |
| **RabbitMQ** | Broker de mensagens para desacoplar o envio de emails. |
| **MailHog** | Servidor SMTP de testes para inspeção dos emails em ambiente de desenvolvimento. |

## Estilo arquitetural

O sistema adota o padrão **MVC** com separação em camadas (Controller → Service → Repository) e
comunicação **assíncrona** para envio de emails via RabbitMQ, garantindo baixo acoplamento entre o
processamento das transações e a entrega das notificações.
