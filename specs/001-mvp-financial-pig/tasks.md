# Tasks: Financial Pig MVP

**Input**: Design documents from `specs/001-mvp-financial-pig/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[schema.md](schema.md), [data-model.md](data-model.md), [contracts/](contracts/),
[quickstart.md](quickstart.md)

**Validation**: Automated tests are not part of this project. Every story includes
manual validation tasks.

**Organization**: Tasks are grouped by user story to enable incremental
implementation and validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the app and baseline project structure.

- [x] T001 Create React/Vite/TypeScript app files in `package.json`, `index.html`, `src/main.tsx`, and `src/app/App.tsx`
- [x] T002 Configure Tailwind CSS in `tailwind.config.ts`, `postcss.config.js`, and `src/styles/globals.css`
- [x] T003 [P] Configure TypeScript settings in `tsconfig.json` and `tsconfig.node.json`
- [x] T004 [P] Configure Vite and path aliases in `vite.config.ts`
- [x] T005 [P] Add Supabase environment placeholders to `.env.example`
- [x] T006 [P] Create feature folder structure under `src/features/`
- [x] T007 [P] Create shared folders under `src/components/`, `src/lib/`, `src/pages/`, and `src/routes/`
- [x] T008 [P] Configure PWA manifest and base icons in `public/manifest.webmanifest` and `public/icons/`
- [x] T009 Add app shell layout in `src/app/AppShell.tsx`
- [x] T010 Add README SDD links for `specs/001-mvp-financial-pig/` in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data, auth, routing, and business-rule infrastructure required
before user stories.

**Critical**: No user story work starts until this phase is complete.

- [x] T011 Create initial Supabase migration from `schema.md` in `supabase/migrations/001_initial_schema.sql`
- [x] T012 Add enums/check constraints for sale, purchase, stock, expense, fixed cost, and history values in `supabase/migrations/001_initial_schema.sql`
- [x] T013 Add `updated_at` trigger helper in `supabase/migrations/001_initial_schema.sql`
- [x] T014 Add RLS policies for all business tables in `supabase/migrations/001_initial_schema.sql`
- [x] T015 Add stock non-negative database protection in `supabase/migrations/001_initial_schema.sql`
- [x] T016 Add RPC stubs for `registrar_venda`, `registrar_pagamento_venda`, `registrar_compra`, `registrar_movimentacao_estoque`, `registrar_consumo`, and `inativar_registro` in `supabase/migrations/002_business_rpcs.sql`
- [x] T017 Create Supabase client in `src/lib/supabase/client.ts`
- [x] T018 Create typed environment validation in `src/lib/config/env.ts`
- [x] T019 Create shared route guard utilities in `src/routes/guards.tsx`
- [x] T020 Create shared currency, number, and date formatting helpers in `src/lib/format/`
- [x] T021 Create financial calculation helpers in `src/lib/calculations/financial.ts`
- [x] T022 Create stock calculation helpers in `src/lib/calculations/stock.ts`
- [x] T023 Create validation helpers for positive money, quantities, dates, and required fields in `src/lib/validation/`
- [x] T024 Create shared loading, empty, error, and confirmation components in `src/components/`
- [x] T025 Document local Supabase setup assumptions in `docs/manual-validation.md`

**Checkpoint**: Database structure, RLS, shared helpers, and app skeleton are ready.

---

## Phase 3: User Story 1 - Secure Mobile Access (Priority: P1)

**Goal**: The single user can sign in and internal screens are protected.

**Manual Validation**: Validate login success, login failure, protected route
blocking, and no in-app registration.

- [x] T026 [P] [US1] Implement login page UI in `src/features/auth/LoginPage.tsx`
- [x] T027 [P] [US1] Implement auth state provider in `src/features/auth/AuthProvider.tsx`
- [x] T028 [US1] Implement sign-in and sign-out actions in `src/features/auth/authService.ts`
- [x] T029 [US1] Wire protected routes in `src/routes/AppRoutes.tsx`
- [x] T030 [US1] Add profile/logout entry point in `src/features/profile/ProfilePage.tsx`
- [ ] T031 [US1] Manually validate auth scenarios and record findings in `docs/manual-validation.md`

**Checkpoint**: Authenticated access is functional and protected.

---

## Phase 4: User Story 2 - Understand Business Status (Priority: P1)

**Goal**: Dashboard shows cash, receivables, stock, revenue, expenses, profit, and
pig indicators for the selected month.

**Manual Validation**: Use the quickstart dataset and compare dashboard totals to
manual calculations.

- [x] T032 [P] [US2] Implement dashboard data query/RPC wrapper in `src/features/dashboard/dashboardService.ts`
- [x] T033 [P] [US2] Implement dashboard page shell in `src/features/dashboard/DashboardPage.tsx`
- [x] T034 [US2] Implement cash and receivables cards in `src/features/dashboard/components/CashCards.tsx`
- [x] T035 [US2] Implement revenue cards in `src/features/dashboard/components/RevenueCards.tsx`
- [x] T036 [US2] Implement outgoing and profit cards in `src/features/dashboard/components/ResultCards.tsx`
- [x] T037 [US2] Implement stock summary cards in `src/features/dashboard/components/StockCards.tsx`
- [x] T038 [US2] Implement pig performance summary in `src/features/dashboard/components/PigSummary.tsx`
- [x] T039 [US2] Implement month selector in `src/features/dashboard/components/MonthSelector.tsx`
- [x] T040 [US2] Add dashboard loading, empty, and error states in `src/features/dashboard/DashboardPage.tsx`
- [ ] T041 [US2] Manually validate dashboard calculations with the quickstart dataset in `docs/manual-validation.md`

**Checkpoint**: Dashboard reflects the selected month and core business rules.

---

## Phase 5: User Story 3 - Register Sales and Payments (Priority: P1)

**Goal**: The user can register paid, partial, and credit sales with automatic
financial and stock effects.

**Manual Validation**: Register sales of pork/meat, corn, feed, and other, then
verify totals, status, receivables, cash, and stock.

- [ ] T042 [P] [US3] Implement sales list page in `src/features/sales/SalesListPage.tsx`
- [ ] T043 [P] [US3] Implement sale form page in `src/features/sales/SaleFormPage.tsx`
- [ ] T044 [P] [US3] Implement sale detail page in `src/features/sales/SaleDetailPage.tsx`
- [ ] T045 [US3] Implement sale query and mutation wrapper for `registrar_venda` in `src/features/sales/salesService.ts`
- [ ] T046 [US3] Implement sale type, unit, customer-name, and animals-used form behavior in `src/features/sales/components/SaleForm.tsx`
- [ ] T047 [US3] Implement automatic total, remaining, status, kg/head, and value/head display in `src/features/sales/components/SaleCalculatedFields.tsx`
- [ ] T048 [US3] Implement sale validation messages in `src/features/sales/saleValidation.ts`
- [ ] T049 [US3] Implement customer picker/name fallback in `src/features/sales/components/CustomerSaleField.tsx`
- [ ] T050 [US3] Implement sale detail financial and stock effect summary in `src/features/sales/SaleDetailPage.tsx`
- [ ] T051 [US3] Wire sales routes in `src/routes/AppRoutes.tsx`
- [ ] T052 [US3] Manually validate paid, partial, credit, pork/meat, corn, feed, and overpayment scenarios in `docs/manual-validation.md`

**Checkpoint**: Main sales flow is functional and manually validated.

---

## Phase 6: User Story 4 - Manage Credit Sales and Later Payments (Priority: P1)

**Goal**: The user can review receivables and register later payments safely.

**Manual Validation**: Create credit/partial sales, register later payments, and
verify remaining amount, status, history, and cash balance.

- [ ] T053 [P] [US4] Implement receivables list page in `src/features/receivables/ReceivablesPage.tsx`
- [ ] T054 [P] [US4] Implement payment update page/modal in `src/features/receivables/PaymentUpdatePage.tsx`
- [ ] T055 [US4] Implement receivables query wrapper in `src/features/receivables/receivablesService.ts`
- [ ] T056 [US4] Implement payment mutation wrapper for `registrar_pagamento_venda` in `src/features/receivables/paymentService.ts`
- [ ] T057 [US4] Implement payment validation in `src/features/receivables/paymentValidation.ts`
- [ ] T058 [US4] Implement receivables filters by customer/name/date/status/type in `src/features/receivables/components/ReceivablesFilters.tsx`
- [ ] T059 [US4] Wire receivables and payment routes in `src/routes/AppRoutes.tsx`
- [ ] T060 [US4] Manually validate partial payment, full payment, overpayment rejection, and no-customer receivable scenarios in `docs/manual-validation.md`

**Checkpoint**: Receivables are separate from cash and payments are safe.

---

## Phase 7: User Story 5 - Control Purchases, Stock, and Consumption (Priority: P1)

**Goal**: Purchases, stock movements, sales, and consumption keep stock accurate
and non-negative.

**Manual Validation**: Use quickstart stock operations and invalid negative-stock
attempts.

- [ ] T061 [P] [US5] Implement purchases list page in `src/features/purchases/PurchasesListPage.tsx`
- [ ] T062 [P] [US5] Implement purchase form page in `src/features/purchases/PurchaseFormPage.tsx`
- [ ] T063 [US5] Implement purchase mutation wrapper for `registrar_compra` in `src/features/purchases/purchasesService.ts`
- [ ] T064 [P] [US5] Implement stock page in `src/features/stock/StockPage.tsx`
- [ ] T065 [P] [US5] Implement stock movement form in `src/features/stock/StockMovementPage.tsx`
- [ ] T066 [US5] Implement stock query and movement wrappers in `src/features/stock/stockService.ts`
- [ ] T067 [US5] Implement consumption page in `src/features/stock/ConsumptionPage.tsx`
- [ ] T068 [US5] Implement consumption mutation wrapper for `registrar_consumo` in `src/features/stock/consumptionService.ts`
- [ ] T069 [US5] Implement stock and consumption validation messages in `src/features/stock/stockValidation.ts`
- [ ] T070 [US5] Wire purchase, stock, movement, and consumption routes in `src/routes/AppRoutes.tsx`
- [ ] T071 [US5] Manually validate purchases, stock entries/exits/losses/adjustments, consumption, and negative-stock blocking in `docs/manual-validation.md`

**Checkpoint**: Stock remains correct and never negative.

---

## Phase 8: User Story 6 - Register Costs and Separate Construction (Priority: P2)

**Goal**: Animal expenses and fixed/construction costs are recorded separately and
reflected in financial indicators.

**Manual Validation**: Register both cost types and verify balance, dashboard, and
monthly summary separation.

- [ ] T072 [P] [US6] Implement animal expenses page in `src/features/expenses/AnimalExpensesPage.tsx`
- [ ] T073 [P] [US6] Implement fixed costs page in `src/features/expenses/FixedCostsPage.tsx`
- [ ] T074 [US6] Implement animal expense service in `src/features/expenses/animalExpensesService.ts`
- [ ] T075 [US6] Implement fixed cost service in `src/features/expenses/fixedCostsService.ts`
- [ ] T076 [US6] Implement expense/fixed-cost validation in `src/features/expenses/expenseValidation.ts`
- [ ] T077 [US6] Wire expense routes and dashboard shortcuts in `src/routes/AppRoutes.tsx`
- [ ] T078 [US6] Manually validate animal expense and fixed/construction cost separation in `docs/manual-validation.md`

**Checkpoint**: Operating costs and structural costs are separated.

---

## Phase 9: User Story 7 - Review Monthly Results and History (Priority: P2)

**Goal**: The user can review monthly results, pig performance, search/filter
records, and history.

**Manual Validation**: Validate all reporting screens against the quickstart
dataset and inactive-record rules.

- [ ] T079 [P] [US7] Implement monthly summary page in `src/features/reports/MonthlySummaryPage.tsx`
- [ ] T080 [P] [US7] Implement pig analysis page in `src/features/reports/PigAnalysisPage.tsx`
- [ ] T081 [P] [US7] Implement history page in `src/features/reports/HistoryPage.tsx`
- [ ] T082 [US7] Implement report query wrappers in `src/features/reports/reportsService.ts`
- [ ] T083 [US7] Implement shared report period selector in `src/features/reports/components/PeriodSelector.tsx`
- [ ] T084 [US7] Implement cross-module search/filter UI in `src/features/reports/components/ReportFilters.tsx`
- [ ] T085 [US7] Implement inactivation action wrapper for `inativar_registro` in `src/lib/supabase/inactivationService.ts`
- [ ] T086 [US7] Add inactive-record handling to sales, customers, purchases, stock, expenses, and reports pages
- [ ] T087 [US7] Wire report and history routes in `src/routes/AppRoutes.tsx`
- [ ] T088 [US7] Manually validate monthly summary, pig analysis, history, filters, and soft delete behavior in `docs/manual-validation.md`

**Checkpoint**: Reports and history match active/inactive record rules.

---

## Phase 10: User Story 8 - Install and Operate as PWA (Priority: P3)

**Goal**: Financial Pig is installable and comfortable to use on a phone.

**Manual Validation**: Validate deployed app on Android/mobile browser.

- [ ] T089 [P] [US8] Finalize PWA manifest values in `public/manifest.webmanifest`
- [ ] T090 [P] [US8] Add Financial Pig icons and splash-ready assets in `public/icons/`
- [ ] T091 [US8] Configure service worker/PWA plugin in `vite.config.ts`
- [ ] T092 [US8] Add install prompt/status UI in `src/features/profile/ProfilePage.tsx`
- [ ] T093 [US8] Review mobile layout, touch targets, and text fit across `src/features/`
- [ ] T094 [US8] Configure deployment environment instructions in `README.md`
- [ ] T095 [US8] Manually validate PWA installability and deployed mobile behavior in `docs/manual-validation.md`

**Checkpoint**: Deployed PWA works on mobile and is ready for delivery.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, documentation, and delivery checks.

- [ ] T096 Review all UI copy and error messages for clarity in `src/features/`
- [ ] T097 Review all Supabase writes to ensure they use RPCs for coupled stock/financial operations in `src/features/`
- [ ] T098 Review all normal list queries to ensure `ativo = true` filters in `src/features/`
- [ ] T099 Review all RLS policies and constraints against `specs/001-mvp-financial-pig/schema.md`
- [ ] T100 Update `docs/manual-validation.md` with final validation dataset results
- [ ] T101 Update `README.md` with deployed URL, usage instructions, SDD links, and known manual validation status
- [ ] T102 Run the full manual validation checklist from `specs/001-mvp-financial-pig/quickstart.md`
- [ ] T103 Deploy to Vercel or Netlify and record the final URL in `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on setup and blocks all user stories
- **US1 Auth (Phase 3)**: Depends on foundational work
- **US2 Dashboard (Phase 4)**: Depends on foundational work and benefits from US3-US6 data for full validation
- **US3 Sales (Phase 5)**: Depends on foundational work
- **US4 Receivables (Phase 6)**: Depends on US3 sales
- **US5 Purchases/Stock/Consumption (Phase 7)**: Depends on foundational work and integrates with US3 sales
- **US6 Expenses/Fixed Costs (Phase 8)**: Depends on foundational work
- **US7 Reports/History (Phase 9)**: Depends on US3-US6
- **US8 PWA (Phase 10)**: Depends on app shell and can finish after core flows
- **Polish (Phase 11)**: Depends on all desired user stories

### Suggested MVP Path

1. Complete Phases 1-3.
2. Complete US3 sales and US5 stock before relying on dashboard totals.
3. Complete US4 receivables.
4. Complete US2 dashboard with real data.
5. Complete US6, US7, US8, then final polish.

### Parallel Opportunities

- Setup tasks T003-T008 can run in parallel.
- Foundational helpers T020-T024 can run in parallel after migration structure exists.
- UI page shells in each story can run in parallel with service wrappers when file paths differ.
- Reports pages T079-T081 can run in parallel.
- PWA asset and manifest work T089-T090 can run in parallel.

## Implementation Strategy

### MVP First

The smallest demonstrable MVP is:

1. Login/protected routes
2. Sale registration with payment status
3. Stock-safe pork/corn/feed effects
4. Receivables and later payments
5. Dashboard showing correct cash, receivables, and stock

### Manual Validation Rule

Every checkpoint is complete only after its manual validation task is recorded in
`docs/manual-validation.md`.

## Task Count

- Total tasks: 103
- US1: 6 tasks
- US2: 10 tasks
- US3: 11 tasks
- US4: 8 tasks
- US5: 11 tasks
- US6: 7 tasks
- US7: 10 tasks
- US8: 7 tasks
