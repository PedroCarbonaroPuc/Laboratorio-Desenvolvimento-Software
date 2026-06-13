# Frontend - Arquitetura e UX

## Visao geral

O frontend foi reorganizado em React + TypeScript com foco em modularizacao por dominio, reutilizacao de componentes e manutencao.

## Estrutura principal

- `src/App.tsx`: orquestrador de estado global de sessao e dados.
- `src/app/state.ts`: tipos de estado e contratos de formularios.
- `src/components/public`: experiencia publica (login, cadastro e catalogo).
- `src/components/private`: paineis por papel (aluno, professor, parceiro).
- `src/components/shared`: componentes compartilhados (ex.: extrato/transacoes).
- `src/services/api.ts`: cliente HTTP tipado para backend.

## Principios aplicados

1. Separacao de responsabilidades: estado e chamadas API ficam no orquestrador; UI fica em componentes de dominio.
2. Reuso: listas e blocos de UI compartilhados evitam duplicacao.
3. Tipagem forte: formularios e payloads com tipos dedicados.
4. Fluxo por papel: componentes especificos para STUDENT, PROFESSOR e PARTNER.

## Design system premium

Direcao visual adotada:

- Tipografia: `Space Grotesk` (titulos) + `Sora` (texto corrido).
- Atmosfera: gradientes organicos com paleta academia + tecnologia (emerald, amber, navy).
- Componentes: cards transluidos, sombras suaves, hierarquia visual clara.
- Motion: animacoes de entrada e formas fluidas para reforcar identidade.
- Responsividade: breakpoints para layout 2 colunas e 1 coluna sem perda funcional.

## Acessibilidade e usabilidade

- Formularios com labels explicitas.
- Feedback global de estado de operacao (banner de status).
- Estados de botao desabilitado durante operacoes assincronas.
- Navegacao por perfil com chamadas de erro tratadas e mensagens claras.

## Evolucoes recomendadas

- Introduzir testes de componente com React Testing Library.
- Criar camada de hooks para estado remoto (ex.: React Query).
- Expandir biblioteca de componentes para um design system versionado.
