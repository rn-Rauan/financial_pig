# UI Flow Contracts: Financial Pig MVP

These contracts define expected screens, entry points, outputs, and validation
outcomes for implementation. They complement the screen reference docs in
`docs/prototypes/docs/`.

## Navigation Contract

Primary tab bar:

- Inicio
- Vendas
- Estoque
- Relatorios
- Perfil

Dashboard shortcuts:

- `+ Venda` opens Nova venda
- `+ Compra` opens Nova compra
- `+ Despesa` opens Despesas dos animais

## Auth Flow

**Input**: email/login, password

**Success output**: authenticated session and dashboard route

**Failure output**: clear error message without exposing internal details

**Rules**:

- No app registration screen
- Internal routes require a valid session

## Sale Flow

**Input**: sale type, product, quantity, unit, optional customer/customer name,
unit price, paid amount, date, observation, animals used for Pork/Meat

**Success output**:

- sale saved
- total, remaining amount, and status calculated
- stock movement created when applicable
- dashboard/receivables/history reflect the result

**Failure output**:

- field-level or form-level message for invalid values, overpayment, missing
  animals, or insufficient stock

## Receivable Payment Flow

**Input**: sale, payment value, payment date, observation

**Success output**:

- payment saved
- sale paid and remaining totals recalculated
- status updated to Paid when remaining amount reaches zero
- cash balance increases only by the new payment

**Failure output**:

- clear message when payment exceeds remaining amount or value is invalid

## Purchase and Stock Flow

**Input**: purchase type, product, quantity, unit, unit value, supplier, date,
observation

**Success output**:

- purchase saved
- stock increased for pigs/corn/feed purchases
- cash balance decreased
- history entry created

**Failure output**:

- clear message for invalid quantity, value, date, or stock operation

## Expense and Fixed Cost Flow

**Input**: category, value, description, date, observation

**Success output**:

- record saved
- cash balance decreased
- dashboard and monthly summary updated in the correct category

**Failure output**:

- clear message for missing category, invalid value, or invalid date

## Reporting Flow

**Input**: selected month or period and optional filters

**Success output**:

- dashboard, monthly summary, pig analysis, and history show values derived from
  active records and relevant compensation/inactivation rules

**Failure output**:

- empty state for no records
- retryable error state when data cannot be loaded
