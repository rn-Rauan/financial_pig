# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript for a React/Vite web application

**Primary Dependencies**: React, Vite, Tailwind CSS, Supabase client, PWA tooling

**Storage**: Supabase PostgreSQL with Supabase Auth and Row Level Security

**Validation**: Manual validation only; automated tests are intentionally out of scope

**Target Platform**: Mobile-first installable web app (PWA), deployed to Vercel or Netlify

**Project Type**: Single frontend application with Supabase backend services

**Performance Goals**: Fast mobile interaction for core sales, stock, receivables, and dashboard flows

**Constraints**: Type-safe code, protected environment variables, soft delete for relevant records,
RLS-protected data access, stock never negative, receivables separate from cash balance

**Scale/Scope**: Single authenticated user, manually created in Supabase, focused MVP business flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The plan MUST satisfy the current constitution before research/design work continues:

- Mobile-first screens with simple navigation and few fields per step.
- TypeScript-first modular structure; avoid `any` and separate business rules from UI.
- Supabase Auth/PostgreSQL/RLS as the source of truth; no local-only financial state.
- Financial and stock rules preserve cash balance, receivables, revenue, and non-negative stock.
- MVP scope stays focused on login, dashboard, sales, receivables, payments, purchases,
  stock, consumption, expenses, fixed costs, and monthly summary.
- Manual validation path is documented; do not add automated test requirements unless the
  constitution is amended first.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── schema.md            # Phase 1 output: Supabase/PostgreSQL schema and RLS rules
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app/
├── components/
├── features/
├── lib/
├── pages/
├── routes/
└── styles/
├── public/
├── supabase/
│   └── migrations/
└── docs/
    └── manual-validation.md
```

**Structure Decision**: Use a single React/Vite PWA backed by Supabase. Keep
feature-specific UI, queries, and business rules grouped under `src/features/`;
keep shared Supabase/client utilities under `src/lib/`. Do not create `tests/`
directories for this project.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
