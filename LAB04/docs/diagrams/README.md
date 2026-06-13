# Diagramas — Sistema de Moeda Estudantil

Esta pasta contém o **código-fonte** de todos os diagramas e arquiteturas do projeto, mantidos
versionados para edição e re-renderização profissional. As imagens geradas ficam em
[`../images`](../images).

## Estrutura

```
docs/
├── diagrams/
│   ├── plantuml/        # Fontes .puml (UML profissional — PlantUML)
│   │   ├── style.iuml   # Estilo/paleta compartilhado (identidade visual indigo/violet)
│   │   ├── casos-de-uso.puml
│   │   ├── diagrama-classes.puml
│   │   ├── diagrama-componentes.puml
│   │   ├── modelo-er.puml
│   │   ├── arquitetura.puml          # Diagrama de implantação (Docker Compose)
│   │   ├── seq-01-cadastro-aluno.puml
│   │   ├── seq-02-envio-moedas.puml
│   │   ├── seq-03-extrato.puml
│   │   ├── seq-04-cadastro-vantagem.puml
│   │   ├── seq-05-listagem-vantagens.puml
│   │   ├── seq-06-resgate-vantagem.puml
│   │   └── seq-07-visao-geral.puml
│   └── mermaid/         # Fontes .mmd (Mermaid — alternativa leve / GitHub)
└── images/              # Imagens renderizadas (.png + .svg)
```

## Ferramentas utilizadas

| Ferramenta | Uso | Versão de referência |
| :--- | :--- | :--- |
| **PlantUML** | Renderização profissional dos diagramas UML (formato principal) | 1.2026.x |
| **Graphviz (dot)** | Engine de layout usada pelo PlantUML | 12.x |
| **Mermaid** | Fontes alternativas (renderizam direto no GitHub/Markdown) | 10.x |

## Como renderizar

### PlantUML (recomendado — gera PNG + SVG)

Pré-requisitos no macOS:

```bash
brew install plantuml graphviz
```

Gerar **todas** as imagens (a partir da pasta `plantuml/`):

```bash
cd docs/diagrams/plantuml
plantuml -tpng -o ../../images *.puml   # PNG
plantuml -tsvg -o ../../images *.puml   # SVG (vetorial, ideal para slides/zoom)
```

### Mermaid (opcional)

```bash
npm install -g @mermaid-js/mermaid-cli
cd docs/diagrams/mermaid
mmdc -i casos-de-uso.mmd -o ../../images/casos-de-uso.png
```

> 💡 Os arquivos `.mmd` também são renderizados automaticamente pelo GitHub quando incluídos em
> blocos ```` ```mermaid ```` nos arquivos Markdown da pasta [`docs/`](../).

## Identidade visual

Todos os diagramas PlantUML compartilham o arquivo [`plantuml/style.iuml`](plantuml/style.iuml),
que define a paleta **indigo/violet** do projeto, tipografia, cantos arredondados e cores
semânticas para infraestrutura (MongoDB em verde, RabbitMQ em âmbar), garantindo consistência
visual de nível profissional entre todos os artefatos.
