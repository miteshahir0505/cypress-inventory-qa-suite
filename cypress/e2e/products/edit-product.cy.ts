// UI tests are pending until the edit UI exists (see DEF-002).
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

describe('Edit a product (API)', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
  });

  it('saves when the SKU is left unchanged', () => {
    cy.request('GET', '/api/products').its('body.length').then((before) => {
      cy.request({
        method: 'PUT',
        url: '/api/products/1',
        body: { name: 'Gaming Laptop', sku: 'LAP-001', price: 999, quantity: 10 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq('Gaming Laptop');
      });

      cy.request('GET', '/api/products').its('body').should('have.length', before);
    });
  });

  it('rejects a SKU that belongs to another product', () => {
    cy.request({
      method: 'PUT',
      url: '/api/products/1',
      body: { name: 'Gaming Laptop', sku: 'MOU-001', price: 999, quantity: 10 },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body.error).to.eq('SKU already exists');
    });

    cy.request('GET', '/api/products').its('body').then((products) => {
      const laptop = products.find((p: { id: number }) => p.id === 1);
      expect(laptop.sku).to.eq('LAP-001');
      expect(laptop.name).to.eq('Laptop');
    });
  });

  const invalidEdits = [
    { label: 'an empty name', changes: { name: '' } },
    { label: 'an empty SKU', changes: { sku: '' } },
    { label: 'a negative price', changes: { price: -10 } },
    { label: 'a non-numeric price', changes: { price: 'abc' } },
    { label: 'a negative quantity', changes: { quantity: -1 } },
    { label: 'a non-numeric quantity', changes: { quantity: 'abc' } },
  ];

  invalidEdits.forEach(({ label, changes }) => {
    it(`rejects ${label}`, () => {
      cy.request({
        method: 'PUT',
        url: '/api/products/1',
        body: { name: 'Laptop', sku: 'LAP-001', price: 999, quantity: 10, ...changes },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq('Invalid product data');
      });

      cy.request('GET', '/api/products').its('body').then((products) => {
        const laptop = products.find((p: { id: number }) => p.id === 1);
        expect(laptop).to.deep.include({ name: 'Laptop', sku: 'LAP-001', price: 999, quantity: 10 });
      });
    });
  });

  it('updates the existing product with the new values and adds no extra product', () => {
    cy.request('GET', '/api/products').its('body.length').then((before) => {
      cy.request({
        method: 'PUT',
        url: '/api/products/2',
        body: { name: 'Wireless Mouse', sku: 'MOU-001', price: 30, quantity: 40 },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });

      cy.request('GET', '/api/products').its('body').then((products) => {
        expect(products).to.have.length(before);
        const mouse = products.find((p: { id: number }) => p.id === 2);
        expect(mouse).to.deep.include({ name: 'Wireless Mouse', price: 30, quantity: 40 });
      });
    });
  });

});