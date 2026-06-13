# Lab03S03 - Arquitetura e Camada de Persistencia

## Objetivo da entrega

Consolidar arquitetura da solucao, estrategia de persistencia e evidencias de robustez da implementacao final.

## Arquitetura adotada

### Frontend

- React + TypeScript, modularizado por dominio.
- `App.tsx` atua como orquestrador de estado e API.
- Componentes separados por papel:
  - `PublicArea`
  - `StudentArea`
  - `ProfessorArea`
  - `PartnerArea`
- Componentes compartilhados para extrato e blocos reutilizaveis.

### Backend

- Spring Boot com camadas bem definidas:
  - Controllers REST.
  - Services de negocio.
  - Repositories Spring Data.
  - Security com token opaco persistido.
  - Tratamento global de excecoes.
- `DataSeeder` idempotente para ambiente demo.

## Persistencia

- Banco: MongoDB.
- Modelo orientado a documentos com referencias por ID.
- Colecoes principais:
  - institutions
  - students
  - professors
  - partners
  - benefits
  - coin_transactions
  - session_tokens
  - professor_semester_allowances

## Estrategia de acesso a dados

- Repositories tipados com Spring Data MongoDB.
- Regras transacionais de negocio concentradas em services.
- Extrato orientado a eventos na colecao `coin_transactions`.

## Garantias de integridade

- Indices unicos para email/CPF/CNPJ/token/chave semestral.
- Validacoes de payload via Bean Validation.
- Regras de autorizacao centralizadas por papel.
- Idempotencia no credito semestral.

## Evidencias de robustez

- Docker com ambiente completo: frontend + backend + mongodb.
- Script de teste de rotas cobrindo cenarios de sucesso e falha.
- Script de cleanup removendo artefatos locais.

## Referencias detalhadas

- Backend: `docs/backend/backend-arquitetura.md`
- Frontend: `docs/frontend/frontend-arquitetura.md`
- Testes: `docs/testes/massa-de-teste-api.md`
- Modelagem obrigatoria: `docs/modelagem/*`
