# Defect log

## DEF-001: Failed save gives no feedback and wipes the form

- **Criterion:** ADD-10
- **Severity:** High (the user believes the product was saved and loses what they typed)
- **Status:** Open
- **Where:** `app/public/index.html`, function `addProduct()`

**Steps**
1. Log in and open the inventory.
2. Fill in a valid new product.
3. Click save while the server fails the request (for example, a `500` response), or while the connection is down.

**Expected (ADD-10):** an error message is shown and no product is added.

**Actual**
- On a `500`: no error is shown, all four fields are cleared, and the list shows no new row.
- On a network failure: no error is shown (unhandled promise rejection in the console).

**Cause:** only `400` and `409` are handled. Any other response goes down the success path and clears the form.

**Automated test:** `add-product.cy.ts`, ADD-10 (skipped). Remove `.skip` once fixed.

**Related, not yet logged:** `removeProduct()` does not check the response status. Raise it once the DEL requirements are confirmed.

## DEF-002: Edit UI is not implemented

- **Criterion:** EDIT-1, EDIT-2 (EDIT-3 to EDIT-6 cannot be tested through the UI)
- **Severity:** Medium (users cannot correct a product; they must delete and re-add it)
- **Status:** Open
- **Where:** `app/public/index.html`

**Steps**
1. Log in and open the inventory.
2. Look at the product rows and the form.

**Expected (EDIT-1, EDIT-2):** each row has a pencil icon that opens an edit form pre-filled with the product's name, SKU, price and quantity.

**Actual:** each row has only a Delete button. There is no pencil icon and no edit form.

**Cause:** `index.html` never calls `PUT /api/products/:id`. The endpoint exists in `server.js`, so the backend is ready and the frontend is not.

**Automated test:** `edit-product.cy.ts`, all six tests (skipped at UI level). The API-level tests for EDIT-3 to EDIT-6 are not blocked by this defect.


## DEF-003: Empty price or quantity is accepted and saved as 0

- **Criterion:** ADD-2, EDIT-3
- **Severity:** High (a product can be saved with no price or no stock figure, and the user is never told; the bad value looks valid in the list)
- **Status:** Open
- **Where:** `app/server.js`, function `isValid`

**Steps**
1. Start the app and call `POST /api/products` with `{ name: 'Probe', sku: 'PRB-001', price: '', quantity: '5' }`.
2. Repeat with `{ price: '10', quantity: '' }`.
3. Repeat with `{ price: ' ', quantity: '5' }`.
4. Call `PUT /api/products/1` with `{ name: 'Laptop', sku: 'LAP-001', price: '', quantity: '10' }`.

**Expected (ADD-2, EDIT-3):** each request is rejected with `400` and "Invalid product data", and nothing is saved or changed.

**Actual**
- Step 1: accepted, saved with price `0`.
- Step 2: accepted, saved with quantity `0`.
- Step 3: accepted, saved with price `0`.
- Step 4: accepted, product 1 price changed to `0`.

**Cause:** `Number('')` and `Number(' ')` both return `0`, so `isValid` cannot tell an empty field from a real zero. `0` is finite and `>= 0`, so it passes.

**Fix constraint:** reject empty or whitespace-only price and
