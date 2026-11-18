# Test strategy

## Scope

Inventory app: login, add, edit and delete products. Requirements are in `requirements.md`. Every automated test traces to a criterion in `traceability.md`.

## Approach

- **One test, one criterion.** The title states the expected behavior in plain words.
- **Specs mirror the requirements:** one spec per requirement section (add, edit, delete), plus auth and API.
- **UI level** for what the user sees and does. **API level** (`cy.request`) for server rules, and for setting up data (`cy.seedProduct`) when a test is not about the form.
- **Network stubbing** (`cy.intercept`) only to force failures that cannot be triggered otherwise.
- **Independent tests:** each test resets data through `POST /api/reset`.
- **Relative assertions:** row counts are compared to the count before the action.

## Rules for test design

- No test without a decided requirement. Open questions stay in `requirements.md` until the product owner answers.
- A failing test that exposes a real deviation is logged in `defects.md` and skipped with a reference to the defect ID. It is never deleted.
- Boundary tests are added only when a requirement defines the boundary.

## Not automated

- Visual layout and styling.
- Multi-user and concurrency cases (EDIT-7).
- Authorization. The server does not verify the auth token on any route today.

## Known risks

See `defects.md` and the open questions in `requirements.md`.
