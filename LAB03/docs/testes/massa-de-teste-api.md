# Massa de teste da API

## Objetivo

Validar o backend com cenarios multiplos cobrindo:

- Sucesso funcional.
- Erros de validacao.
- Falhas de autenticacao/autorizacao.
- Resiliencia de regras de negocio.

## Script automatizado

Arquivo: `docker/docker-e2e-routes-test.sh`.

Execucao:

```bash
./docker/docker-start.sh
./docker/docker-e2e-routes-test.sh
./docker/docker-stop-clean.sh
```

## Cenarios cobertos

| Tipo | Endpoint | Cenario | Status esperado |
| --- | --- | --- | --- |
| Publico | `GET /api/institutions` | Consulta de instituicoes | 200 |
| Auth | `POST /api/auth/login` | Login professor, aluno e parceiro | 200 |
| Auth | `POST /api/auth/login` | Credencial invalida | 400 |
| Auth | `GET /api/students/me` | Sem token | 401 |
| ACL | `POST /api/benefits` | Aluno tentando criar vantagem | 403 |
| Validacao | `POST /api/professors/me/transfer` | Quantidade de moedas igual a 0 | 400 |
| Fluxo principal | `POST /api/professors/me/transfer` | Transferencia valida professor -> aluno | 201 |
| Fluxo principal | `POST /api/benefits` | Parceiro cria vantagem de alto custo | 201 |
| Regra de negocio | `POST /api/redemptions` | Resgate com saldo insuficiente | 400 |
| Regra de negocio | `POST /api/redemptions` | Resgate de vantagem inexistente | 404 |
| Fluxo principal | `POST /api/redemptions` | Resgate valido com cupom | 201 |
| Dashboard | `GET /api/dashboard/summary` | Consolidado por aluno/parceiro | 200 |

## Dados de apoio

Os dados de seed sao carregados no startup do backend e incluem:

- Professores demo.
- Alunos demo.
- Parceiros demo.
- Vantagens e transacoes iniciais.

Isso garante massa inicial para testar o sistema assim que os containers sobem.
