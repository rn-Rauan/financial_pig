# Manual Validation

Financial Pig does not use automated tests. Every feature must be validated by
following concrete manual steps before it is considered complete.

## Local Supabase Setup Assumptions

These assumptions support the foundational setup (Phases 1–2) and all later
validation:

- A Supabase project exists and is the single source of truth.
- The single app user is created manually in **Supabase Auth** (there is no
  in-app registration).
- Environment variables are configured in `.env.local` (copied from
  `.env.example`) and in the deployment provider:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Database migrations are applied in order from `supabase/migrations/`:
  1. `001_initial_schema.sql` — tables, enums, constraints, `updated_at`
     triggers, RLS policies, and stock non-negative protection.
  2. `002_business_rpcs.sql` — stubs for `registrar_venda`,
     `registrar_pagamento_venda`, `registrar_compra`,
     `registrar_movimentacao_estoque`, `registrar_consumo`, and
     `inativar_registro` (full logic lands in their user-story phases).
  3. `003_dashboard_read_model.sql` - read-only `dashboard_mensal` RPC for
     dashboard indicators.
  4. `004_registrar_venda.sql` — real `registrar_venda` RPC (replaces the stub):
     atomic sale + stock + history with non-negative stock protection.
  5. `005_registrar_pagamento_venda.sql` — real `registrar_pagamento_venda` RPC
     (replaces the stub): atomic later payment that updates the sale's
     paid/remaining/status and writes payment + history rows.
  6. `006_registrar_compra.sql` — real `registrar_compra` RPC: atomic purchase
     that increases pig/corn/feed stock and writes movement + history rows.
  7. `007_registrar_movimentacao_estoque.sql` — real
     `registrar_movimentacao_estoque` RPC: entrada/saida/perda by delta and
     ajuste by absolute quantity, with non-negative stock protection.
  8. `008_registrar_consumo.sql` — real `registrar_consumo` RPC: corn/feed-only
     consumption exit with insufficient-stock rejection.
  9. `009_registrar_despesa_animal.sql` — real `registrar_despesa_animal` RPC:
     atomic animal-expense record + history.
  10. `010_registrar_gasto_fixo.sql` — real `registrar_gasto_fixo` RPC: atomic
      fixed/construction-cost record + history.
  11. `011_inativar_registro.sql` — real `inativar_registro` RPC: soft delete
      (ativo = false) with compensating stock reversal for sales/purchases.
- Preferred migration command after `supabase login` and `supabase link`:
  `supabase db push --dry-run`, then `supabase db push`.
- **RLS is enabled** on all business tables; each policy scopes rows to
  `auth.uid()`. Verify with a second user (or by querying without a session)
  that no cross-user rows are visible.
- Default stock items (Porcos/leitões `cabeca`, Milho `saca`, Ração `saca`) are
  seeded after first login/configuration, per `schema.md`.
- Local run: `npm install` then `npm run dev`, opened at a mobile-width
  viewport. Do not add or run automated test commands.

> Note: all business RPCs are now implemented (migrations 004–011). The stubs in
> `002_business_rpcs.sql` are fully replaced via `create or replace` /
> `inativar_registro`; no "not yet implemented" stub remains.

## Required Validation

- Validate on a mobile-width viewport first.
- Validate login with the single Supabase user.
- Validate protected routes reject unauthenticated access.
- Validate Supabase RLS permits only the intended authenticated access.
- Validate soft-deleted records with `ativo = false` disappear from normal views.
- Validate deployment URL after the feature is complete.

## Financial Rules

- Cash balance changes only when money is actually received or paid.
- Credit sales and partially paid sales keep remaining amounts in receivables.
- Revenue reflects the total sold value, not only the amount paid.
- Payments reduce receivables and update cash balance only by the paid amount.
- Expenses and purchases reduce cash balance only when paid.

## Stock Rules

- Purchases increase stock.
- Sales and consumption reduce stock.
- Stock must never become negative.
- Failed stock operations must leave previous quantities unchanged.

## Feature Checklist

For each user story, record:

- Feature branch and feature document path.
- Mobile viewport used for validation.
- Supabase user used for validation.
- Steps performed.
- Expected result.
- Actual result.
- Any issue found and whether it was fixed.

## Pending Validation by User Story

These scenarios are implemented and build-clean, but still require a live
Supabase project + the manually-created user to be validated (tasks T031, T041).
Record results here when executed.

### US1 - Secure Mobile Access (T031) — pending

1. Valid credentials open the dashboard (`/`).
2. Invalid credentials show "E-mail ou senha inválidos." without internal detail.
3. Opening any protected route while logged out redirects to `/login`.
4. There is no in-app registration screen/link.
5. Logout from Perfil returns to `/login` and protected routes are blocked again.

### US2 - Understand Business Status (T041) — pending

1. With the quickstart dataset loaded, dashboard totals match hand calculation:
   cash balance, receivables (separate from cash), revenue by type, purchases,
   expenses, fixed costs, gross/operational/net profit, stock, and pig
   indicators.
2. Month selector changes the selected month and monthly figures update; cash,
   receivables, and stock reflect current cumulative state.
3. A month with no movement and zero balances shows the empty state.
4. Pig averages show "—" (not an error) when there are no animals/kg.
5. Data-load failure shows the retryable error state.

### US3 - Register Sales and Payments (T052) — pending

Seed stock first (quickstart dataset): Porcos/leitões 10 cabeças, Milho 20
sacas, Ração 15 sacas. Then register sales and verify totals, status,
receivables, cash, and stock.

1. Paid pork/meat sale: 40 kg @ R$ 20,00, 2 animals, paid R$ 800,00 →
   status Pago, restante R$ 0,00, total R$ 800,00; pig stock 10 → 8;
   kg/cabeça = 20, valor/cabeça = R$ 400,00.
2. Partial corn sale: 2 sacas @ R$ 70,00, paid R$ 40,00 → status Parcial,
   restante R$ 100,00; corn stock 20 → 18; appears in contas a receber.
3. Credit (fiado) feed sale: 1 saca @ R$ 90,00, paid R$ 0,00 → status Fiado,
   restante R$ 90,00; feed stock 15 → 14; appears in contas a receber.
4. "Outros" sale: no stock effect; totals/status still correct.
5. Overpayment attempt (paid > total) is rejected with a clear message and no
   record is created (client validation blocks; RPC also rejects).
6. Pork/meat sale without animals is rejected.
7. Sale exceeding available stock is rejected and stock is unchanged.
8. Cash balance increases only by amounts actually paid; receivables stay
   separate; dashboard reflects revenue by type and current stock.

> Note: purchases/consumption (US5) are still stubs, so stock refills via the app
> come in that phase. Sales (US3) and later payments (US4) are functional now.

### US4 - Manage Credit Sales and Later Payments (T060) — pending

Builds on the US3 receivables (the partial corn sale, restante R$ 100,00, and the
credit feed sale, restante R$ 90,00). Open "Vendas → Contas a receber".

1. Receivables list shows only active sales with status Parcial or Fiado; the
   "Total a receber" equals the sum of the listed remaining amounts.
2. Filters by customer/name, status, type, and date range narrow the list; the
   total updates accordingly.
3. Partial payment: on the corn sale (restante R$ 100,00), pay R$ 60,00 →
   restante becomes R$ 40,00, status stays Parcial, and cash balance increases by
   exactly R$ 60,00 (receivables drop by R$ 60,00).
4. Full payment: pay the remaining R$ 40,00 (or use "Pagar restante") → status
   becomes Pago, restante R$ 0,00, and the sale leaves the receivables list.
5. Overpayment rejection: a payment greater than the remaining amount is blocked
   with a clear message (client validation blocks; RPC also rejects) and no
   payment row is created.
6. No-customer receivable: a credit/partial sale registered with a free name (or
   no customer) still appears and can be paid; the name is shown.
7. History records each `pagamento_recebido`; the sale's later payments are
   reflected in `pagamentos_venda` without double-counting cash on the dashboard.

### US5 - Control Purchases, Stock, and Consumption (T071) — pending

Open "Estoque" (tab) and use the actions (Nova compra, Movimentar, Consumo).

1. Purchase pigs: 3 cabeças @ R$ 150,00 → purchase saved, total R$ 450,00, pig
   stock increases by 3, cash balance decreases by R$ 450,00, history shows
   `compra_registrada`.
2. Purchase feed: 5 sacas @ R$ 80,00 → feed stock increases by 5, cash decreases
   by R$ 400,00.
3. "Outros" purchase: saved with no stock effect; cash still decreases.
4. Stock entrada/saida/perda: each changes the item quantity by the delta and
   records a movement; saida/perda beyond available stock is rejected
   ("Estoque insuficiente...") and the quantity is unchanged.
5. Ajuste: set an item to a new absolute count (e.g. physical count) → stock
   becomes that value; a no-op adjustment (same value) is rejected.
6. Consumption: 1 saca of corn → corn stock drops by 1, recorded as `consumo`
   (no cash effect); selecting/forcing a non-corn/feed item is rejected
   ("Consumo permitido apenas para milho ou ração.").
7. Negative-stock blocking: any operation that would drive stock below zero is
   rejected and leaves the previous quantity intact.
8. Dashboard stock cards and "Estoque atual" reflect the resulting quantities.

> Note: only `inativar_registro` (soft delete with compensation, US7) remains a
> stub. Sales, payments, purchases, stock movements, and consumption are all
> functional now.

### US6 - Register Costs and Separate Construction (T078) — pending

Reach the screens via the dashboard shortcuts (Despesa / Gasto fixo).

1. Animal expense: register Remédio R$ 50,00 → appears in "Despesas dos animais"
   list, cash balance decreases by R$ 50,00, and the dashboard "Despesas animais"
   card increases by R$ 50,00 for the month.
2. Fixed/construction cost: register Construção (material) R$ 120,00 → appears in
   "Gastos fixos / construção" list, cash decreases by R$ 120,00, and the
   dashboard "Gastos fixos" card increases by R$ 120,00.
3. Separation: animal expenses and fixed costs are shown in distinct lists and
   distinct dashboard cards; `lucro_operacional` excludes the fixed/construction
   cost (it only drops by the animal expense), while `lucro_liquido` drops by
   both — so construction does not distort the operational result.
4. Validation: empty description, non-positive value, missing category, or
   invalid date are rejected with clear messages (client blocks; RPC re-validates).
5. History records `despesa_registrada` and `gasto_fixo_registrado`.

### US7 - Review Monthly Results and History (T088) — pending

Open the "Relatórios" tab (Resumo / Porcos / Histórico sub-tabs).

1. Monthly summary: for the selected month, the grouped totals (receitas by type,
   compras by type, despesas animais, gastos fixos, lucro bruto/operacional/
   líquido, saldo, contas a receber) match the dashboard and a hand calculation.
2. Period selector changes the month and the monthly figures update.
3. Pig analysis: shows kg, animals, kg/head, value/head, value/kg for pig sales;
   a month with no pig sales shows the empty state (no division-by-zero errors).
4. History: lists sales, payments, purchases, stock movements, consumption,
   expenses, fixed costs, and inactivations, newest first.
5. History filters (search, type, date range) narrow the list and "Limpar
   filtros" resets them.
6. Soft delete (inactivation):
   - Inativar a sale (from its detail) → stock removed is returned, linked
     payments are inactivated, the sale leaves lists/receivables, dashboard and
     stock update, and a `venda_cancelada` event appears in history.
   - Inativar a purchase whose stock is still available → stock is reversed and
     the purchase leaves the list; if the purchased stock was already used, the
     inactivation is rejected with a clear message and nothing changes.
   - Inativar an animal expense / fixed cost → it leaves the list and the
     dashboard/summary totals drop accordingly; a `registro_inativado` event is
     recorded.
   - Inactivated records never reappear in normal lists (all queries filter
     `ativo = true`).

> Note on scope: `inativar_registro` also supports `clientes`, but there is no
> customers screen in the MVP, so customer inactivation is not surfaced in the
> UI. Stock items are not inactivated (they are managed via movements).

## Final Delivery Gate

Before final delivery, confirm:

- Login works.
- Protected routes work.
- Main sales flow works.
- Total, paid, remaining, and status values are correct.
- Receivables are separate from cash balance.
- Stock updates correctly.
- Soft delete is applied.
- Deployment works.
- SDD documents are present and linked from README when available.
