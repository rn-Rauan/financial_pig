# Research: Financial Pig MVP

**Date**: 2026-06-28

## Decision: Single React/Vite PWA

**Rationale**: The constitution requires React, TypeScript, Vite, Tailwind CSS,
mobile-first UX, and installable PWA behavior. A single frontend app keeps the
MVP simple while still supporting modular feature folders.

**Alternatives considered**:

- React Native: rejected because the MVP targets browser/PWA and no app-store
  publication.
- Multi-app monorepo: rejected because the MVP has one app and one backend
  service.

## Decision: Supabase Auth + PostgreSQL + RLS as Source of Truth

**Rationale**: Supabase is required by the constitution and aligns with the
current DER. All business data should be persisted in PostgreSQL, protected by
RLS, and scoped to the authenticated user.

**Alternatives considered**:

- Local-only storage: rejected because persistence, integrity, and sync are
  required.
- Custom backend API: rejected for MVP because Supabase already provides auth,
  database, RLS, and RPC support.

## Decision: Atomic RPCs for Coupled Financial/Stock Operations

**Rationale**: Sales, purchases, payments, cancellations, and stock movements
change multiple records and must not partially succeed. Supabase RPC functions
allow transaction-safe operations close to the database rules.

**Alternatives considered**:

- Multiple independent client writes: rejected because failures can leave stock,
  payments, and balances inconsistent.
- Client-only validation: rejected because stock and financial integrity must be
  protected even if the UI has a bug.

## Decision: Derived Dashboard and Reports

**Rationale**: Dashboard, monthly summary, receivables, and pig analysis should be
derived from active sales, payments, purchases, expenses, fixed costs, stock, and
configuration. This reduces duplicate state and keeps calculations auditable.

**Alternatives considered**:

- Store every aggregate value directly: rejected because it increases risk of
  stale totals.
- Client-only aggregates from all rows: acceptable for tiny data, but views/RPCs
  are preferred for consistent formulas and performance.

## Decision: Soft Delete with Financial and Stock Reversal Rules

**Rationale**: The constitution requires `ativo = false` for relevant records.
Inactivating or cancelling records that have financial/stock effects must also
record compensating movement or safely reverse the original effect.

**Alternatives considered**:

- Physical deletion: rejected by governance and history requirements.
- Hide-only soft delete without reversal: rejected because dashboard and stock
  values would become inaccurate.

## Decision: Manual Validation Instead of Automated Tests

**Rationale**: The user explicitly decided that the project will not use
automated tests. Validation must be documented and executable manually against a
known dataset and deployed PWA.

**Alternatives considered**:

- Unit/integration test suite: rejected for this project version.
- No validation: rejected because financial and stock behavior is high risk.
