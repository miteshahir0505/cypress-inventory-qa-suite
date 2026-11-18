import { rows } from '../../support/selectors';
interface ProductInput {
  name: string;
  sku: string;
  price: string | number;
  quantity: string | number;
}

const expectRejected = (product: ProductInput, message: string) => {
  rows().its('length').then((before) => {
    cy.addProduct(product);
    cy.get('[data-cy="product-error"]').should('be.visible').and('contain', message);
    rows().should('have.length', before);
  });
};

describe('Add a product', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
    cy.login('admin', 'secret123');
    cy.visit('/');
  });

  // ADD-1
  it('shows a form with name, SKU, price and quantity fields', () => {
    cy.get('[data-cy="product-name"]').should('be.visible');
    cy.get('[data-cy="product-sku"]').should('be.visible');
    cy.get('[data-cy="product-price"]').should('be.visible');
    cy.get('[data-cy="product-quantity"]').should('be.visible');
  });

  // ADD-2 (covers the all-empty case; single-empty-field cases are not covered yet)
  it('shows a validation message and adds no product when the fields are empty', () => {
    rows().its('length').then((before) => {
      cy.get('[data-cy="product-save"]').click();
      cy.get('[data-cy="product-error"]')
        .should('be.visible')
        .and('contain', 'Invalid product data');
      rows().should('have.length', before);
    });
  });

  // ADD-3
  it('rejects a non-numeric price', () => {
    expectRejected({ name: 'Test Item', sku: 'TST-003', price: 'abc', quantity: 5 }, 'Invalid product data');
  });

  // ADD-4
  it('rejects a negative price', () => {
    expectRejected({ name: 'Test Item', sku: 'TST-004', price: -10, quantity: 5 }, 'Invalid product data');
  });

  // ADD-5
  it('rejects a non-numeric quantity', () => {
    expectRejected({ name: 'Test Item', sku: 'TST-005', price: 10, quantity: 'abc' }, 'Invalid product data');
  });

  // ADD-6
  it('rejects a negative quantity', () => {
    expectRejected({ name: 'Test Item', sku: 'TST-006', price: 10, quantity: -1 }, 'Invalid product data');
  });

  // ADD-7 (price/quantity must be greater than zero) is an open question. No test until decided.

  // ADD-8
  it('shows "SKU already exists" and creates no second product for a duplicate SKU', () => {
    expectRejected({ name: 'Another Laptop', sku: 'LAP-001', price: 500, quantity: 2 }, 'SKU already exists');
  });

  // ADD-9
  it('lists a successfully added product with the entered values', () => {
    rows().its('length').then((before) => {
      cy.addProduct({ name: 'Monitor', sku: 'MON-001', price: 149, quantity: 7 });
      rows().should('have.length', before + 1);
      cy.contains('[data-cy="product-row"]', 'MON-001')
        .should('contain', 'Monitor')
        .and('contain', '149')
        .and('contain', '7');
    });
  });

  // ADD-10. Blocked by DEF-001 (docs/defects.md): the app shows no error and clears the form.
  // Remove .skip once the defect is fixed.
  it.skip('shows an error and adds no product when the product cannot be saved', () => {
    cy.intercept('POST', '/api/products', { statusCode: 500, body: { error: 'Server error' } }).as('saveProduct');
    rows().its('length').then((before) => {
      cy.addProduct({ name: 'Monitor', sku: 'MON-001', price: 100, quantity: 10 });
      cy.wait('@saveProduct');
      cy.get('[data-cy="product-error"]').should('be.visible');
      rows().should('have.length', before);
    });
  });
});

// Not tied to a requirement: security check on how entered text is rendered.
describe('Add a product: rendering of entered text', () => {
  beforeEach(() => {
    cy.request('POST', '/api/reset');
    cy.login('admin', 'secret123');
    cy.visit('/');
  });

  it('shows HTML in a product name as literal text', () => {
    const payload = '<b>bold</b>';
    cy.addProduct({ name: payload, sku: 'XSS-001', price: 10, quantity: 1 });
    cy.contains('[data-cy="product-row"]', 'XSS-001').find('b').should('not.exist');
    cy.contains('[data-cy="product-row"]', 'XSS-001').should('contain', payload);
  });
});
