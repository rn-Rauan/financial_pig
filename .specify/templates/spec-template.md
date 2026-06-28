# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Manual Validation *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be independently validated by a person - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Manually validated independently
  - Deployed independently
  - Demonstrated to users independently

  Automated tests are intentionally out of scope for this project. Use concrete
  manual validation steps and acceptance scenarios instead.
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Manual Validation**: [Describe how a person can validate this independently - e.g., "Can be verified by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Manual Validation**: [Describe how a person can validate this independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Manual Validation**: [Describe how a person can validate this independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?
- What happens when a sale is partially paid or sold on credit?
- What happens when a stock operation would make quantity negative?
- What happens when a record is soft-deleted and should disappear from normal views?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability aligned with the MVP business flow]
- **FR-002**: System MUST keep cash balance separate from receivables and unpaid amounts
- **FR-003**: System MUST prevent stock from becoming negative
- **FR-004**: System MUST persist relevant data in Supabase PostgreSQL
- **FR-005**: System MUST use soft delete (`ativo = false`) for relevant records

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate the single user via Supabase Auth
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]
- **Sale/Payment/Stock Movement**: [Include these when the feature changes sales,
  credit, payments, purchases, consumption, expenses, or stock]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Manual outcome, e.g., "User completes the core flow on a mobile viewport without assistance"]
- **SC-002**: [Financial outcome, e.g., "Cash balance changes only after received or paid money"]
- **SC-003**: [Stock outcome, e.g., "Stock quantity reflects purchases, sales, and consumption correctly"]
- **SC-004**: [Deployment outcome, e.g., "Feature is usable from the deployed PWA URL"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- Single authenticated user is created manually in Supabase.
- The application is mobile-first and installable as a PWA.
- Automated tests are not part of this project; validation is manual and documented.
- Deployment target is Vercel or Netlify.
