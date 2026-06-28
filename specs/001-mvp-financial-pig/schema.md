# Schema: Financial Pig MVP

This document defines the Supabase/PostgreSQL schema expected by the MVP. It is
the technical source for migrations under `supabase/migrations/`.

## Global Rules

- Every business table MUST include `id`, `user_id`, `ativo`, `created_at`, and
  `updated_at` unless noted otherwise.
- `user_id` references `auth.users(id)` and defaults to `auth.uid()` for inserts
  performed by the authenticated user.
- Normal list queries MUST filter `ativo = true`.
- Soft delete uses `ativo = false`; normal app flows MUST NOT physically delete
  records.
- Monetary values use `numeric(12,2)`.
- Quantities use `numeric(12,3)` where decimal quantity may exist.
- All money and quantity values MUST be non-negative unless a specific adjustment
  effect is explicitly allowed.
- Stock quantity MUST never become negative.
- All coupled operations that change multiple tables SHOULD be implemented as
  transaction-safe RPC functions.

## Enums / Check Values

Use PostgreSQL enums or text with check constraints. Enums are preferred once the
values are stable.

```text
sale_type: porco_carne, milho, racao, outros
sale_status: pago, parcial, fiado
purchase_type: porcos_leitoes, milho, racao, outros
stock_unit: cabeca, saca, kg, unidade
stock_movement_type: entrada, saida, consumo, perda, ajuste
animal_expense_category: racao, milho_consumo, remedio, veterinario, transporte,
  funcionario, manutencao, outros
fixed_cost_category: construcao, reforma, equipamentos, ferramentas, latas,
  baldes, canos, arames, madeiras, telhas, materiais_diversos, outros
history_type: venda_registrada, pagamento_recebido, compra_registrada,
  estoque_movimentado, consumo_registrado, despesa_registrada,
  gasto_fixo_registrado, venda_cancelada, registro_inativado
```

## Tables

### configuracoes

One settings row for the authenticated user.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key, default `gen_random_uuid()` |
| user_id | uuid | not null, references `auth.users(id)`, unique |
| capital_inicial | numeric(12,2) | not null default 0, >= 0 |
| nome_sistema | text | not null default `Financial Pig` |
| moeda | text | not null default `BRL` |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### clientes

Optional customers for sales and credit control.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| nome | text | not null, trimmed length > 0 |
| telefone | text | nullable |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### vendas

Sales of pork/meat, corn, feed, or other products.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| cliente_id | uuid | nullable, references `clientes(id)` |
| nome_cliente | text | nullable |
| tipo_venda | sale_type | not null |
| produto | text | not null |
| quantidade | numeric(12,3) | not null, > 0 |
| unidade | stock_unit | not null |
| animais_utilizados | integer | required > 0 when `tipo_venda = porco_carne` |
| preco_unitario | numeric(12,2) | not null, > 0 |
| valor_total | numeric(12,2) | not null, computed by RPC/client as quantity * price |
| valor_pago | numeric(12,2) | not null default 0, >= 0, <= total |
| valor_restante | numeric(12,2) | not null, total - paid |
| status_pagamento | sale_status | not null |
| data_venda | date | not null |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

Required checks:

- `valor_total = round(quantidade * preco_unitario, 2)` when stored.
- `valor_restante = valor_total - valor_pago`.
- `status_pagamento` matches paid/remaining values.
- `valor_pago <= valor_total`.
- `animais_utilizados is not null and animais_utilizados > 0` for pork/meat.

### pagamentos_venda

Later payments for partial or credit sales. The initial paid amount may be stored
on the sale itself; later payments are stored here.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| venda_id | uuid | not null, references `vendas(id)` |
| valor | numeric(12,2) | not null, > 0 |
| data_pagamento | date | not null |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### compras

Purchases of pigs, corn, feed, or other items.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| tipo_compra | purchase_type | not null |
| produto | text | not null |
| quantidade | numeric(12,3) | not null, > 0 |
| unidade | stock_unit | not null |
| valor_unitario | numeric(12,2) | not null, > 0 |
| valor_total | numeric(12,2) | not null |
| fornecedor | text | nullable |
| data_compra | date | not null |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### despesas_animais

Monthly animal-related expenses.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| categoria | animal_expense_category | not null |
| valor | numeric(12,2) | not null, > 0 |
| descricao | text | not null |
| data_despesa | date | not null |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### gastos_fixos

Fixed or structural/construction costs.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| categoria | fixed_cost_category | not null |
| valor | numeric(12,2) | not null, > 0 |
| descricao | text | not null |
| data_gasto | date | not null |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### estoque_itens

Current stock-controlled items.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| nome | text | not null |
| quantidade_atual | numeric(12,3) | not null default 0, >= 0 |
| unidade | stock_unit | not null |
| estoque_minimo | numeric(12,3) | nullable, >= 0 |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

Recommended seeded rows for MVP:

- Porcos/leitões, unit `cabeca`
- Milho, unit `saca`
- Ração, unit `saca`

### estoque_movimentacoes

Audit record for stock changes.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| estoque_item_id | uuid | not null, references `estoque_itens(id)` |
| venda_id | uuid | nullable, references `vendas(id)` |
| compra_id | uuid | nullable, references `compras(id)` |
| tipo_movimentacao | stock_movement_type | not null |
| quantidade | numeric(12,3) | not null, > 0 |
| motivo | text | not null |
| data_movimentacao | date | not null |
| observacao | text | nullable |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |
| updated_at | timestamptz | not null default now() |

### historico

Human-readable history for important operations.

| Column | Type | Rules |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | not null |
| tipo | history_type | not null |
| entidade | text | not null |
| entidade_id | uuid | nullable |
| descricao | text | not null |
| valor | numeric(12,2) | nullable |
| quantidade | numeric(12,3) | nullable |
| data_evento | timestamptz | not null default now() |
| ativo | boolean | not null default true |
| created_at | timestamptz | not null default now() |

## Views / RPC Read Models

### dashboard_mensal

Input: month/year or date range.

Returns:

- receita_total
- receita_porco_carne
- receita_milho
- receita_racao
- receita_outros
- compras_total
- compras_porcos
- compras_milho
- compras_racao
- despesas_animais_total
- gastos_fixos_total
- contas_a_receber
- saldo_atual
- lucro_bruto
- lucro_liquido
- lucro_operacional
- estoque_porcos
- estoque_milho
- estoque_racao
- total_kg_porco_carne
- total_animais_utilizados
- media_kg_por_cabeca
- valor_medio_por_cabeca
- valor_medio_por_kg

### resumo_mensal

Same period rules as dashboard, with grouped totals suitable for the monthly
summary screen.

### analise_porcos

Returns only pig/meat sale indicators for selected period, ignoring inactive or
cancelled sales and avoiding division by zero.

## Required RPC Functions

### registrar_venda

Atomically:

1. Validate sale input.
2. Check stock when sale type affects stock.
3. Insert sale with calculated total, paid, remaining, and status.
4. Insert related stock movement when applicable.
5. Update stock item quantity.
6. Insert history entry.

Must reject overpayment, missing animals for pork/meat, invalid quantity/value,
and insufficient stock.

### registrar_pagamento_venda

Atomically:

1. Lock/read sale.
2. Validate payment value > 0 and <= remaining.
3. Insert payment row.
4. Update sale paid, remaining, and status.
5. Insert history entry.

### registrar_compra

Atomically:

1. Validate purchase input.
2. Insert purchase with calculated total.
3. Increase stock for pigs/corn/feed purchase types.
4. Insert stock movement when stock is affected.
5. Insert history entry.

### registrar_movimentacao_estoque

Atomically:

1. Validate stock movement input.
2. Calculate stock effect.
3. Reject negative resulting stock.
4. Insert stock movement.
5. Update stock item quantity.
6. Insert history entry.

### registrar_consumo

May call `registrar_movimentacao_estoque` with type `consumo`, but must restrict
items to corn/feed and reject insufficient stock.

### inativar_registro

Atomically soft-deletes a supported record and applies compensating effects when
needed. Sales with stock or payment effects require special handling to avoid
incorrect dashboard/stock totals.

## RLS Policy Pattern

Enable RLS on every business table.

For each table with `user_id`:

```sql
create policy "select own rows"
on table_name for select
using (auth.uid() = user_id);

create policy "insert own rows"
on table_name for insert
with check (auth.uid() = user_id);

create policy "update own rows"
on table_name for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Physical deletes should not be exposed to app users. Prefer no delete policy, or
allow deletes only during controlled administrative maintenance outside the app.

## Migration Notes

- Use `gen_random_uuid()`; enable `pgcrypto` if needed.
- Add `updated_at` trigger for mutable tables.
- Add database-level checks for positive money/quantity values.
- Add database-level stock negative protection.
- Seed default stock items after first login/configuration creation or via a
  setup RPC.
- Keep environment values in `.env.local` and `.env.example`; never commit real
  secrets.
