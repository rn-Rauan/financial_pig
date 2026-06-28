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
- **RLS is enabled** on all business tables; each policy scopes rows to
  `auth.uid()`. Verify with a second user (or by querying without a session)
  that no cross-user rows are visible.
- Default stock items (Porcos/leitões `cabeca`, Milho `saca`, Ração `saca`) are
  seeded after first login/configuration, per `schema.md`.
- Local run: `npm install` then `npm run dev`, opened at a mobile-width
  viewport. Do not add or run automated test commands.

> Note: RPC functions in `002_business_rpcs.sql` are stubs that intentionally
> raise "not yet implemented" until their respective user-story phase. Coupled
> financial/stock flows cannot be validated end-to-end until those phases land.

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
