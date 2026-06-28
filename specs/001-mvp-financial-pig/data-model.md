# Data Model: Financial Pig MVP

This document summarizes entities for implementation. The authoritative database
shape, constraints, RLS, and RPC boundaries are defined in [schema.md](schema.md).

## Entity Summary

| Entity | Purpose | Main Relationships |
|--------|---------|--------------------|
| Configuration | Stores capital, app name, currency, and settings | One per authenticated user |
| Customer | Optional customer information for recurring sales or collection | Can be linked to many sales |
| Sale | Records sales and payment status | Optional customer; many payments; may create stock movements |
| Sale Payment | Records later payments on partial/credit sales | Belongs to one sale |
| Purchase | Records purchases and supplier info | May create stock movements |
| Animal Expense | Records monthly animal-related costs | Affects cash/profit calculations |
| Fixed Cost | Records fixed or construction costs | Affects cash/net profit separately |
| Stock Item | Current stock-controlled item | Has many stock movements |
| Stock Movement | Audit record for entry, exit, consumption, loss, adjustment | Belongs to one stock item; may link to sale/purchase |
| History Entry | Human-readable log of important operations | May link to any module record |

## Validation Mapping

- Sales require type, product, quantity > 0, unit, unit price > 0, date, and paid
  amount between zero and total.
- Pork/Meat sales require animals used > 0 and available pig stock.
- Purchases require type, product, quantity > 0, unit, unit value > 0, and date.
- Expenses and fixed costs require category, value > 0, description, and date.
- Stock movement quantities must be positive, except adjustment may use signed
  effect internally while preserving non-negative final stock.
- Consumption is allowed only for corn and feed.
- All relevant records use `ativo = true` by default and `ativo = false` for
  soft delete.

## State Transitions

### Sale Payment Status

```text
Fiado -> Parcial -> Pago
Fiado -> Pago
Parcial -> Pago
```

Status is derived from total paid:

- `Pago`: total paid equals sale total
- `Parcial`: total paid is greater than zero and less than total
- `Fiado`: total paid equals zero

### Record Lifecycle

```text
active -> inactive
```

Records are never physically deleted by normal app flows. Inactivation must also
handle related stock and financial effects where applicable.
