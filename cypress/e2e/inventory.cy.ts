import invalidProducts from '../fixtures/invalid-products.json';

const rows = () => cy.get('[data-cy="product-row"]');

interface InvalidProductCase {
  label: string;
  name: string;
  sku: string;
  price: number | string;
  quantity: number | string;
  expectedError: string;
}

describe('Inventory', () => {
    beforeEach(() => {
        cy.request('POST', '/api/reset');
        cy.login('admin', 'secret123');
        cy.visit('/');
    });

    it('shows the three seed products', () => {
        rows().should('have.length', 3);
    });

    it('shows every product the API returns', () => {
        cy.request('GET', '/api/products').its('body.length').then((count) => {
            rows().should('have.length', count);
        });
    });

    it('adds a new product', () => {
        rows().its('length').then((before) => {
            cy.addProduct({ name: 'Monitor', sku: 'MON-001', price: 100, quantity: 10 });
            rows().should('have.length', before + 1);
            cy.contains('[data-cy="product-row"]', 'Monitor').should('be.visible');
        });
    });

    it('deletes a product', () => {
        rows().its('length').then((before) => {
            cy.get('[data-cy="product-delete"]').first().click();
            rows().should('have.length', before - 1);
            cy.contains('[data-cy="product-row"]', 'Laptop').should('not.exist');
        });
    });

    it('shows an error when required fields are empty', () => {
        rows().its('length').then((before) => {
            cy.get('[data-cy="product-save"]').click();
            cy.get('[data-cy="product-error"]')
                .should('be.visible')
                .and('contain', 'Invalid product data');
            rows().should('have.length', before);
        });
    });

    it('rejects a duplicate SKU', () => {
        rows().its('length').then((before) => {
            cy.addProduct({ name: 'Another Laptop', sku: 'LAP-001', price: 500, quantity: 2 });
            cy.get('[data-cy="product-error"]')
                .should('be.visible')
                .and('contain', 'SKU already exists');
            rows().should('have.length', before);
        });
    });

        (invalidProducts as InvalidProductCase[]).forEach(({ label, expectedError, ...product }) => {
        it(`rejects ${label}`, () => {
            rows().its('length').then((before) => {
                cy.addProduct(product);
                cy.get('[data-cy="product-error"]')
                    .should('be.visible')
                    .and('contain', expectedError);
                rows().should('have.length', before);
            });
        });
    });
    
    it('shows HTML in a product name as literal text', () => {
        const payload = '<b>bold</b>';
        cy.addProduct({ name: payload, sku: 'XSS-001', price: 10, quantity: 1 });

        cy.contains('[data-cy="product-row"]', 'XSS-001')
            .find('b')
            .should('not.exist');

        cy.contains('[data-cy="product-row"]', 'XSS-001')
            .should('contain', payload);
    });

    it.skip('shows an error when the server fails to save a product', () => {
        cy.intercept('POST', '/api/products', { statusCode: 500, body: { error: 'Server error' } }).as('saveProduct');

        rows().its('length').then((before) => {
            cy.addProduct({ name: 'Monitor', sku: 'MON-001', price: 100, quantity: 10 });
            cy.wait('@saveProduct').its('response.statusCode').should('eq', 500);

            rows().should('have.length', before);
            cy.get('[data-cy="product-error"]').should('be.visible');
        });
    });

});