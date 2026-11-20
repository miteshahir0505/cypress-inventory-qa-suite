# Cypress Inventory QA Suite

![Cypress Tests](https://github.com/miteshahir0505/cypress-inventory-qa-suite/actions/workflows/cypress.yml/badge.svg)

End-to-end test suite for a small inventory management app, built with Cypress and TypeScript. The app is an Express server with a vanilla JS frontend. The tests cover login, adding, editing and deleting products, input validation, and network behavior. Tests are written from the acceptance criteria in `requirements.md`.

## Tech stack

- Cypress 16
- TypeScript 7
- Node.js 22
- Express 5 (the app under test)
- GitHub Actions (CI)

## Getting started

```bash
npm install
npm run start:app
```

The app runs at http://localhost:3000. Log in with `admin` / `secret123`.

## Running the tests

Start the app in one terminal, then in another:

```bash
npm run cy:open     # interactive runner (Chrome)
npm run cy:run      # headless run (Chrome)
npm run typecheck   # TypeScript check, no emit
```

## Project structure

```
app/
  server.js                   Express app and API (includes POST /api/reset)
  public/index.html           Frontend (login, add, edit, delete)
cypress/
  e2e/
    auth/
      login.cy.ts             Login and logout flows
    api/
      products-api.cy.ts      API behavior checks
      seed.cy.ts              Seeding products through the API
    products/
      add-product.cy.ts       Add a product
      edit-product.cy.ts      Edit a product (UI and API)
      delete-product.cy.ts    Delete a product
  fixtures/
    products.json             Stubbed product list
    invalid-products.json     Data for data-driven validation tests
  support/
    commands.ts               Custom commands: login, addProduct, seedProduct
    e2e.ts                    Support file
cypress.config.ts             Cypress configuration (baseUrl, viewport)
tsconfig.json                 TypeScript configuration
requirements.md               Acceptance criteria and open questions
.github/workflows/
  cypress.yml                 CI workflow
```

## Testing approach

**Requirements and structure**

- **Traceability:** specs mirror the sections of `requirements.md` (login, add, edit, delete). Each acceptance criterion gets its own `it`, with a plain-language title.
- **No test without a decided requirement:** criteria marked as open questions have no test until the product owner decides. Placeholders stay as pending tests so the gap is visible.
- **Defects:** a confirmed defect is logged, its test is skipped with a note, and the test is never deleted. The skip is removed when the defect is fixed.

**Writing tests**

- **Selectors:** all elements are selected through `data-cy` attributes. Form fields and table rows are scoped separately, so row assertions are always made inside `product-row`.
- **Authentication:** `cy.login()` uses `cy.session` to cache the login across tests.
- **Test isolation:** each test starts with `POST /api/reset` so the data is always in a known state.
- **Setup through the API:** `cy.seedProduct()` creates products through the API, so UI tests don't spend time on setup.
- **Custom commands:** `cy.addProduct()` fills and submits the product form. It performs the action only, and each test makes its own assertions.
- **Data-driven tests:** invalid price and quantity cases run from a single array in a fixture.
- **Relative assertions:** row counts are compared against the count before the action, not hard-coded.

**Assertions that can fail**

- **Positive outcome first:** the test asserts the expected result (which retries until the app responds) before asserting that an error is hidden. Checking for no error immediately after a click can pass before the server has answered.
- **Persistence:** when a test claims that nothing was saved, it reloads the page with `cy.reload()` and asserts against server data. The DOM right after a rejected save can look unchanged even if the server saved something.
- **Failure check:** every new test is broken on purpose once to confirm it goes red, then reverted.

**Network**

- `cy.intercept` is used only to spy on requests or stub server responses.

## Continuous integration

On every push to `main` and every pull request, the workflow installs dependencies, runs the type check, starts the app, waits for it to respond, and runs the Cypress suite headlessly. Screenshots are uploaded as an artifact when a run fails.

## Current status

49 tests: 44 passing, 5 pending, 0 failing. Pending tests are placeholders for open questions or logged defects (see below).

## Known gaps and open questions

- **No error handling for server errors (500).** `index.html` handles only 400 and 409 responses. On a 500, no error message is shown and the form is cleared. The test for this is skipped until the requirement (ADD-10) is decided and the app is fixed.
- **Questionable inputs are accepted.** The API accepts price `0`, decimal prices such as `10.5`, quantity `0`, and decimal quantities such as `1.5`. No tests exist for these because there is no decided requirement (ADD-7).
- **Edit validation (EDIT-3)** is in progress. Only zero values for price and quantity wait on ADD-7, which is an open question.
- **Edit of a deleted product (EDIT-7)** is an open question. The server returns 404, but the expected user experience is undefined.
- **Delete confirmation (DEL-2)** is an open question: native dialog or modal, and the wording.
- **Description field:** the original requirement listed one, but the app has none. Scope is undecided.