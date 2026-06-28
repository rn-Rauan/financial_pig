# Tela 02 — Dashboard / Início

**HU:** HU02 · **RF:** RF18 · **RNF:** RNF01, RNF06 · **RD:** RD60–RD65

## Objetivo
Resumir, em uma tela, a situação financeira e operacional do negócio no mês selecionado.

## Indicadores exibidos
**Caixa**
- **Saldo atual** = capital inicial + recebido − compras − despesas dos animais − gastos fixos. **Só valores efetivamente pagos** (RD61).
- **Contas a receber** (fiados) — exibido **separado**, não entra no saldo (RD62).

**Receitas** (separadas por tipo — RD07): Total · Porco/Carne · Milho · Ração (+ Outros).

**Saídas:** Compras (total) · Despesas dos animais · Gastos fixos/construção.

**Resultado:** Lucro bruto · Lucro líquido · Lucro operacional (sem construção — RD65).

**Estoque atual:** Porcos (cabeças) · Milho (sacas) · Ração (sacas).

## Botões e ações
- Seletor de **mês**.
- Atalhos: **+ Venda** (04), **+ Compra** (11), **+ Despesa** (15).
- Avatar → Perfil (20). Cards de estoque → Estoque (12).

## Regras de cálculo
- `lucroBruto = receitaTotal − custosDiretos` (compras de porcos/milho/ração + remédio/veterinário + despesas diretas dos animais).
- `lucroLiquido = lucroBruto − despesas gerais − gastos fixos/construção`.
- `lucroOperacional = receitaTotal − compras − despesas dos animais` (ignora construção).
- Receita total pode considerar valor vendido, mas **não** representa caixa (RD60).

## Estados da tela
- **Carregando:** skeletons nos cards.
- **Vazio:** "R$ 0" e estoque "—" + dica "Registre sua primeira venda/compra".
- **Erro:** banner "Não foi possível carregar" + Tentar novamente.
- **Com dados:** valores preenchidos.

## Navegação
- Tabs: Início · Vendas · Estoque · Relatórios · Perfil. Atalhos de criação.

## Dados necessários do Supabase
- Agregações de `vendas`, `pagamentos`, `compras`, `despesas_animais`, `gastos_fixos`, `estoque`, `config` (capital inicial).
- Ideal: `views`/RPC para somatórios por mês (resposta < 3s, RNF06).

## Notas de implementação (PWA / React)
- Recarregar ao focar a tela; pull-to-refresh.
- Realtime do Supabase para refletir alterações entre dispositivos (HU24).
