# Manual Validation

Financial Pig does not use automated tests. Every feature must be validated by
following concrete manual steps before it is considered complete.

## Required Validation

- Validate on a mobile-width viewport first.
- Validate login with the single Supabase user.
- Validate protected routes reject unauthenticated access.
- Validate Supabase RLS permits only the intended authenticated access.
- Validate soft-deleted records with `ativo = false` disappear from normal views.
- Validate deployment URL after the feature is complete.

## Financial Rules

- Cash balance changes only when money is actually received or paid.
- Credit sales and partially paid sales keep remaining amounts in receivables.
- Revenue reflects the total sold value, not only the amount paid.
- Payments reduce receivables and update cash balance only by the paid amount.
- Expenses and purchases reduce cash balance only when paid.

## Stock Rules

- Purchases increase stock.
- Sales and consumption reduce stock.
- Stock must never become negative.
- Failed stock operations must leave previous quantities unchanged.

## Feature Checklist

For each user story, record:

- Feature branch and feature document path.
- Mobile viewport used for validation.
- Supabase user used for validation.
- Steps performed.
- Expected result.
- Actual result.
- Any issue found and whether it was fixed.

## Final Delivery Gate

Before final delivery, confirm:

- Login works.
- Protected routes work.
- Main sales flow works.
- Total, paid, remaining, and status values are correct.
- Receivables are separate from cash balance.
- Stock updates correctly.
- Soft delete is applied.
- Deployment works.
- SDD documents are present and linked from README when available.
