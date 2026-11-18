import { rows } from '../../support/selectors';

describe('Delete a product', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
    cy.login('admin', 'secret123');
    cy.visit('/');
  });

  // DEL-1
  it('shows a delete button on every product row', () => {
    rows().each(($row) => {
      cy.wrap($row).find('[data-cy="product-delete"]').should('be.visible');
    });
  });

  // DEL-2: open question (native dialog or modal, wording). The app currently deletes without asking.
  it('asks the user to confirm before removing a product');

  // DEL-3 (the confirmation part waits on DEL-2)
  it('removes the product from the list and leaves all other rows unchanged', () => {
    rows().its('length').then((before) => {
      cy.get('[data-cy="product-delete"]').first().click();
      rows().should('have.length', before - 1);
      cy.contains('[data-cy="product-row"]', 'LAP-001').should('not.exist');
      cy.contains('[data-cy="product-row"]', 'MOU-001').should('be.visible');
      cy.contains('[data-cy="product-row"]', 'KEY-001').should('be.visible');
    });
  });

  // DEL-4: blocked until DEL-2 is decided.
  it('keeps the product in the list when the user cancels the confirmation');

  // DEL-5
  it('no longer returns a deleted product, and deleting it again returns not found', () => {
    cy.request('DELETE', '/api/products/1').its('status').should('eq', 204);
    cy.request('/api/products').its('body').should('not.deep.include', { id: 1 });
    cy.request({ method: 'DELETE', url: '/api/products/1', failOnStatusCode: false })
      .its('status')
      .should('eq', 404);
  });

  // DEL-6
  it('shows no error message after a product is deleted', () => {
    cy.get('[data-cy="product-delete"]').first().click();
    cy.get('[data-cy="product-error"]').should('not.be.visible');
    cy.get('[data-cy="inventory-view"]').should('be.visible');
  });
});
