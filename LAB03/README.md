# Sistema de Moeda Estudantil - Release 1

Plataforma full-stack para reconhecimento de merito academico com moeda virtual.

Professores distribuem moedas, alunos acumulam saldo e resgatam vantagens, parceiros gerenciam catalogo e validam cupons.

## Status

![Java](https://img.shields.io/badge/Java-21-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.6-007ec6?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-007ec6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-007ec6?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-007ec6?style=for-the-badge&logo=docker&logoColor=white)

## Sumario

- [Arquitetura e pacotes](#arquitetura-e-pacotes)
- [Funcionalidades](#funcionalidades)
- [Documentacao obrigatoria](#documentacao-obrigatoria)
- [Execucao local](#execucao-local)
- [Execucao com Docker](#execucao-com-docker)
- [Massa de testes de API](#massa-de-testes-de-api)
- [Credenciais de demonstracao](#credenciais-de-demonstracao)
- [Slides de apresentacao](#slides-de-apresentacao)
- [Contribuicao](#contribuicao)
- [Licenca](#licenca)

## Arquitetura e pacotes

A raiz foi segregada em pacotes claros:

```text
.
├── backend/                  # API Spring Boot + regras de negocio + persistencia
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── Dockerfile
├── frontend/                 # App React + TypeScript + design system
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker/                   # Orquestracao e automacao de ambiente
│   ├── docker-compose.yml
│   ├── docker-start.sh
│   ├── docker-stop-clean.sh
│   └── docker-e2e-routes-test.sh
├── docs/                     # Modelagem, arquitetura, testes e slides
│   ├── backend/
│   ├── frontend/
│   ├── modelagem/
│   ├── slides/
│   └── testes/
└── README.md
```

## Funcionalidades

- Autenticacao por perfil (`STUDENT`, `PROFESSOR`, `PARTNER`).
- Cadastro de aluno e empresa parceira.
- CRUD de vantagens por parceiro.
- Transferencia de moedas professor -> aluno com mensagem obrigatoria.
- Extrato e saldo por perfil.
- Resgate com cupom unico.
- Notificacao por email (modo mock por padrao).
- Credito semestral automatico de 1000 moedas por professor.
- Seed com massa inicial para demonstracao completa.

## Documentacao obrigatoria

### Modelagem do sistema

- Casos de uso:
  - Mermaid: [docs/modelagem/01-casos-de-uso/diagrama-casos-de-uso.mmd](docs/modelagem/01-casos-de-uso/diagrama-casos-de-uso.mmd)
  - Explicacao: [docs/modelagem/01-casos-de-uso/casos-de-uso.md](docs/modelagem/01-casos-de-uso/casos-de-uso.md)
- Historias do usuario:
  - Mermaid: [docs/modelagem/02-historias-de-usuario/mapa-historias.mmd](docs/modelagem/02-historias-de-usuario/mapa-historias.mmd)
  - Explicacao: [docs/modelagem/02-historias-de-usuario/historias-de-usuario.md](docs/modelagem/02-historias-de-usuario/historias-de-usuario.md)
- Diagrama de classes:
  - Mermaid: [docs/modelagem/03-diagrama-de-classes/diagrama-de-classes.mmd](docs/modelagem/03-diagrama-de-classes/diagrama-de-classes.mmd)
  - Explicacao: [docs/modelagem/03-diagrama-de-classes/diagrama-de-classes.md](docs/modelagem/03-diagrama-de-classes/diagrama-de-classes.md)
- Diagrama de componentes:
  - Mermaid: [docs/modelagem/04-diagrama-de-componentes/diagrama-de-componentes.mmd](docs/modelagem/04-diagrama-de-componentes/diagrama-de-componentes.mmd)
  - Explicacao: [docs/modelagem/04-diagrama-de-componentes/diagrama-de-componentes.md](docs/modelagem/04-diagrama-de-componentes/diagrama-de-componentes.md)
- Modelo ER:
  - Mermaid: [docs/modelagem/05-modelo-er/modelo-er.mmd](docs/modelagem/05-modelo-er/modelo-er.mmd)
  - Explicacao: [docs/modelagem/05-modelo-er/modelo-er.md](docs/modelagem/05-modelo-er/modelo-er.md)

### Arquitetura detalhada

- Backend: [docs/backend/backend-arquitetura.md](docs/backend/backend-arquitetura.md)
- Frontend: [docs/frontend/frontend-arquitetura.md](docs/frontend/frontend-arquitetura.md)
- Consolidado S03: [docs/lab03s03-arquitetura-persistencia.md](docs/lab03s03-arquitetura-persistencia.md)

## Execucao local

### Pre-requisitos

- Java 21+
- Node.js 20+
- MongoDB 7 local em `mongodb://localhost:27017/moeda_estudantil`

### Backend

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicacao local:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Execucao com Docker

Na raiz do projeto:

```bash
./docker/docker-start.sh
```

Parar e limpar ambiente completo:

```bash
./docker/docker-stop-clean.sh
```

## Massa de testes de API

Script de testes automatizados com cenarios de sucesso e erro:

```bash
./docker/docker-e2e-routes-test.sh
```

Cobertura do script:

- Login valido e invalido.
- Erro por falta de autenticacao.
- Erro por permissao insuficiente.
- Erro de validacao de payload.
- Fluxos principais de transferencia e resgate.
- Cenarios de saldo insuficiente e recurso inexistente.
- Dashboard por papel.

Detalhes: [docs/testes/massa-de-teste-api.md](docs/testes/massa-de-teste-api.md)

## Credenciais de demonstracao

Ao iniciar o backend, o `DataSeeder` imprime no log um painel com usuarios de demo, saldos e credenciais.

Padrao inicial:

- Professores: senha `Professor@123`
- Alunos: senha `Aluno@123`
- Parceiros: senha `Parceiro@123`

Usuarios semeados:

- Professores: `ana.ribeiro@instituicao.edu`, `bruno.costa@instituicao.edu`
- Alunos: `joao.martins@aluno.edu`, `beatriz.almeida@aluno.edu`, `carla.nunes@aluno.edu`
- Parceiros: `nimbus@parceiro.com`, `pulse@parceiro.com`

## Slides de apresentacao

Deck resumido para apresentacao:

- [docs/slides/lab03s03-roteiro-apresentacao.md](docs/slides/lab03s03-roteiro-apresentacao.md)

## Contribuicao

Guia de contribuicao:

- [CONTRIBUTING.md](CONTRIBUTING.md)

## Licenca

Projeto distribuido sob a licenca MIT.

- [LICENSE](LICENSE)
