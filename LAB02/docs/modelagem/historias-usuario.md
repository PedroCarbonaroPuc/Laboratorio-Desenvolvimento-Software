# Histórias do Usuário — Sistema de Aluguel de Carros

## Épico 1: Autenticação e Cadastro

### HU-01 — Cadastro de Cliente
**Como** um novo usuário individual,  
**Quero** me cadastrar no sistema informando meus dados pessoais, profissionais e de renda,  
**Para que** eu possa acessar o sistema e realizar pedidos de aluguel de automóveis.

**Critérios de Aceitação:**
- O formulário deve solicitar: RG, CPF, Nome, Endereço completo, Profissão, e até 3 entidades empregadoras com respectivos rendimentos.
- CPF deve ser válido e único no sistema.
- E-mail deve ser único no sistema.
- Senha deve ter no mínimo 8 caracteres, incluindo letras e números.
- Após cadastro bem-sucedido, o usuário deve ser redirecionado para a tela de login.

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

### HU-02 — Cadastro de Agente (Empresa)
**Como** uma empresa,  
**Quero** me cadastrar no sistema informando os dados da minha organização,  
**Para que** eu possa avaliar e gerenciar pedidos de aluguel.

**Critérios de Aceitação:**
- O formulário deve solicitar: CNPJ, Razão Social, Endereço, E-mail, Telefone.
- CNPJ deve ser válido e único no sistema.
- Após cadastro, o agente deve poder realizar login imediatamente.

**Prioridade:** Alta  
**Estimativa:** 3 pontos

---

### HU-03 — Login no Sistema
**Como** um usuário cadastrado (cliente, agente ou admin geral),  
**Quero** realizar login com meu e-mail e senha,  
**Para que** eu possa acessar as funcionalidades do sistema de acordo com meu perfil.

**Critérios de Aceitação:**
- O sistema deve autenticar com e-mail e senha.
- Após login bem-sucedido, um token JWT deve ser gerado e armazenado.
- O dashboard exibido deve ser diferente para clientes, agentes e admin geral.
- Credenciais inválidas devem exibir mensagem de erro clara.

**Prioridade:** Alta  
**Estimativa:** 3 pontos

---

## Épico 2: Gestão de Pedidos de Aluguel (Cliente)

### HU-04 — Introduzir Pedido de Aluguel
**Como** um cliente,  
**Quero** criar um novo pedido de aluguel selecionando um veículo e período,  
**Para que** eu possa solicitar o aluguel de um automóvel.

**Critérios de Aceitação:**
- O cliente deve poder visualizar veículos disponíveis antes de criar o pedido.
- O pedido deve conter: veículo selecionado, data de início e data de fim.
- O sistema deve calcular automaticamente o valor total com base na diária do veículo.
- O pedido deve ser criado com status PENDENTE.
- O cliente deve receber confirmação visual da criação do pedido.

**Prioridade:** Alta  
**Estimativa:** 8 pontos

---

### HU-05 — Consultar Meus Pedidos
**Como** um cliente,  
**Quero** visualizar todos os meus pedidos de aluguel,  
**Para que** eu possa acompanhar o status e histórico das minhas solicitações.

**Critérios de Aceitação:**
- A lista deve exibir: veículo, período, valor total, status atual.
- Deve ser possível filtrar por status (Pendente, Em Análise, Aprovado, Rejeitado, Cancelado).
- Ao clicar em um pedido, o cliente deve ver todos os detalhes, incluindo análise financeira (se houver).

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

### HU-06 — Modificar Pedido de Aluguel
**Como** um cliente,  
**Quero** alterar as datas ou o veículo de um pedido existente,  
**Para que** eu possa ajustar minha solicitação antes da avaliação.

**Critérios de Aceitação:**
- Apenas pedidos com status PENDENTE podem ser modificados.
- O valor total deve ser recalculado automaticamente.
- O sistema deve validar a disponibilidade do novo veículo/período.

**Prioridade:** Média  
**Estimativa:** 5 pontos

---

### HU-07 — Cancelar Pedido de Aluguel
**Como** um cliente,  
**Quero** cancelar um pedido de aluguel que ainda não foi aprovado,  
**Para que** eu possa desistir da solicitação quando necessário.

**Critérios de Aceitação:**
- Apenas pedidos com status PENDENTE ou EM_ANÁLISE podem ser cancelados.
- O sistema deve solicitar confirmação antes do cancelamento.
- Após cancelamento, o veículo associado deve ser liberado para novas reservas.
- O status do pedido deve ser atualizado para CANCELADO.

**Prioridade:** Média  
**Estimativa:** 3 pontos

---

## Épico 3: Avaliação e Gestão de Pedidos (Agente)

### HU-08 — Avaliar Pedido Financeiramente
**Como** um agente,  
**Quero** analisar os dados financeiros do cliente solicitante,  
**Para que** eu possa emitir um parecer financeiro sobre a viabilidade do aluguel.

**Critérios de Aceitação:**
- O agente deve visualizar dados completos do cliente: profissão, empregadores e rendimentos.
- O agente deve poder registrar parecer (aprovado/rejeitado) com observações.
- Após análise:
  - Parecer positivo → pedido avança para status EM_ANÁLISE.
  - Parecer negativo → pedido é atualizado para REJEITADO.

**Prioridade:** Alta  
**Estimativa:** 8 pontos

---

### HU-09 — Aprovar Execução de Contrato
**Como** um agente,  
**Quero** aprovar a execução do contrato de aluguel após análise financeira positiva,  
**Para que** o contrato possa ser formalizado e o aluguel efetivado.

**Critérios de Aceitação:**
- Apenas pedidos com análise financeira positiva podem ser aprovados.
- O status do pedido deve ser atualizado para APROVADO.
- O agente deve poder opcionalmente associar um contrato de crédito.

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

### HU-10 — Modificar Pedido como Agente
**Como** um agente,  
**Quero** modificar dados de um pedido de aluguel,  
**Para que** eu possa ajustar condições antes da aprovação final.

**Critérios de Aceitação:**
- O agente pode modificar pedidos em status PENDENTE ou EM_ANÁLISE.
- As modificações devem ser registradas com timestamp.

**Prioridade:** Média  
**Estimativa:** 3 pontos

---

## Épico 4: Gestão de Veículos

### HU-11 — Cadastrar Veículo
**Como** um agente,  
**Quero** cadastrar novos veículos no sistema,  
**Para que** eles fiquem disponíveis para aluguel pelos clientes.

**Critérios de Aceitação:**
- O cadastro deve incluir: matrícula, ano, marca, modelo, placa, tipo de propriedade (Cliente, Empresa, Banco), valor da diária.
- A placa deve ser única no sistema.
- O veículo deve ser criado com status disponível.

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

### HU-12 — Consultar Veículos Disponíveis
**Como** um cliente,  
**Quero** navegar pelo catálogo de veículos disponíveis,  
**Para que** eu possa escolher o automóvel ideal para meu aluguel.

**Critérios de Aceitação:**
- A lista deve exibir: marca, modelo, ano, placa, valor da diária.
- Deve ser possível filtrar por marca, modelo e faixa de preço.
- Apenas veículos disponíveis devem ser exibidos.

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

## Épico 5: Contratos de Crédito

### HU-13 — Criar Contrato de Crédito
**Como** um agente,  
**Quero** criar um contrato de crédito vinculado a um pedido de aluguel aprovado,  
**Para que** o cliente possa financiar o aluguel através de um banco agente.

**Critérios de Aceitação:**
- O contrato deve incluir: valor, taxa de juros, número de parcelas, banco agente responsável.
- O contrato deve ser vinculado a um pedido de aluguel aprovado.
- O sistema deve calcular o valor das parcelas automaticamente.

**Prioridade:** Média  
**Estimativa:** 8 pontos

---

## Épico 6: Gerenciamento de Perfil

### HU-14 — Atualizar Meu Perfil
**Como** um usuário (cliente, agente ou admin geral),  
**Quero** atualizar meus dados cadastrais através de um modal acessado pelo ícone de perfil na barra lateral,  
**Para que** minhas informações estejam sempre atualizadas.

**Critérios de Aceitação:**
- O cliente pode atualizar: nome, profissão, endereço (com busca automática de CEP), empregadores e rendimentos (com máscaras de telefone e moeda).
- O agente pode atualizar: razão social, telefone (com máscara), endereço (com busca automática de CEP).
- O admin geral pode atualizar: nome.
- CPF, CNPJ, RG e e-mail não podem ser alterados (exibidos como somente leitura).
- As alterações devem ser validadas antes de persistidas.
- O nome exibido na sidebar deve ser atualizado após salvar.

**Prioridade:** Média  
**Estimativa:** 5 pontos

---

## Épico 7: Administração do Sistema

### HU-15 — Visualizar Painel de Usuários
**Como** o admin geral (dono da empresa),  
**Quero** visualizar um painel com métricas do sistema e listagem de todos os usuários,  
**Para que** eu tenha visão completa da operação da empresa.

**Critérios de Aceitação:**
- O painel deve exibir cards com: total de clientes, total de agentes, total de veículos, total de pedidos e pedidos ativos.
- Deve listar todos os usuários (clientes e agentes) em uma tabela.
- Deve permitir busca por nome/e-mail e filtro por tipo de usuário (todos, clientes, agentes).
- Cada usuário deve ter botões de ação: ver detalhes e excluir.
- A tela de usuários é a tela principal do admin (não possui dashboard separado).

**Prioridade:** Alta  
**Estimativa:** 8 pontos

---

### HU-16 — Consultar Detalhes de Cliente (Admin)
**Como** o admin geral,  
**Quero** visualizar os dados completos de um cliente específico incluindo seus pedidos,  
**Para que** eu possa acompanhar a atividade de cada cliente.

**Critérios de Aceitação:**
- Deve exibir dados pessoais do cliente: nome, e-mail, CPF (com máscara), RG, profissão, endereço.
- Deve exibir empregadores com rendimentos formatados em moeda.
- Deve exibir estatísticas: renda total, total gasto, pedidos ativos e total de pedidos.
- Deve listar todos os pedidos do cliente com status, veículo, período e valor.

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

### HU-17 — Consultar Detalhes de Agente (Admin)
**Como** o admin geral,  
**Quero** visualizar os dados completos de um agente específico incluindo seus veículos e pedidos,  
**Para que** eu possa acompanhar a atividade de cada empresa.

**Critérios de Aceitação:**
- Deve exibir dados da empresa: razão social, e-mail, CNPJ (com máscara), telefone (com máscara), endereço.
- Deve exibir estatísticas: receita total, veículos disponíveis, veículos alugados e total de pedidos.
- Deve listar todos os veículos da empresa com status de disponibilidade.
- Deve listar todos os pedidos associados ao agente.

**Prioridade:** Alta  
**Estimativa:** 5 pontos

---

## Épico 8: Gestão de Usuários

### HU-18 — Excluir Usuário do Sistema
**Como** o admin geral,  
**Quero** poder excluir usuários (clientes ou agentes) do sistema,  
**Para que** eu possa gerenciar as contas cadastradas.

**Critérios de Aceitação:**
- O sistema deve solicitar confirmação antes de excluir o usuário.
- O admin não pode excluir a si mesmo.
- Após exclusão, o usuário deve desaparecer da listagem.
- Mensagem de sucesso deve ser exibida após a exclusão.

**Prioridade:** Média  
**Estimativa:** 3 pontos

---

## Épico 9: Testes de Carga

### HU-19 — Executar Testes de Carga Comparativos (MVC vs WebFlux)
**Como** o admin geral,  
**Quero** executar testes de carga comparando Spring MVC (bloqueante) e Spring WebFlux (reativo) em tempo real,  
**Para que** eu possa demonstrar e analisar as diferenças de performance entre as duas arquiteturas.

**Critérios de Aceitação:**
- O módulo deve ser acessível apenas pelo Admin Geral.
- Deve haver 4 tipos de teste: Leitura de Banco, Simulação de I/O, Carga Concorrente e Carga Mista.
- O usuário pode configurar: total de requisições, nível de concorrência e latência de I/O simulada.
- Os testes devem ser executados primeiro no MVC e depois no WebFlux, com progresso em tempo real via SSE.
- As métricas coletadas devem incluir: tempo total, latência média/mín/máx, percentis P50/P95/P99, throughput, threads pico e memória.
- Os resultados devem ser exibidos lado a lado com indicadores visuais de vencedor por métrica.
- Deve haver barras de comparação visual da distribuição de latência.
- Uma análise automática textual dos resultados deve ser gerada.
- Deve haver histórico dos últimos 10 testes executados na sessão.
- Todos os elementos devem suportar modo claro e escuro.

**Prioridade:** Alta  
**Estimativa:** 13 pontos

---

## Épico 10: Modo Claro/Escuro

### HU-20 — Alternar Tema Claro/Escuro
**Como** qualquer usuário do sistema,  
**Quero** alternar entre modo claro e escuro na interface,  
**Para que** eu possa usar o sistema com o tema visual que melhor se adapta ao meu ambiente e preferência.

**Critérios de Aceitação:**
- Deve haver um botão de alternância (ícone 🌙/☀️) na sidebar, entre o perfil e o logout.
- O tema escolhido deve ser persistido no localStorage e mantido entre recarregamentos.
- Na primeira visita, o sistema deve detectar a preferência do sistema operacional (`prefers-color-scheme`).
- Todas as páginas, componentes, modais, inputs, tabelas, cards e botões devem ter variantes visuais para modo escuro.
- A transição entre temas deve ser suave.

**Prioridade:** Média  
**Estimativa:** 8 pontos

---

## Resumo do Backlog

| ID    | História                                  | Prioridade | Pontos |
|-------|-------------------------------------------|------------|--------|
| HU-01 | Cadastro de Cliente                       | Alta       | 5      |
| HU-02 | Cadastro de Agente                        | Alta       | 3      |
| HU-03 | Login no Sistema                          | Alta       | 3      |
| HU-04 | Introduzir Pedido de Aluguel              | Alta       | 8      |
| HU-05 | Consultar Meus Pedidos                    | Alta       | 5      |
| HU-06 | Modificar Pedido de Aluguel               | Média      | 5      |
| HU-07 | Cancelar Pedido de Aluguel                | Média      | 3      |
| HU-08 | Avaliar Pedido Financeiramente            | Alta       | 8      |
| HU-09 | Aprovar Execução de Contrato              | Alta       | 5      |
| HU-10 | Modificar Pedido como Agente              | Média      | 3      |
| HU-11 | Cadastrar Veículo                         | Alta       | 5      |
| HU-12 | Consultar Veículos Disponíveis            | Alta       | 5      |
| HU-13 | Criar Contrato de Crédito                 | Média      | 8      |
| HU-14 | Atualizar Meu Perfil                      | Média      | 5      |
| HU-15 | Visualizar Painel de Usuários           | Alta       | 8      |
| HU-16 | Consultar Detalhes de Cliente (Admin)     | Alta       | 5      |
| HU-17 | Consultar Detalhes de Agente (Admin)      | Alta       | 5      |
| HU-18 | Excluir Usuário do Sistema                | Média      | 3      |
| HU-19 | Executar Testes de Carga (MVC vs WebFlux) | Alta       | 13     |
| HU-20 | Alternar Tema Claro/Escuro                | Média      | 8      |
| **Total** |                                       | —          | **108** |
