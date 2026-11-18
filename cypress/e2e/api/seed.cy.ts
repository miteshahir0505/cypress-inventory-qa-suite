describe('API seeding', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
    cy.seedProduct({ name: 'Seeded Monitor', sku: 'LAP-002', price: 100, quantity: 5 });
    cy.login('admin', 'secret123');
    cy.visit('/');
  });

  it('shows a product seeded via the API', () => {
    cy.contains('[data-cy="product-row"]', 'LAP-002').should('be.visible');
  });

  it('returns the created product with a server-assigned id', () => {
    cy.seedProduct({ name: 'Second Seed', sku: 'LAP-003', price: 10, quantity: 1 }).then((created) => {
      expect(created.id).to.be.a('number');
      expect(created.sku).to.eq('LAP-003');
    });
  });
});