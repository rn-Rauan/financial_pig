# Financial Pig Constitution

## Core Principles

### I. Mobile-First Simplicity
O sistema deve priorizar o uso em celular, com interface simples, poucos campos por tela, navegação objetiva e fluxo acessível para pessoas com pouca experiência tecnológica.

### II. Type-Safe and Modular Development
O código deve ser desenvolvido em TypeScript, evitando uso de `any`, organizando funcionalidades por módulos ou features, separando regras de negócio da interface e reutilizando componentes sempre que possível.

### III. Supabase as Source of Truth
O Supabase com PostgreSQL deve ser a fonte oficial dos dados do sistema, utilizando Supabase Auth, Row Level Security, persistência automática, schema consistente e variáveis de ambiente protegidas.

### IV. Financial and Stock Integrity
Saldo, receita, contas a receber, compras, despesas e estoque devem seguir regras rigorosas. O saldo representa apenas dinheiro efetivamente recebido ou pago, contas a receber ficam separadas do saldo, receita representa o valor total vendido e o estoque nunca pode ficar negativo.

### V. MVP First, Extensible Later
A primeira versão deve priorizar o fluxo principal do negócio: login, dashboard, vendas, fiados, pagamentos, compras, estoque, consumo, despesas, gastos fixos e resumo mensal. Funcionalidades avançadas devem permanecer para evolução posterior.

## Technical Constraints
As tecnologias obrigatórias para esta implementação são:

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- PWA
- Vercel ou Netlify

Outras restrições técnicas e de negócio:

- Usuário único autenticado;
- Não haverá cadastro de usuário dentro do app;
- O usuário será criado manualmente no Supabase;
- O cadastro de clientes é opcional;
- Uma venda pode ter cliente cadastrado, nome de cliente digitado manualmente ou nenhum cliente informado;
- Vendas fiadas ou parciais não exigem cliente cadastrado;
- Soft delete deve ser utilizado com ativo = false para todos os registros relevantes;
- O acesso aos dados deve ser protegido por RLS;
- O arquivo .env não deve ser versionado;
- A aplicação deve ser instalável como PWA;
- Não haverá publicação na Google Play nesta versão.

## Development Workflow
O fluxo de desenvolvimento deve seguir esta ordem:

1. Constitution
2. Specify
3. Plan
4. Tasks
5. Implement
6. Deploy

Além disso:

- Requisitos devem orientar o arquivo schema.md;
- Requisitos não funcionais e o schema devem orientar o arquivo plan.md;
- As tasks devem ser derivadas do plano;
- A implementação deve seguir as tasks definidas;
- O deploy deve ser realizado antes da entrega final;
- O README deve conter link do sistema, tecnologias utilizadas, instruções de uso e os arquivos SDD.

## Quality Gates
A entrega só será considerada adequada quando atender aos critérios mínimos abaixo:

- Login funcionando;
- Rotas protegidas;
- CRUD principal de vendas funcionando;
- Cálculo correto de valor total, valor pago, valor restante e status;
- Fiados separados do saldo;
- Estoque atualizado corretamente;
- Soft delete aplicado;
- Deploy funcionando;
- Os documentos constitution.md, schema.md e plan.md presentes no repositório.

## Governance
Esta constituição tem prioridade sobre decisões futuras do projeto.

Qualquer alteração em tecnologia, banco, autenticação, forma de cálculo financeiro ou regra de estoque deve ser registrada na documentação correspondente do projeto.

**Version**: 1.0.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28
