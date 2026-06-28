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

## CI

The GitHub workflow performs repository hygiene checks only. It does not run
automated tests.
