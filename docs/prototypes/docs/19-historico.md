# Tela 19 — Histórico

**HU:** HU13, HU20, HU22 · **RF:** RF22, RF23 · **RD:** RD78, RD79

## Objetivo
Acompanhar todas as movimentações: vendas, compras, despesas, gastos fixos, estoque, consumo e pagamentos.

## Campos exibidos
- Filtros (chips): Tudo · Vendas · Compras · Despesas · Gastos fixos · Estoque · Pagamentos.
- Busca + filtros: Data, Tipo, Categoria, Produto, Cliente, Status.
- Lista agrupada por data; por item: ícone/tipo, descrição, valor (+/−) ou variação de estoque.

## Botões e ações
- Aplicar filtros / busca.
- Tocar item → tela de detalhe correspondente.

## Regras de validação
- Mostra registros ativos nas listagens principais; inativos só em histórico/auditoria (RD78).
- Ordenar por data desc.

## Estados da tela
- **Carregando:** skeleton.
- **Vazio:** "Sem registros para os filtros selecionados".
- **Erro:** banner + Tentar novamente.
- **Com dados:** timeline por dia.

## Navegação
- → Detalhes da venda (05), Compras (10), Despesas (15), Gastos fixos (16), Estoque (12). Tab ativa: Relatórios.

## Dados necessários do Supabase
- Consulta unificada (UNION/view) de vendas, compras, despesas_animais, gastos_fixos, movimentacoes_estoque, pagamentos.
- Filtros server-side (RNF06).

## Notas de implementação (PWA / React)
- Lista agrupada por dia (section list).
- Entradas em verde (+), saídas em vermelho (−); movimentos de estoque neutros.
