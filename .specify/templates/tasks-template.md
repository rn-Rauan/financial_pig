---
description: "Task list template for Financial Pig feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories),
research.md, schema.md, contracts/

**Validation**: Automated tests are not part of this project. Every story MUST
include manual validation tasks that reference the acceptance scenarios,
financial rules, stock rules, and mobile-first behavior.

**Organization**: Tasks are grouped by user story to enable independent
implementation, manual validation, deployment, and demonstration.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or has no dependency
- **[Story]**: User story mapping, such as US1, US2, or US3
- Include exact file paths in descriptions
- Do not create `tests/` directories or automated test tasks

## Path Conventions

- **Application**: `src/`
- **Feature modules**: `src/features/[feature]/`
- **Shared UI**: `src/components/`
- **Pages/routes**: `src/pages/` and `src/routes/`
- **Shared services**: `src/lib/`
- **Supabase schema/migrations**: `supabase/migrations/`
- **Manual validation docs**: `docs/manual-validation.md` or feature `quickstart.md`

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md, prioritized P1, P2, P3...
  - Constitution rules from .specify/memory/constitution.md
  - Technical context from plan.md
  - Supabase schema/RLS from schema.md
  - Manual validation steps from quickstart.md and acceptance scenarios

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling

- [ ] T001 Create or update the React/Vite/TypeScript project structure
- [ ] T002 Configure Tailwind CSS and global mobile-first styles
- [ ] T003 [P] Configure Supabase environment variable placeholders in `.env.example`
- [ ] T004 [P] Configure PWA manifest and installable app assets
- [ ] T005 [P] Configure linting/formatting scripts without automated test scripts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user stories

**Critical**: No user story work starts until this phase is complete.

- [ ] T006 Define Supabase schema changes in `schema.md`
- [ ] T007 Create Supabase migration(s) in `supabase/migrations/`
- [ ] T008 Configure Supabase Auth access flow for the manually created single user
- [ ] T009 Implement RLS policies for all relevant tables
- [ ] T010 Implement shared Supabase client utilities in `src/lib/`
- [ ] T011 Implement shared financial calculation helpers in `src/lib/`
- [ ] T012 Implement shared stock validation helpers in `src/lib/`
- [ ] T013 Document manual validation setup in `docs/manual-validation.md` or `quickstart.md`

**Checkpoint**: Foundation ready. Login, data access, RLS, and schema assumptions
are manually validated before feature work continues.

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story delivers]

**Manual Validation**: [How to verify this story independently on a mobile viewport]

### Implementation for User Story 1

- [ ] T014 [P] [US1] Implement UI components in `src/features/[feature]/components/`
- [ ] T015 [P] [US1] Implement Supabase queries/mutations in `src/features/[feature]/`
- [ ] T016 [US1] Implement business rules in `src/features/[feature]/`
- [ ] T017 [US1] Connect route/page in `src/pages/` or `src/routes/`
- [ ] T018 [US1] Handle loading, empty, error, and soft-deleted states

### Manual Validation for User Story 1

- [ ] T019 [US1] Validate acceptance scenarios from `spec.md` on mobile viewport
- [ ] T020 [US1] Validate affected financial totals and receivables behavior
- [ ] T021 [US1] Validate affected stock behavior, including non-negative stock
- [ ] T022 [US1] Update `quickstart.md` or `docs/manual-validation.md` with findings

**Checkpoint**: User Story 1 is functional, manually validated, and demonstrable.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Manual Validation**: [How to verify this story independently on a mobile viewport]

### Implementation for User Story 2

- [ ] T023 [P] [US2] Implement UI components in `src/features/[feature]/components/`
- [ ] T024 [P] [US2] Implement Supabase queries/mutations in `src/features/[feature]/`
- [ ] T025 [US2] Implement business rules in `src/features/[feature]/`
- [ ] T026 [US2] Integrate with existing US1 components or data if needed
- [ ] T027 [US2] Handle loading, empty, error, and soft-deleted states

### Manual Validation for User Story 2

- [ ] T028 [US2] Validate acceptance scenarios from `spec.md` on mobile viewport
- [ ] T029 [US2] Validate affected financial totals and receivables behavior
- [ ] T030 [US2] Validate affected stock behavior, including non-negative stock
- [ ] T031 [US2] Update `quickstart.md` or `docs/manual-validation.md` with findings

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Manual Validation**: [How to verify this story independently on a mobile viewport]

### Implementation for User Story 3

- [ ] T032 [P] [US3] Implement UI components in `src/features/[feature]/components/`
- [ ] T033 [P] [US3] Implement Supabase queries/mutations in `src/features/[feature]/`
- [ ] T034 [US3] Implement business rules in `src/features/[feature]/`
- [ ] T035 [US3] Integrate with previous stories if needed
- [ ] T036 [US3] Handle loading, empty, error, and soft-deleted states

### Manual Validation for User Story 3

- [ ] T037 [US3] Validate acceptance scenarios from `spec.md` on mobile viewport
- [ ] T038 [US3] Validate affected financial totals and receivables behavior
- [ ] T039 [US3] Validate affected stock behavior, including non-negative stock
- [ ] T040 [US3] Update `quickstart.md` or `docs/manual-validation.md` with findings

**Checkpoint**: Desired user stories are functional and manually validated.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

- [ ] TXXX [P] Update README and SDD links
- [ ] TXXX [P] Review mobile layout and touch targets across core screens
- [ ] TXXX [P] Review accessibility labels, focus states, and readable contrast
- [ ] TXXX Review financial calculations across dashboard, sales, payments, and expenses
- [ ] TXXX Review stock updates across purchases, sales, and consumption
- [ ] TXXX Review Supabase RLS policies and soft delete filters
- [ ] TXXX Run manual validation from `docs/manual-validation.md`
- [ ] TXXX Deploy to Vercel or Netlify and record the deployed URL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on setup and blocks all user stories
- **User Stories (Phase 3+)**: Depend on foundational completion
- **Polish (Final Phase)**: Depends on all desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Starts after foundational work; must deliver the MVP slice
- **User Story 2 (P2)**: Starts after foundational work; may integrate with US1
- **User Story 3 (P3)**: Starts after foundational work; may integrate with US1/US2

### Within Each User Story

- Schema/RLS changes before Supabase queries
- Business rules before UI integration
- Core implementation before manual validation
- Manual validation before checkpoint completion

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Independent UI components and data utilities can run in parallel
- Different user stories can run in parallel after foundational work if team capacity allows

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete setup
2. Complete foundational Supabase, RLS, and shared helper work
3. Complete User Story 1
4. Manually validate User Story 1 on mobile viewport
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + foundational work -> foundation ready
2. Add User Story 1 -> manual validation -> deploy/demo
3. Add User Story 2 -> manual validation -> deploy/demo
4. Add User Story 3 -> manual validation -> deploy/demo
5. Each story adds value without breaking previous stories

## Notes

- [P] tasks = different files, no dependency
- [Story] label maps a task to a user story
- Manual validation replaces automated tests for this project
- Commit after each task or logical group
- Stop at checkpoints to validate behavior independently
- Avoid vague tasks, hidden test requirements, and data rules outside Supabase/RLS
