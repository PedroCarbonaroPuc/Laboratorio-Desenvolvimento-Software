# Modelo ER / Modelo de Dados — Sistema de Moeda Estudantil

> Lab03S02 — Modelo ER e estratégia de persistência

Embora o MongoDB seja orientado a documentos (NoSQL), o modelo lógico das entidades e seus
relacionamentos pode ser representado no formato Entidade-Relacionamento abaixo. No banco, cada
entidade corresponde a uma **collection** e os relacionamentos são mantidos por **referências de id**.

![Modelo Entidade-Relacionamento](images/modelo-er.png)

> Imagem gerada com PlantUML. Fonte: [`diagrams/plantuml/modelo-er.puml`](diagrams/plantuml/modelo-er.puml) · versão vetorial: [`images/modelo-er.svg`](images/modelo-er.svg)

<details>
<summary>Código Mermaid (visualização alternativa)</summary>

```mermaid
erDiagram
    INSTITUICAO ||--o{ ALUNO : "matricula"
    INSTITUICAO ||--o{ PROFESSOR : "vincula"
    EMPRESA_PARCEIRA ||--o{ VANTAGEM : "oferece"
    PROFESSOR ||--o{ TRANSACAO : "envia"
    ALUNO ||--o{ TRANSACAO : "recebe/troca"
    ALUNO ||--o{ RESGATE : "efetua"
    VANTAGEM ||--o{ RESGATE : "gera"

    INSTITUICAO {
        string id PK
        string nome
        string cidade
    }

    ALUNO {
        string id PK
        string nome
        string email
        string cpf
        string rg
        string endereco
        string curso
        string instituicaoId FK
        int saldo
        string login
        string senha
    }

    PROFESSOR {
        string id PK
        string nome
        string cpf
        string departamento
        string instituicaoId FK
        int saldo
        string login
        string senha
    }

    EMPRESA_PARCEIRA {
        string id PK
        string nome
        string email
        string cnpj
        string login
        string senha
    }

    VANTAGEM {
        string id PK
        string nome
        string descricao
        string foto
        int custoMoedas
        string empresaId FK
    }

    TRANSACAO {
        string id PK
        string tipo
        string origemId FK
        string destinoId FK
        int valor
        string mensagem
        datetime data
    }

    RESGATE {
        string id PK
        string codigo
        string status
        datetime data
        string alunoId FK
        string vantagemId FK
    }
```

</details>

## Estratégia de acesso ao banco de dados

- **Tecnologia:** MongoDB + **Spring Data MongoDB** (mapeamento objeto-documento, equivalente a um ORM/ODM).
- **Padrão DAO:** cada entidade possui um `Repository` (interface que estende `MongoRepository`),
  isolando o acesso a dados da lógica de negócio.
- **Mapeamento:** anotações `@Document`, `@Id` e `@Indexed(unique = true)` definem collections,
  chaves e restrições de unicidade (ex.: CPF, email, login).
- **Relacionamentos:** mantidos por referência de id (`instituicaoId`, `empresaId`, etc.),
  resolvidos na camada de service quando necessário.

## Collections

| Collection | Entidade | Chaves únicas |
|------------|----------|---------------|
| `instituicoes` | Instituição | — |
| `alunos` | Aluno | cpf, email, login |
| `professores` | Professor | cpf, login |
| `empresas` | Empresa Parceira | cnpj, email, login |
| `vantagens` | Vantagem | — |
| `transacoes` | Transação | — |
| `resgates` | Resgate | codigo |
