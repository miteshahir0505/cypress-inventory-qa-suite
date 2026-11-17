Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.request('POST', '/api/login', { username, password }).then((response) => {
      window.sessionStorage.setItem('token', response.body.token);
    });
  });
});
Cypress.Commands.add('addProduct', (product: ProductInput) => {
  cy.get('[data-cy="product-name"]').type(product.name);
  cy.get('[data-cy="product-sku"]').type(product.sku);
  cy.get('[data-cy="product-price"]').type(String(product.price));
  cy.get('[data-cy="product-quantity"]').type(String(product.quantity));
  cy.get('[data-cy="product-save"]').click();
});

interface ProductInput {
  name: string;
  sku: string;
  price: string | number;
  quantity: string | number;
}
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(username: string, password: string): Chainable<void>;
      addProduct(product: ProductInput): Chainable<void>;
      seedProduct(product: NewProduct): Chainable<Product>;
    }
  }
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

type NewProduct = Omit<Product, 'id'>;

Cypress.Commands.add('seedProduct', (product: NewProduct) => {
  return cy
    .request<Product>('POST', '/api/products', product)
    .then((res) => {
      expect(res.status).to.eq(201);
      return res.body;
    });
});



export {};