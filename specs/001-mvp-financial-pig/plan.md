# Implementation Plan: Financial Pig MVP

**Branch**: `001-mvp-financial-pig` | **Date**: 2026-06-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-mvp-financial-pig/spec.md`

## Summary

Build Financial Pig as a mobile-first PWA for a single authenticated user to
control sales, receivables, payments, purchases, stock, consumption, animal
expenses, fixed/construction costs, dashboard indicators, monthly summary,
history, and pig performance analysis. Supabase is the source of truth and
manual validation replaces automated tests.

## Technical Context

**Language/Version**: TypeScript for a React/Vite web application

**Primary Dependencies**: React, Vite, Tailwind CSS, Supabase client,
React Router, PWA tooling

**Storage**: Supabase PostgreSQL with Supabase Auth, Row Level Security, SQL
constraints/triggers, and RPC functions for atomic business operations

**Validation**: Manual validation only; automated tests are intentionally out of
scope

**Target Platform**: Mobile-first installable web app (PWA), deployed to Vercel
or Netlify

**Project Type**: Single frontend application with Supabase backend services

**Performance Goals**: Common mobile operations and dashboard loads complete in
under 3 seconds for MVP-scale data

**Constraints**: Type-safe code, protected environment variables, soft delete for
relevant records, RLS-protected data access, non-negative stock, receivables
separate from cash balance

**Scale/Scope**: Single authenticated user, manually created in Supabase, focused
MVP business flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Mobile-first screens with simple navigation and few fields per step: PASS.
- TypeScript-first modular structure; avoid `any` and separate business rules
  from UI: PASS.
- Supabase Auth/PostgreSQL/RLS as source of truth: PASS.
- Financial and stock rules preserve cash balance, receivables, revenue, and
  non-negative stock: PASS.
- MVP scope covers login, dashboard, sales, receivables, payments, purchases,
  stock, consumption, expenses, fixed costs, and monthly summary: PASS.
- Manual validation path is documented and no automated test requirements are
  added: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-mvp-financial-pig/
├── spec.md
├── research.md
├── plan.md
├── schema.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-flows.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── sales/
│   ├── receivables/
│   ├── customers/
│   ├── purchases/
│   ├── stock/
│   ├── expenses/
│   ├── reports/
│   └── profile/
├── lib/
│   ├── calculations/
│   ├── supabase/
│   └── validation/
├── pages/
├── routes/
└── styles/
public/
supabase/
└── migrations/
docs/
└── manual-validation.md
```

**Structure Decision**: Use a single React/Vite PWA backed by Supabase. Keep
feature-specific UI, queries, mutations, and business rules grouped under
`src/features/`; keep shared Supabase utilities, calculations, and validation
helpers under `src/lib/`. Do not create automated test directories.

## Phase 0: Research

Research decisions are captured in [research.md](research.md).

## Phase 1: Design

Design artifacts:

- [schema.md](schema.md): Supabase/PostgreSQL schema, constraints, RLS, and RPCs
- [data-model.md](data-model.md): entity relationships and validation mapping
- [contracts/ui-flows.md](contracts/ui-flows.md): screen and flow contracts
- [quickstart.md](quickstart.md): manual validation guide

## Post-Design Constitution Check

- Mobile-first prototype docs are available and implementation structure maps
  screens to feature modules: PASS.
- Schema includes `user_id`, RLS, soft delete, constraints, and RPC boundaries:
  PASS.
- Business operations requiring multiple writes are planned as atomic RPCs:
  PASS.
- Manual validation covers core financial, stock, auth, PWA, and deploy gates:
  PASS.

## Complexity Tracking

No constitution violations are required for this MVP.
