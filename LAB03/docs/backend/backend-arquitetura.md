# Backend - Arquitetura e padroes

## Visao geral

O backend foi estruturado em Spring Boot (Java 21) com arquitetura em camadas para separar regras de negocio, API, seguranca e persistencia.

## Camadas

1. `controller`: endpoints REST e adaptacao HTTP.
2. `service`: regras de negocio, validacoes e orquestracao.
3. `repository`: acesso ao MongoDB via Spring Data.
4. `security`: autenticacao bearer token opaco e autorizacao por papel.
5. `exception`: padronizacao de erros da API.

## Padroes aplicados

- Service Layer para concentrar regras de dominio.
- Repository Pattern com interfaces tipadas.
- Fail fast com exceptions de dominio (`BusinessException`, `ForbiddenOperationException`, `ResourceNotFoundException`).
- Seed idempotente para ambiente demo com dados iniciais.
- Token opaco persistido em banco, permitindo revogacao via logout.

## Fluxos criticos

### Transferencia de moedas

1. Professor autenticado chama `POST /api/professors/me/transfer`.
2. `ProfessorService` valida saldo e mensagem.
3. Saldo do professor e do aluno e atualizado.
4. `TransactionService` registra evento.
5. `NotificationService` dispara email (mock por padrao).

### Resgate de vantagem

1. Aluno autenticado chama `POST /api/redemptions`.
2. `RedemptionService` valida vantagem ativa e saldo.
3. Debita saldo, gera cupom unico e registra transacao.
4. Envia notificacao ao aluno e ao parceiro.

## Dados de inicializacao

`DataSeeder` popula automaticamente:

- Instituicoes.
- Professores, alunos e parceiros.
- Catalogo inicial de vantagens.
- Massa inicial de transacoes (transferencias + resgates).
- Painel de credenciais no log para facilitar demonstracao.

## Robustez e manutencao

- Endpoints usam DTOs de entrada com Bean Validation.
- Erros retornam contrato padrao com status, mensagem e path.
- Regras de autorizacao por papel sao centralizadas em `AuthFacade`.
- Scripts Docker e testes de rota permitem regressao rapida em ambiente local.
