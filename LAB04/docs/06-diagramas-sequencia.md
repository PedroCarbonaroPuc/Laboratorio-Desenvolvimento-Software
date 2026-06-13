# Diagramas de Sequência — Sistema de Moeda Estudantil

> Lab04S02 (um por caso de uso) e Lab04S03 (diagrama geral)

## Diagrama de Sequência Geral

![Diagrama de Sequência Geral](images/diagrama-sequencia.png)

> Fonte principal: [`diagrams/plantuml/seq-07-visao-geral.puml`](diagrams/plantuml/seq-07-visao-geral.puml) · versão vetorial: [`images/diagrama-sequencia.svg`](images/diagrama-sequencia.svg)

## SD01 — Cadastro de Aluno

![SD01 - Cadastro de Aluno](images/seq-01-cadastro-aluno.png)

> Fonte: [`diagrams/plantuml/seq-01-cadastro-aluno.puml`](diagrams/plantuml/seq-01-cadastro-aluno.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Aluno
    participant FE as Frontend
    participant AC as AlunoController
    participant AS as AlunoService
    participant AR as AlunoRepository
    participant DB as MongoDB

    Aluno->>FE: Preenche formulário de cadastro
    FE->>AC: POST /api/alunos
    AC->>AS: criar(alunoDTO)
    AS->>AR: existsByCpf / existsByEmail
    AR->>DB: consulta
    DB-->>AR: resultado
    AS->>AR: save(aluno)
    AR->>DB: insert
    DB-->>AR: aluno persistido
    AS-->>AC: AlunoResponse
    AC-->>FE: 201 Created
    FE-->>Aluno: Confirmação de cadastro
```

</details>

## SD02 — Envio de Moedas (Professor → Aluno)

![SD02 - Envio de Moedas](images/seq-02-envio-moedas.png)

> Fonte: [`diagrams/plantuml/seq-02-envio-moedas.puml`](diagrams/plantuml/seq-02-envio-moedas.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Professor
    participant FE as Frontend
    participant TC as TransacaoController
    participant TS as TransacaoService
    participant PR as ProfessorRepository
    participant AR as AlunoRepository
    participant MQ as RabbitMQ Producer
    participant EC as Email Consumer

    Professor->>FE: Seleciona aluno, valor e mensagem
    FE->>TC: POST /api/transacoes/envio
    TC->>TS: enviarMoedas(profId, alunoId, valor, msg)
    TS->>PR: findById(profId)
    PR-->>TS: professor
    TS->>TS: valida saldo suficiente
    TS->>AR: findById(alunoId)
    AR-->>TS: aluno
    TS->>PR: save(professor debitado)
    TS->>AR: save(aluno creditado)
    TS->>MQ: publica EmailEvent(aluno)
    TS-->>TC: TransacaoResponse
    TC-->>FE: 200 OK
    MQ-->>EC: consome evento
    EC->>EC: monta template aluno
    EC-->>Professor: (email confirmação envio)
    EC-->>Aluno: email recebimento de moedas
```

</details>

## SD03 — Consulta de Extrato

![SD03 - Consulta de Extrato](images/seq-03-extrato.png)

> Fonte: [`diagrams/plantuml/seq-03-extrato.puml`](diagrams/plantuml/seq-03-extrato.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Usuario as Aluno/Professor
    participant FE as Frontend
    participant TC as TransacaoController
    participant TS as TransacaoService
    participant TR as TransacaoRepository
    participant DB as MongoDB

    Usuario->>FE: Acessa "Meu Extrato"
    FE->>TC: GET /api/transacoes/extrato/{id}
    TC->>TS: consultarExtrato(id)
    TS->>TR: findByOrigemIdOrDestinoId(id)
    TR->>DB: consulta
    DB-->>TR: transações
    TR-->>TS: lista
    TS-->>TC: ExtratoResponse(saldo, transações)
    TC-->>FE: 200 OK
    FE-->>Usuario: Exibe saldo e histórico
```

</details>

## SD04 — Cadastro de Vantagem (Empresa)

![SD04 - Cadastro de Vantagem](images/seq-04-cadastro-vantagem.png)

> Fonte: [`diagrams/plantuml/seq-04-cadastro-vantagem.puml`](diagrams/plantuml/seq-04-cadastro-vantagem.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Empresa
    participant FE as Frontend
    participant VC as VantagemController
    participant VS as VantagemService
    participant VR as VantagemRepository
    participant DB as MongoDB

    Empresa->>FE: Preenche vantagem (nome, descrição, foto, custo)
    FE->>VC: POST /api/vantagens
    VC->>VS: criar(vantagemDTO, empresaId)
    VS->>VR: save(vantagem)
    VR->>DB: insert
    DB-->>VR: vantagem persistida
    VS-->>VC: VantagemResponse
    VC-->>FE: 201 Created
    FE-->>Empresa: Confirmação
```

</details>

## SD05 — Listagem de Vantagens (Aluno)

![SD05 - Listagem de Vantagens](images/seq-05-listagem-vantagens.png)

> Fonte: [`diagrams/plantuml/seq-05-listagem-vantagens.puml`](diagrams/plantuml/seq-05-listagem-vantagens.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Aluno
    participant FE as Frontend
    participant VC as VantagemController
    participant VS as VantagemService
    participant VR as VantagemRepository

    Aluno->>FE: Abre catálogo de vantagens
    FE->>VC: GET /api/vantagens
    VC->>VS: listarTodas()
    VS->>VR: findAll()
    VR-->>VS: vantagens
    VS-->>VC: lista
    VC-->>FE: 200 OK
    FE-->>Aluno: Exibe vantagens com foto/custo
```

</details>

## SD06 — Resgate / Troca de Vantagem (Aluno)

![SD06 - Resgate de Vantagem](images/seq-06-resgate-vantagem.png)

> Fonte: [`diagrams/plantuml/seq-06-resgate-vantagem.puml`](diagrams/plantuml/seq-06-resgate-vantagem.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Aluno
    participant FE as Frontend
    participant RC as ResgateController
    participant RS as ResgateService
    participant AR as AlunoRepository
    participant VR as VantagemRepository
    participant RR as ResgateRepository
    participant MQ as RabbitMQ Producer
    participant EC as Email Consumer

    Aluno->>FE: Seleciona vantagem e confirma resgate
    FE->>RC: POST /api/resgates
    RC->>RS: resgatar(alunoId, vantagemId)
    RS->>AR: findById(alunoId)
    RS->>VR: findById(vantagemId)
    RS->>RS: valida saldo >= custo
    RS->>RS: gera código único do cupom
    RS->>AR: save(aluno debitado)
    RS->>RR: save(resgate)
    RS->>MQ: publica EmailEvent(aluno + empresa)
    RS-->>RC: ResgateResponse(codigo)
    RC-->>FE: 201 Created
    MQ-->>EC: consome evento
    EC-->>Aluno: email cupom com código
    EC-->>Empresa: email conferência com código
    FE-->>Aluno: Exibe cupom gerado
```

</details>

## SD-GERAL — Visão geral do fluxo (Lab04S03)

![SD Geral - Visão geral do fluxo](images/seq-07-visao-geral.png)

> Fonte: [`diagrams/plantuml/seq-07-visao-geral.puml`](diagrams/plantuml/seq-07-visao-geral.puml)

<details>
<summary>Código Mermaid</summary>

```mermaid
sequenceDiagram
    actor Professor
    actor Aluno
    actor Empresa
    participant API as Backend (MVC)
    participant DB as MongoDB
    participant MQ as RabbitMQ
    participant Mail as Email

    Note over Empresa,API: Cadastro e oferta de vantagens
    Empresa->>API: Cadastra-se / cadastra vantagens
    API->>DB: persiste empresa e vantagens

    Note over Aluno,API: Ingresso do aluno
    Aluno->>API: Cadastra-se (instituição pré-cadastrada)
    API->>DB: persiste aluno (saldo 0)

    Note over Professor,Aluno: Reconhecimento de mérito
    Professor->>API: Envia moedas + mensagem
    API->>DB: debita professor / credita aluno
    API->>MQ: evento de notificação
    MQ->>Mail: email ao aluno

    Note over Aluno,Empresa: Troca por vantagem
    Aluno->>API: Consulta extrato e vantagens
    Aluno->>API: Resgata vantagem
    API->>DB: debita aluno / cria resgate
    API->>MQ: evento de cupom
    MQ->>Mail: email cupom (aluno + empresa)
```

</details>
