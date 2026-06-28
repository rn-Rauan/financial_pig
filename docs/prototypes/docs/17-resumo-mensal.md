# Tela 17 — Resumo mensal

**HU:** HU18 · **RF:** RF19 · **RD:** RD66, RD69, RD70

## Objetivo
Mostrar o resultado do negócio em um mês selecionável.

## Indicadores exibidos
- Total vendido (e por tipo: Porco/Carne, Milho, Ração)
- Total comprado (e por tipo: Porcos, Milho, Ração)
- Total de despesas dos animais
- Total de gastos fixos/construção
- Total em fiados / contas a receber
- **Lucro bruto mensal** e **Lucro líquido mensal**
- Saldo do período
- Porcos no mês: kg vendidos, animais utilizados, média kg/cabeça, valor médio/cabeça, valor médio/kg

## Botões e ações
- **Seletor de mês** (◀ ▶).
- Tocar uma linha → histórico filtrado do mês.

## Regras de validação
- Cálculos por período (RD66). Sem dados no mês → exibir zeros.

## Estados da tela
- **Carregando:** skeleton dos totais.
- **Vazio:** "Sem movimentações neste mês".
- **Erro:** banner + Tentar novamente.
- **Com dados:** totais preenchidos.

## Navegação
- Tab Relatórios. → Histórico (19), Análise de porcos (18).

## Dados necessários do Supabase
- Agregações por mês de `vendas`, `compras`, `despesas_animais`, `gastos_fixos`, `pagamentos`.
- Ideal: RPC/view com parâmetro de mês.

## Notas de implementação (PWA / React)
- Cuidar de divisão por zero nas médias (sem animais → 0).
- Base para exportação futura (PDF/Excel — RNF20).
