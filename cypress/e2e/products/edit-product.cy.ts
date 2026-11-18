// No edit tests are implemented yet. Each pending test is a designed case waiting for a selector review of the edit UI.
describe('Edit a product', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
    cy.login('admin', 'secret123');
    cy.visit('/');
  });

  // EDIT-1
  it('shows a pencil icon on every product row that opens the edit form');

  // EDIT-2
  it('pre-fills the edit form with the current name, SKU, price and quantity');

  // EDIT-3 (field rules follow ADD-2 to ADD-6; ADD-7 is an open question)
  it('shows a validation message and saves no changes when the edited values are invalid');

  // EDIT-4
  it('shows "SKU already exists" and saves no changes when the SKU belongs to another product');

  // EDIT-5
  it('saves successfully when the product keeps its own SKU');

  // EDIT-6
  it('updates the existing row with the new values and adds no extra row');

  // EDIT-7 is an open question (product deleted by someone else before saving). No test until decided.
});
