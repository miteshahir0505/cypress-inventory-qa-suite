# Traceability matrix

Maps each acceptance criterion in `requirements.md` to its automated test.

Status: **Automated** (test exists and runs), **Blocked** (test written, skipped because of a defect), **Pending** (test designed, not implemented), **Open question** (no test until the requirement is decided).

| ID | Criterion (short) | Spec | Test | Status |
|---|---|---|---|---|
| ADD-1 | Form has name, SKU, price, quantity | `products/add-product.cy.ts` | shows a form with name, SKU, price and quantity fields | Automated |
| ADD-2 | All fields mandatory | `products/add-product.cy.ts` | shows a validation message and adds no product when the fields are empty | Automated (all-empty case only) |
| ADD-3 | Price must be a number | `products/add-product.cy.ts` | rejects a non-numeric price | Automated |
| ADD-4 | Price must not be negative | `products/add-product.cy.ts` | rejects a negative price | Automated |
| ADD-5 | Quantity must be a whole number | `products/add-product.cy.ts` | rejects a non-numeric quantity | Automated (non-numeric only, decimals untested) |
| ADD-6 | Quantity must not be negative | `products/add-product.cy.ts` | rejects a negative quantity | Automated |
| ADD-7 | Price and quantity greater than zero | | | Open question |
| ADD-8 | Duplicate SKU rejected | `products/add-product.cy.ts` | shows "SKU already exists" and creates no second product for a duplicate SKU | Automated |
| ADD-9 | Added product appears with entered values | `products/add-product.cy.ts` | lists a successfully added product with the entered values | Automated |
| ADD-10 | Error shown when save fails | `products/add-product.cy.ts` | shows an error and adds no product when the product cannot be saved | Blocked by DEF-001 |
| EDIT-1 | Pencil icon opens edit form | `products/edit-product.cy.ts` | shows a pencil icon on every product row that opens the edit form | Pending |
| EDIT-2 | Edit form pre-filled | `products/edit-product.cy.ts` | pre-fills the edit form with the current name, SKU, price and quantity | Pending |
| EDIT-3 | Same field rules as Add | `products/edit-product.cy.ts` | shows a validation message and saves no changes when the edited values are invalid | Pending |
| EDIT-4 | SKU of another product rejected | `products/edit-product.cy.ts` | shows "SKU already exists" and saves no changes when the SKU belongs to another product | Pending |
| EDIT-5 | Own SKU unchanged saves | `products/edit-product.cy.ts` | saves successfully when the product keeps its own SKU | Pending |
| EDIT-6 | Save updates the row, no extra row | `products/edit-product.cy.ts` | updates the existing row with the new values and adds no extra row | Pending |
| EDIT-7 | Product deleted before save | | | Open question |
| DEL-1 | Delete button on each row | `products/delete-product.cy.ts` | shows a delete button on every product row | Automated |
| DEL-2 | Confirmation before removing | `products/delete-product.cy.ts` | asks the user to confirm before removing a product | Open question (the app deletes without asking today) |
| DEL-3 | Delete removes row, others unchanged | `products/delete-product.cy.ts` | removes the product from the list and leaves all other rows unchanged | Automated (confirmation part waits on DEL-2) |
| DEL-4 | Cancel keeps the product | `products/delete-product.cy.ts` | keeps the product in the list when the user cancels the confirmation | Pending (blocked by DEL-2) |
| DEL-5 | Deleted product gone, second delete is not found | `products/delete-product.cy.ts` | no longer returns a deleted product, and deleting it again returns not found | Automated |
| DEL-6 | No error after delete | `products/delete-product.cy.ts` | shows no error message after a product is deleted | Automated |

## Coverage

23 criteria: 12 automated, 1 blocked (ADD-10), 7 pending (EDIT-1 to EDIT-6, DEL-4), 3 open questions (ADD-7, EDIT-7, DEL-2).

## Tests with no criterion

- `add-product.cy.ts`, "shows HTML in a product name as literal text": security check on rendering. Keep, and write a requirement for it if the product owner wants one.
- `auth/login.cy.ts`: login has no acceptance criteria yet. Add a LOGIN section to `requirements.md`.
- `api/products-api.cy.ts`: technical checks of the API contract, not tied to a user-facing criterion.
