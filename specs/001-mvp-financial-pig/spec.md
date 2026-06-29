# Feature Specification: Financial Pig MVP

**Feature Branch**: `001-mvp-financial-pig`

**Created**: 2026-06-28

**Status**: Ready for planning

**Input**: Consolidated from constitution, RF/RNF, domain rules, DER, user
stories, and screen prototypes under `docs/`.

## User Scenarios & Manual Validation *(mandatory)*

### User Story 1 - Secure Mobile Access (Priority: P1)

As the single system user, I want to sign in with email and password so that
business records are protected from unauthorized access.

**Why this priority**: No internal screen or business data can be exposed before
authentication is working.

**Manual Validation**: Validate on a mobile viewport that valid credentials open
the dashboard, invalid credentials show a clear message, and internal URLs reject
unauthenticated access.

**Acceptance Scenarios**:

1. **Given** the user is not authenticated, **When** they provide valid email and
   password, **Then** the dashboard opens and the session remains active while valid.
2. **Given** the user is not authenticated, **When** they provide invalid
   credentials, **Then** the system keeps them on login and shows "E-mail ou
   senha inválidos".
3. **Given** the user is not authenticated, **When** they try to open an internal
   screen directly, **Then** the system redirects them to login or blocks access.

---

### User Story 2 - Understand Business Status (Priority: P1)

As the user, I want a mobile dashboard with financial, receivable, stock, and
pig-sale indicators so that I can quickly understand the business situation.

**Why this priority**: The dashboard is the operational starting point and proves
that the core calculations are consistent.

**Manual Validation**: Register sample sales, payments, purchases, expenses, and
stock movements, then verify dashboard totals against hand-calculated expected
values for the selected month.

**Acceptance Scenarios**:

1. **Given** there are paid, partial, and credit sales, **When** the user opens
   the dashboard, **Then** revenue shows total sold value and cash balance shows
   only money actually received.
2. **Given** there are partial or credit sales, **When** the dashboard loads,
   **Then** accounts receivable appears separately from cash balance.
3. **Given** there are purchases, animal expenses, and fixed/construction costs,
   **When** the dashboard loads, **Then** gross, net, and operational results are
   displayed separately.
4. **Given** there are pig/carne sales, **When** the dashboard loads, **Then** pig
   indicators include kg sold, animals used, kg per head, and value per head.

---

### User Story 3 - Register Sales and Payments (Priority: P1)

As the user, I want to register sales of pork/meat, corn, feed, or other products
with automatic totals and payment status so that sales, receivables, and cash
balance stay correct.

**Why this priority**: Sales are the center of the product and drive revenue,
receivables, payments, stock, dashboard, and history.

**Manual Validation**: Register paid, partial, and credit sales for each main
sale type and verify totals, status, remaining amount, receivables, balance, and
stock effects.

**Acceptance Scenarios**:

1. **Given** quantity and unit price are entered, **When** the sale form updates,
   **Then** total value is calculated automatically and cannot be edited manually.
2. **Given** paid amount equals total, **When** the sale is saved, **Then** status
   is Paid, remaining amount is zero, and cash balance increases by paid amount.
3. **Given** paid amount is greater than zero and less than total, **When** the
   sale is saved, **Then** status is Partial and remaining amount appears in
   accounts receivable.
4. **Given** paid amount is zero, **When** the sale is saved, **Then** status is
   Credit and the full total appears in accounts receivable without entering cash
   balance.
5. **Given** a pork/meat sale, **When** animals used are entered, **Then** the
   system calculates kg per head and value per head.

---

### User Story 4 - Manage Credit Sales and Later Payments (Priority: P1)

As the user, I want to see credit/partial sales and register later payments so
that receivables and cash balance stay up to date.

**Why this priority**: Credit sales are explicit business reality and must never
be confused with available cash.

**Manual Validation**: Create credit and partial sales, add later payments, verify
that payments cannot exceed remaining amount, and confirm status changes to Paid
when the remaining amount reaches zero.

**Acceptance Scenarios**:

1. **Given** a sale has status Credit or Partial, **When** the user opens the
   receivables screen, **Then** the sale appears with total, paid, remaining,
   date, status, customer/name, and observation.
2. **Given** a sale has remaining amount, **When** the user registers a later
   payment below or equal to the remaining amount, **Then** paid amount, remaining
   amount, status, cash balance, and payment history update.
3. **Given** a later payment is greater than the remaining amount, **When** the
   user tries to save it, **Then** the system blocks the operation and shows a
   clear message.

---

### User Story 5 - Control Purchases, Stock, and Consumption (Priority: P1)

As the user, I want purchases, stock movements, and consumption to update stock
automatically so that I know available quantities and never sell or consume more
than exists.

**Why this priority**: Stock integrity is a constitutional rule and is required
for sales, purchases, consumption, and reports.

**Manual Validation**: Register purchases, manual movements, sales, consumption,
losses, and adjustments, then verify stock changes and negative stock prevention.

**Acceptance Scenarios**:

1. **Given** a purchase of pigs, corn, or feed, **When** the purchase is saved,
   **Then** stock increases and cash balance decreases by the purchase total.
2. **Given** a sale of pork/meat, corn, or feed, **When** the sale is saved,
   **Then** stock decreases by animals used or quantity sold.
3. **Given** a consumption record for corn or feed, **When** it is saved, **Then**
   stock decreases and the record is not treated as a sale.
4. **Given** an operation would make stock negative, **When** the user tries to
   save it, **Then** the system blocks the operation and leaves previous stock
   unchanged.

---

### User Story 6 - Register Costs and Separate Construction (Priority: P2)

As the user, I want to register animal expenses and fixed/construction costs
separately so that operating profit is not distorted by structural investments.

**Why this priority**: Expenses are needed for meaningful profit, but the app
still delivers an MVP if sales, payments, and stock are implemented first.

**Manual Validation**: Register animal expenses and fixed/construction costs,
then verify cash balance, dashboard separation, and monthly summary values.

**Acceptance Scenarios**:

1. **Given** an animal expense is saved, **When** dashboard and monthly summary
   load, **Then** the expense reduces cash balance and appears under animal costs.
2. **Given** a fixed/construction cost is saved, **When** dashboard and monthly
   summary load, **Then** the cost reduces cash balance but appears separately
   from animal expenses.
3. **Given** construction costs exist, **When** profit indicators are shown,
   **Then** the user can distinguish net result and operational result without
   construction impact.

---

### User Story 7 - Review Monthly Results and History (Priority: P2)

As the user, I want monthly summaries, pig performance analysis, filters, and
history so that I can review business results and past records.

**Why this priority**: Reporting completes the management loop after the core
write flows are reliable.

**Manual Validation**: Use a month with mixed data and verify the monthly summary,
pig analysis, search filters, history entries, and inactive-record visibility
against known records.

**Acceptance Scenarios**:

1. **Given** the user selects a month, **When** monthly summary loads, **Then** it
   shows sales, purchases, expenses, fixed costs, receivables, balance, profit,
   pig kg, animals used, and average values for that month.
2. **Given** pig/meat sales exist in a period, **When** pig analysis loads,
   **Then** it shows total kg, animals used, average kg/head, average value/head,
   average value/kg, revenue, pig purchase cost, and comparison.
3. **Given** records exist across modules, **When** the user searches or filters,
   **Then** matching records are shown by date, customer, product, category,
   status, movement type, sale type, or purchase type.
4. **Given** a record is inactivated, **When** normal list screens load, **Then**
   the record is hidden, while history/reporting can still show it where useful.

---

### User Story 8 - Install and Operate as PWA (Priority: P3)

As the user, I want to install Financial Pig on a phone and use clear,
mobile-first screens so that daily registration is practical at the farm.

**Why this priority**: Installability improves the experience, while the core
business value comes from authenticated data entry and correct calculations.

**Manual Validation**: Open the deployed app on Android, confirm install prompt or
browser install option, launch from the installed icon, and validate core flows.

**Acceptance Scenarios**:

1. **Given** the user opens the deployed app on a modern mobile browser, **When**
   the browser supports installable apps, **Then** Financial Pig can be installed
   with name, icon, colors, and standalone display.
2. **Given** the user launches the installed app, **When** they sign in, **Then**
   core screens work with mobile-first layout and touch-friendly controls.
3. **Given** the app is deployed, **When** final delivery is reviewed, **Then** the
   README includes the app link, technologies, usage instructions, and SDD links.

---

### User Story 9 - Configure Initial Cash (Priority: P1 Enhancement)

As the user, I want to set the initial cash amount ("Começou com quanto?") so
that the dashboard balance starts from the real amount used to begin the
business tracking.

**Why this priority**: The dashboard already depends on initial capital for the
cash balance; giving the user a safe UI for this value avoids manual SQL edits
and keeps the MVP usable in production.

**Manual Validation**: Set the initial cash to a known value, reopen the
dashboard, and verify that the current cash balance includes that value exactly
once.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they open Perfil/financial
   settings, **Then** the current initial cash value is shown.
2. **Given** the user enters a non-negative initial cash value, **When** they
   save, **Then** the value is persisted and the dashboard balance uses the new
   starting amount.
3. **Given** the user enters a negative, empty, or invalid value, **When** they
   try to save, **Then** the system blocks the update and shows a clear message.

**Scope Boundary**: This story is only for initial cash/capital. Physical cash
counting, cash reconciliation, and manual cash adjustments are future features.

---

### Edge Cases

- Sale paid amount greater than total must be blocked.
- Later payment greater than remaining amount must be blocked.
- Pork/meat sale without animals used must be blocked.
- Division by zero must be avoided when there are no animals or kg sold.
- Stock operations that would make quantity negative must be blocked.
- Credit or partial sale without registered customer must be allowed, with optional
  simple name or observation.
- Cancelled or inactive sales must reverse or compensate related stock and
  financial effects.
- Records with `ativo = false` must not appear in normal lists.
- Empty months or periods must show zero values or clear empty-state messages.
- Invalid dates, negative values, and zero quantities must be blocked where the
  business rule requires positive values.
- Initial cash must allow zero, reject negative values, and avoid double-counting
  when saved more than once.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the single user to sign in with email/login
  and password.
- **FR-002**: The system MUST NOT provide user registration inside the app.
- **FR-003**: The system MUST block unauthenticated access to internal screens and
  data.
- **FR-004**: The system MUST allow optional customer registration with name,
  phone, and observation.
- **FR-005**: The system MUST allow sales with a registered customer, manually
  typed customer name, or no customer.
- **FR-006**: The system MUST allow sales of Pork/Meat, Corn, Feed, and Other.
- **FR-007**: The system MUST calculate sale total as quantity multiplied by unit
  price.
- **FR-008**: The system MUST prevent manual editing of calculated sale total.
- **FR-009**: The system MUST calculate sale payment status from total and paid
  amount as Paid, Partial, or Credit.
- **FR-010**: The system MUST calculate remaining sale amount as total minus total
  paid.
- **FR-011**: The system MUST keep receivables separate from cash balance.
- **FR-012**: The system MUST increase cash balance only by amounts actually
  received from sales or later payments.
- **FR-013**: The system MUST allow later payments on partial or credit sales.
- **FR-014**: The system MUST prevent later payments from exceeding the remaining
  amount.
- **FR-015**: The system MUST require animals used for Pork/Meat sales.
- **FR-016**: The system MUST calculate kg per head and value per head for
  Pork/Meat sales.
- **FR-017**: The system MUST allow purchase registration for pigs, corn, feed,
  and other items.
- **FR-018**: The system MUST allow the user to enter the total paid for a
  purchase and calculate the average unit value as total divided by quantity.
- **FR-019**: The system MUST decrease cash balance by paid purchases.
- **FR-020**: The system MUST increase stock for purchases of pigs, corn, or feed.
- **FR-021**: The system MUST allow stock items and stock movements for Entry,
  Exit, Consumption, Loss, and Adjustment.
- **FR-022**: The system MUST prevent stock from becoming negative.
- **FR-023**: The system MUST decrease pig stock on Pork/Meat sales by animals
  used.
- **FR-024**: The system MUST decrease corn or feed stock on corn/feed sales by
  quantity sold.
- **FR-025**: The system MUST allow consumption of corn and feed and treat it as
  internal consumption, not a sale.
- **FR-026**: The system MUST allow animal expenses and fixed/construction costs
  to be registered separately.
- **FR-027**: The system MUST decrease cash balance for animal expenses and
  fixed/construction costs.
- **FR-028**: The system MUST show dashboard indicators for cash balance,
  receivables, revenue, purchases, expenses, fixed/construction costs, profit,
  stock, and pig-sale metrics.
- **FR-029**: The system MUST show monthly summaries by selected month.
- **FR-030**: The system MUST show pig performance indicators by selected period.
- **FR-031**: The system MUST support search/filtering by date, customer, product,
  category, status, movement type, sale type, and purchase type where applicable.
- **FR-032**: The system MUST preserve history of important movements including
  sales, payments, purchases, stock movements, consumption, expenses, fixed costs,
  cancellations, and inactivations.
- **FR-033**: The system MUST use soft delete/inactivation for relevant records
  instead of physical deletion.
- **FR-034**: The system MUST hide inactive records from normal list screens.
- **FR-035**: The system MUST support mobile-first operation and installation as
  a phone PWA.
- **FR-036**: The system MUST provide clear validation and error messages for
  invalid quantities, values, dates, credentials, and stock/payment constraints.
- **FR-037**: The system MUST allow the authenticated user to view the current
  initial cash value.
- **FR-038**: The system MUST allow the authenticated user to update initial cash
  to a non-negative monetary value.
- **FR-039**: The system MUST include initial cash exactly once in dashboard cash
  balance calculations.

### Key Entities *(include if feature involves data)*

- **Configuration**: Stores capital initial value, app name, currency, and
  user-level settings.
- **Customer**: Optional customer record used to simplify recurring sales and
  future collection.
- **Sale**: Business sale with type, product, quantity, unit, customer/name,
  price, total, paid amount, remaining amount, status, date, observation, and
  active flag.
- **Sale Payment**: Later payment linked to a sale, with value, date,
  observation, active flag, and effect on cash balance.
- **Purchase**: Purchase record with type, product, quantity, unit, total paid
  value, calculated average unit value, supplier, date, observation, and active
  flag.
- **Animal Expense**: Monthly animal-related cost such as feed, corn, medicine,
  veterinary, transport, labor, maintenance, or other.
- **Fixed/Construction Cost**: Structural or fixed cost such as construction,
  renovation, equipment, tools, cans, buckets, pipes, wire, wood, roofing, or
  other.
- **Stock Item**: Controlled item such as pigs, corn, feed, or other, with current
  quantity, unit, minimum stock, observation, and active flag.
- **Stock Movement**: Entry, exit, consumption, loss, or adjustment affecting a
  stock item and optionally linked to a sale or purchase.
- **History Entry**: Audit-style record of important operational changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The user can sign in and reach the dashboard in under 2 minutes on a
  mobile device.
- **SC-002**: The user can register a valid paid sale in under 2 minutes and see
  the correct total, status, and cash balance effect.
- **SC-003**: The user can register a partial or credit sale and see receivables
  separated from cash balance with 100% manual calculation agreement.
- **SC-004**: The user can register a later payment and see remaining amount,
  status, payment history, and cash balance update correctly.
- **SC-005**: The system blocks every manually attempted operation that would
  create negative stock during validation.
- **SC-006**: Dashboard and monthly summary values match hand-calculated expected
  values for a validation dataset covering sales, payments, purchases, expenses,
  fixed costs, stock, and consumption.
- **SC-007**: The deployed app can be opened on a phone, installed as a PWA where
  supported, and used for the core login, sale, payment, purchase, stock, and
  dashboard flows.
- **SC-008**: Normal list screens hide 100% of inactive records while history or
  reporting can still account for them where relevant.
- **SC-009**: The user can update initial cash in under 1 minute and verify on
  the dashboard that the cash balance changes by exactly the difference between
  old and new initial cash values.

## Assumptions

- The app has one authenticated user created manually outside the application.
- Customer registration is optional and is not required for credit or partial
  sales.
- There are no automated tests in this project; validation is manual and
  documented.
- Deployment target is Vercel or Netlify.
- Google Play publication is out of scope for the MVP.
- PDF export, Excel export, detailed animal lifecycle control, supplier
  management, and advanced finance modules are future enhancements.
- Physical cash reconciliation and manual cash adjustments are out of scope for
  the initial cash improvement.
