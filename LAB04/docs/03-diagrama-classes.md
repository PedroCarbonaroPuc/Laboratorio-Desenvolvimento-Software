# Diagrama de Classes — Sistema de Moeda Estudantil

> Lab03S01 — Modelagem do sistema

![Diagrama de Classes](images/diagrama-classes.png)

> Imagem gerada com PlantUML. Fonte: [`diagrams/plantuml/diagrama-classes.puml`](diagrams/plantuml/diagrama-classes.puml) · versão vetorial: [`images/diagrama-classes.svg`](images/diagrama-classes.svg)

<details>
<summary>Código Mermaid (visualização alternativa)</summary>

```mermaid
classDiagram
    class Instituicao {
        +String id
        +String nome
        +String cidade
    }

    class Usuario {
        <<abstract>>
        +String id
        +String nome
        +String email
        +String login
        +String senha
    }

    class Aluno {
        +String cpf
        +String rg
        +String endereco
        +String curso
        +int saldo
        +receberMoedas(int)
        +debitar(int)
    }

    class Professor {
        +String cpf
        +String departamento
        +int saldo
        +enviarMoedas(Aluno, int, String)
        +recargaSemestral()
    }

    class EmpresaParceira {
        +String cnpj
        +cadastrarVantagem(Vantagem)
    }

    class Vantagem {
        +String id
        +String nome
        +String descricao
        +String foto
        +int custoMoedas
    }

    class Transacao {
        +String id
        +TipoTransacao tipo
        +String origemId
        +String destinoId
        +int valor
        +String mensagem
        +LocalDateTime data
    }

    class Resgate {
        +String id
        +String codigo
        +StatusResgate status
        +LocalDateTime data
    }

    class TipoTransacao {
        <<enumeration>>
        ENVIO
        RESGATE
    }

    class StatusResgate {
        <<enumeration>>
        PENDENTE
        UTILIZADO
    }

    Usuario <|-- Aluno
    Usuario <|-- Professor
    Usuario <|-- EmpresaParceira

    Instituicao "1" o-- "*" Aluno : possui
    Instituicao "1" o-- "*" Professor : possui
    EmpresaParceira "1" --> "*" Vantagem : oferece
    Professor "1" --> "*" Transacao : realiza
    Aluno "1" --> "*" Transacao : participa
    Aluno "1" --> "*" Resgate : efetua
    Vantagem "1" --> "*" Resgate : gera
    Transacao --> TipoTransacao
    Resgate --> StatusResgate
```

</details>

## Observações de modelagem

- `Usuario` é uma **superclasse abstrata** com os atributos e credenciais comuns. `Aluno`, `Professor` e `EmpresaParceira` herdam dela.
- O **saldo** de moedas é mantido em `Aluno` e `Professor`. A empresa não possui saldo.
- `Transacao` registra tanto o **envio** (professor → aluno) quanto o **resgate** (aluno → vantagem), diferenciado pelo enum `TipoTransacao`.
- `Resgate` materializa o cupom gerado, com `codigo` único e `status`.
- No MongoDB, as associações são representadas por **referências por id** (ex.: `instituicaoId`, `empresaId`), exceto valores fortemente acoplados que podem ser embutidos.
