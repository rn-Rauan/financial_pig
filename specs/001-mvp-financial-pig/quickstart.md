# Quickstart: Manual Validation for Financial Pig MVP

Financial Pig does not use automated tests. This guide defines the manual
validation path for the MVP before final delivery.

## Prerequisites

- Supabase project configured.
- Single user created manually in Supabase Auth.
- Environment variables configured locally and in deployment:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Supabase CLI installed and linked to the remote project, or access to the
  Supabase SQL Editor.
- Database migrations applied from `supabase/migrations/`.
- RLS enabled on all business tables.
- App deployed to Vercel or Netlify for final validation.

## Supabase Database Setup

Use Supabase CLI for the Prisma-like migration flow:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --dry-run
supabase db push
```

This applies the SQL files under `supabase/migrations/` to the linked remote
Supabase database. The application environment variables still need to be set
separately in `.env.local` and in the deployment provider.

If Supabase CLI is not available, run the migration files manually in the
Supabase SQL Editor in filename order.

## Local Run

After the application is implemented:

```bash
npm install
npm run dev
```

Open the local URL on a mobile-width viewport. Do not add or run automated test
commands for this project.

## Validation Dataset

Use a fresh month and record the expected values by hand while validating.

Recommended starting data:

- Capital initial: R$ 1.000,00
- Stock:
  - Porcos/leitões: 10 cabeças
  - Milho: 20 sacas
  - Ração: 15 sacas

Recommended operations:

1. Paid pork/meat sale:
   - 40 kg at R$ 20,00/kg
   - 2 animals used
   - paid R$ 800,00
2. Partial corn sale:
   - 2 sacks at R$ 70,00
   - paid R$ 40,00
3. Credit feed sale:
   - 1 sack at R$ 90,00
   - paid R$ 0,00
4. Later payment on corn sale:
   - R$ 100,00
5. Purchase pigs:
   - 3 heads, R$ 1000,00 total
   - average shown: R$ 333,33/head
6. Purchase feed:
   - 5 sacks, R$ 400,00 total
   - average shown: R$ 80,00/sack
7. Consumption:
   - 1 sack of corn
8. Animal expense:
   - Medicine, R$ 50,00
9. Fixed/construction cost:
   - Construction material, R$ 120,00

## Manual Validation Scenarios

### 1. Authentication and Protected Routes

Expected:

- Valid credentials open dashboard.
- Invalid credentials show a clear error.
- Internal routes cannot be accessed without a session.
- There is no user registration screen.

### 2. Dashboard and Cash Rules

Expected:

- Revenue uses total sold values.
- Cash balance includes only received sale money, later payments, capital, and
  paid outgoing values.
- Receivables are separate from cash balance.
- Dashboard values match hand calculation for the validation dataset.

### 3. Sales

Expected:

- Sale total is quantity multiplied by unit price.
- Total is read-only/calculated.
- Paid sale status is Paid.
- Partial sale status is Partial.
- Credit sale status is Credit/Fiado.
- Paid amount cannot exceed total.
- Pork/meat sale requires animals used.
- Pork/meat sale calculates kg/head and value/head.

### 4. Receivables and Later Payments

Expected:

- Partial and credit sales appear in receivables.
- Later payment cannot exceed remaining amount.
- Later payment increases cash balance only by the payment value.
- Status changes to Paid when remaining amount reaches zero.

### 5. Stock and Consumption

Expected:

- Pig purchase increases pig stock.
- Feed/corn purchase increases the correct stock item.
- Pork/meat sale decreases pig stock by animals used.
- Corn/feed sale decreases stock by quantity sold.
- Consumption decreases corn/feed stock and is not a sale.
- Any operation that would make stock negative is blocked.

### 6. Expenses and Fixed Costs

Expected:

- Animal expense decreases cash balance and appears separately.
- Fixed/construction cost decreases cash balance and appears separately.
- Operational result can be understood without construction cost distortion.

### 7. Monthly Summary, Pig Analysis, and History

Expected:

- Monthly summary reflects only selected month.
- Pig analysis ignores non-pig sales and inactive/cancelled records.
- Division by zero is avoided when there are no pig sales or animals.
- History shows sales, payments, purchases, stock movements, consumption,
  expenses, fixed costs, cancellations, and inactivations.

### 8. Soft Delete / Inactivation

Expected:

- Inactivated records use `ativo = false`.
- Normal lists hide inactive records.
- Inactivation of records with financial or stock effects keeps totals and stock
  consistent through reversal or compensating movement.

### 9. PWA and Deployment

Expected:

- Deployed app opens on Android browser.
- App can be installed where browser support is available.
- Installed app opens in standalone mode with Financial Pig name/icon/colors.
- README includes deployed URL, technologies, usage instructions, and SDD links.

## Final Delivery Checklist

- [ ] Login works.
- [ ] Protected routes work.
- [ ] Sales CRUD works for paid, partial, and credit sales.
- [ ] Sale total, paid, remaining, and status are correct.
- [ ] Receivables are separate from cash balance.
- [ ] Stock updates correctly and never becomes negative.
- [ ] Purchases, consumption, expenses, and fixed costs update the expected totals.
- [ ] Soft delete/inactivation works.
- [ ] Dashboard and reports match manual calculations.
- [ ] PWA installability is validated on mobile.
- [ ] Deployed URL works.
- [ ] README links to constitution, spec, plan, schema, quickstart, and tasks.
