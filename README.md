# Financial Pig

Financial Pig is a mobile-first PWA for simple financial and stock control.
The MVP focuses on login, dashboard, sales, credit sales, payments, purchases,
stock, consumption, expenses, fixed costs, and monthly summary.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- PWA
- Vercel or Netlify

## Product Rules

- The app has one authenticated user, created manually in Supabase.
- There is no in-app user registration.
- Supabase PostgreSQL is the source of truth.
- Cash balance only changes when money is effectively received or paid.
- Receivables stay separate from cash balance.
- Revenue represents the total sold value.
- Stock must never become negative.
- Relevant records use soft delete with `ativo = false`.
- Secrets must stay out of Git. Use `.env.local` locally and `.env.example` as reference.

## Quality Approach

This project does not use automated tests. Quality is controlled through:

- Constitution gates in `.specify/memory/constitution.md`
- Spec Kit planning documents
- Manual validation in `docs/manual-validation.md`
- Deployed PWA verification before final delivery

## Documentation

- Constitution: `.specify/memory/constitution.md`
- Manual validation: `docs/manual-validation.md`
- Feature specs and plans: `specs/[feature]/`

### Spec-Driven Development (MVP feature)

The active MVP feature follows the Spec Kit documents under
`specs/001-mvp-financial-pig/`:

- Specification: [specs/001-mvp-financial-pig/spec.md](specs/001-mvp-financial-pig/spec.md)
- Plan: [specs/001-mvp-financial-pig/plan.md](specs/001-mvp-financial-pig/plan.md)
- Research: [specs/001-mvp-financial-pig/research.md](specs/001-mvp-financial-pig/research.md)
- Schema: [specs/001-mvp-financial-pig/schema.md](specs/001-mvp-financial-pig/schema.md)
- Data model: [specs/001-mvp-financial-pig/data-model.md](specs/001-mvp-financial-pig/data-model.md)
- UI flow contracts: [specs/001-mvp-financial-pig/contracts/ui-flows.md](specs/001-mvp-financial-pig/contracts/ui-flows.md)
- Quickstart (manual validation): [specs/001-mvp-financial-pig/quickstart.md](specs/001-mvp-financial-pig/quickstart.md)
- Tasks: [specs/001-mvp-financial-pig/tasks.md](specs/001-mvp-financial-pig/tasks.md)

When a feature is created, keep its `spec.md`, `plan.md`, `schema.md`,
`quickstart.md`, and `tasks.md` aligned with the constitution.

## Local Environment

Create a local environment file from `.env.example`:

```bash
cp .env.example .env.local
```

Fill the Supabase values locally or in the deployment provider. Do not commit
real environment files.

## Supabase Setup

The app connection and the database schema are separate steps:

- `.env.local` connects the React app to Supabase Auth/API.
- Supabase CLI applies the SQL migrations in `supabase/migrations/` to the
  remote database.

Install and authenticate the Supabase CLI, then link this repository to the
remote project:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Apply pending migrations:

```bash
supabase db push --dry-run
supabase db push
```

The single app user is created manually in Supabase Auth. The app does not
provide an in-app registration flow.

On first login the app calls the `inicializar_dados` RPC, which creates the
settings row and seeds the default stock items (Porcos/leitões, Milho, Ração)
for that user. It is idempotent and safe to run on every login.

## Usage

1. Sign in with the single Supabase user (no in-app registration).
2. On first login the baseline data is seeded automatically (settings + default
   stock items).
3. Início (dashboard): cash, receivables, revenue, costs, profit, stock and pig
   indicators for the selected month, plus quick-add shortcuts.
4. Vendas: register paid/partial/credit sales (stock and receivables update
   automatically); open a sale to see its effects or inactivate it. "Contas a
   receber" lists open sales and registers later payments.
5. Estoque: view stock, register purchases by total paid value, manual movements
   (entrada/saída/perda/ajuste), and corn/feed consumption.
6. Despesa / Gasto fixo (dashboard shortcuts): record animal expenses and
   fixed/construction costs separately.
7. Relatórios: monthly summary, pig analysis, and a filterable history.
8. Perfil: set the initial cash ("Começou com quanto?"), install the PWA, and
   sign out. The dashboard cash balance starts from this value.

## Deployment (Vercel or Netlify)

Deployed URL: [https://financial-pig.vercel.app/](https://financial-pig.vercel.app/)

The app is a static SPA built with Vite plus an installable PWA service worker.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables (set in the hosting provider):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- SPA routing: add a catch-all rewrite to `/index.html` so deep links work.
  - Netlify: add `public/_redirects` with `/*  /index.html  200`, or
  - Vercel: add a rewrite of `/(.*)` to `/index.html` in `vercel.json`.

After deploying, validate PWA installability on a mobile browser and record the
manual validation results in `docs/manual-validation.md`.

### PWA

- Manifest: `public/manifest.webmanifest` (name, theme color `#ec4899`, icons).
- Icons: `public/icons/` (`icon.svg`, `icon-192.png`, `icon-512.png`,
  `icon-180.png` for Apple touch).
- Service worker: configured via `vite-plugin-pwa` in `vite.config.ts`
  (`registerType: autoUpdate`, SPA `navigateFallback`).

## Manual validation status

This project uses documented manual validation instead of automated tests (see
[docs/manual-validation.md](docs/manual-validation.md)). All nine user stories
are implemented and the app builds clean (`npm run typecheck`, `npm run build`).

Pending manual validation (require a live Supabase project and/or a deploy):

- Per user story: T031 (auth), T041 (dashboard), T052 (sales), T060
  (receivables), T071 (stock), T078 (costs), T088 (reports/soft delete), T095
  (PWA on deploy), T110 (initial cash).
- Final delivery: T100 (record dataset results) and T102 (full quickstart
  checklist). T103 is complete: the deployed URL is recorded above.

## CI

The GitHub workflow performs repository hygiene checks only. It does not run
automated tests.
