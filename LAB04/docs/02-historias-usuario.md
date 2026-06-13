# Histórias do Usuário — Sistema de Moeda Estudantil

> Lab03S01 — Modelagem do sistema

Formato: **Como** \<papel\>, **quero** \<objetivo\>, **para** \<benefício\>.

## Aluno

### US01 — Cadastro de aluno
> **Como** aluno, **quero** me cadastrar informando nome, email, CPF, RG, endereço, instituição e curso, **para** participar do sistema de mérito.
- **Critérios de aceite:**
  - Devo selecionar minha instituição entre as pré-cadastradas.
  - CPF e email devem ser únicos.
  - Após cadastro, recebo login e senha e inicio com saldo 0.

### US02 — Login do aluno
> **Como** aluno, **quero** autenticar com login e senha, **para** acessar com segurança minha conta.

### US03 — Consultar extrato
> **Como** aluno, **quero** visualizar meu saldo e o histórico de transações, **para** acompanhar recebimentos e trocas.
- **Critérios:** Exibe saldo atual e lista de transações (recebimento/troca) com data, valor e descrição.

### US04 — Listar vantagens
> **Como** aluno, **quero** ver as vantagens disponíveis com foto, descrição e custo, **para** escolher onde gastar minhas moedas.

### US05 — Resgatar vantagem
> **Como** aluno, **quero** trocar minhas moedas por uma vantagem, **para** usufruir do benefício.
- **Critérios:** Só posso resgatar se tiver saldo suficiente; o valor é debitado; recebo email com cupom e código.

### US06 — Notificação de recebimento
> **Como** aluno, **quero** ser notificado por email quando receber moedas, **para** saber do reconhecimento.

## Professor

### US07 — Login do professor
> **Como** professor, **quero** autenticar com login e senha, **para** acessar minha conta.

### US08 — Enviar moedas
> **Como** professor, **quero** enviar moedas a um aluno com uma mensagem obrigatória, **para** reconhecer seu mérito.
- **Critérios:** Preciso de saldo suficiente; a mensagem (motivo) é obrigatória; meu saldo é debitado e o do aluno creditado.

### US09 — Recarga semestral
> **Como** professor, **quero** receber 1.000 moedas a cada semestre de forma acumulável, **para** distribuir reconhecimento.
- **Critérios:** O saldo não distribuído é mantido e somado às novas 1.000 moedas.

### US10 — Consultar extrato (professor)
> **Como** professor, **quero** ver meu saldo e os envios realizados, **para** controlar a distribuição de moedas.

## Empresa Parceira

### US11 — Cadastro de empresa
> **Como** empresa parceira, **quero** me cadastrar no sistema, **para** oferecer vantagens aos alunos.

### US12 — Cadastrar vantagem
> **Como** empresa parceira, **quero** cadastrar vantagens com nome, descrição, foto e custo em moedas, **para** disponibilizá-las aos alunos.

### US13 — Conferência de resgate
> **Como** empresa parceira, **quero** receber um email com código quando um aluno resgatar uma vantagem, **para** conferir a troca presencial.

## Requisitos não funcionais

- **RNF01 — Arquitetura:** O sistema deve seguir o padrão MVC.
- **RNF02 — Persistência:** Banco de dados MongoDB acessado via camada de repositório (Spring Data / padrão DAO).
- **RNF03 — Segurança:** Autenticação obrigatória (login/senha + JWT) para todos os perfis.
- **RNF04 — Mensageria:** Envio de emails de forma assíncrona via RabbitMQ.
- **RNF05 — Usabilidade:** Interface web moderna, responsiva e amigável.
