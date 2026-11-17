# Inventory App: Requirements

Status values: `Draft` (written, not yet confirmed with the product owner) and `Open question` (needs a decision before tests can be final).

## ADD: Add a product

As an inventory manager, I want to add a product to the catalogue, so that it is available for stock tracking.

| ID | Criterion | Status |
|---|---|---|
| ADD-1 | The add form has fields: name, SKU, price, quantity. | Draft |
| ADD-2 | All four fields are mandatory. Submitting with any field empty shows a validation message and no product is added. | Draft |
| ADD-3 | Price must be a number. Non-numeric input is rejected. | Draft |
| ADD-4 | Price must not be negative. Negative values are rejected. | Draft |
| ADD-5 | Quantity must be a whole number. Non-numeric input is rejected. | Draft |
| ADD-6 | Quantity must not be negative. Negative values are rejected. | Draft |
| ADD-7 | Price and quantity must be greater than zero. | Open question |
| ADD-8 | Adding a product with an existing SKU shows "SKU already exists" and no second product is created. | Draft |
| ADD-9 | A successfully added product appears in the list with the entered values. | Draft |

## EDIT: Edit a product

As an inventory manager, I want to edit an existing product, so that I can correct or update its details.

| ID | Criterion | Status |
|---|---|---|
| EDIT-1 | Each product row has a pencil icon that opens the edit form. | Draft |
| EDIT-2 | The edit form is pre-filled with the product's current name, SKU, price and quantity. | Draft |
| EDIT-3 | Field rules are the same as ADD-2 to ADD-7 (mandatory, numeric, non-negative, whole-number quantity). An invalid submit shows a validation message and saves no changes. | Draft |
| EDIT-4 | Changing the SKU to one that belongs to another product shows "SKU already exists" and saves no changes. | Draft |
| EDIT-5 | Saving with the product's own SKU unchanged succeeds. | Draft |
| EDIT-6 | A successful save updates the existing row with the new values and does not create an additional row. | Draft |
| EDIT-7 | What happens if the product was deleted by someone else before the save? (The server returns 404.) | Open question |

## DEL: Delete a product

As an inventory manager, I want to delete a product, so that I can remove items no longer needed.

| ID | Criterion | Status |
|---|---|---|
| DEL-1 | Each product row has a delete button. | Draft |
| DEL-2 | Clicking delete asks the user to confirm before removing. Open: native dialog or modal? Exact wording? | Open question |
| DEL-3 | Confirming removes the product from the list. All other rows remain unchanged. | Draft |
| DEL-4 | Cancelling the confirmation keeps the product in the list. | Draft |
| DEL-5 | A deleted product no longer exists: the product list API does not return it, and deleting it again returns "not found". | Draft |
| DEL-6 | Deleting does not show an error message or break the page. | Draft |

## Open questions for the product owner

- **ADD-7 / EDIT-3:** Should price or quantity of `0` be rejected? The app currently accepts both. Quantity `0` often means out of stock.
- **Description field:** The original requirement listed a description. The app has none. Is it in scope?
- **DEL-2:** Native browser confirm or custom modal, and what wording?
- **EDIT-7:** What should the user see if the product no longer exists at save time?