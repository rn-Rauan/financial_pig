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

When a feature is created, keep its `spec.md`, `plan.md`, `schema.md`,
`quickstart.md`, and `tasks.md` aligned with the constitution.

## Local Environment

Create a local environment file from `.env.example`:

```bash
cp .env.example .env.local
```

Fill the Supabase values locally or in the deployment provider. Do not commit
real environment files.

## CI

The GitHub workflow performs repository hygiene checks only. It does not run
automated tests.
