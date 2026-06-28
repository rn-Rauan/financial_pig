# Tela 18 — Análise de porcos (desempenho)

**HU:** HU19 · **RF:** RF06, RF07, RF24 · **RD:** RD67–RD72

## Objetivo
Mostrar indicadores das vendas de porcos para saber se a compra dos leitões está compensando.

## Indicadores exibidos
- Total de kg vendidos (RD67)
- Total de animais utilizados (RD68)
- Média geral de kg por cabeça (RD69/RD72)
- Valor médio geral por cabeça (RD70/RD72)
- Valor médio geral por kg vendido (RD72)
- Receita total com porcos/carne
- **Compra × Venda:** gasto comprando leitões × vendido em carne × resultado

## Botões e ações
- **Seletor de período** (mês/intervalo).

## Regras de cálculo
- `média kg/cabeça = total kg ÷ total animais`.
- `valor médio/cabeça = total vendido carne ÷ total animais`.
- `valor médio/kg = total vendido carne ÷ total kg`.
- Apenas vendas **ativas** do tipo Porco/Carne; ignora milho/ração/outros e canceladas (RD72).
- Se total de animais = 0 → não dividir (exibir 0).

## Estados da tela
- **Carregando:** skeleton dos cards.
- **Vazio:** "Sem vendas de porcos no período".
- **Erro:** banner + Tentar novamente.
- **Com dados:** indicadores e comparação preenchidos.

## Navegação
- Tab Relatórios. ← Resumo mensal (17).

## Dados necessários do Supabase
- Agregações em `vendas` (tipo Porco/Carne, ativo=true) e `compras` (tipo Porcos) por período.

## Notas de implementação (PWA / React)
- Guard contra divisão por zero (RD72).
- Comparação compra×venda ajuda a decidir preço/kg e compra de leitões.
