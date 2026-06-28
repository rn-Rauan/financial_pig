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
- Preferred migration command after `supabase login` and `supabase link`:
  `supabase db push --dry-run`, then `supabase db push`.
- **RLS is enabled** on all business tables; each policy scopes rows to
  `auth.uid()`. Verify with a second user (or by querying without a session)
  that no cross-user rows are visible.
- Default stock items (Porcos/leitões `cabeca`, Milho `saca`, Ração `saca`) are
  seeded after first login/configuration, per `schema.md`.
- Local run: `npm install` then `npm run dev`, opened at a mobile-width
  viewport. Do not add or run automated test commands.

> Note: `registrar_venda` is now implemented (migration 004). The remaining RPCs
> in `002_business_rpcs.sql` (`registrar_pagamento_venda`, `registrar_compra`,
> `registrar_movimentacao_estoque`, `registrar_consumo`, `inativar_registro`)
> are still stubs that raise "not yet implemented" until their user-story phase.

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

> Note: later payments on partial/credit sales (US4) and purchases/consumption
> (US5) are still stubs, so end-to-end receivables settlement and stock refills
> via the app come in those phases. Sales (US3) are fully functional now.

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
