import { API_URL } from '../../src/common/api';

describe('Order flow from menu to status', () => {
  const customer = {
    accessToken: 'test-token',
    user: {
      id: 1,
      name: 'John Customer',
      email: 'john@example.com',
      role: 'customer' as const,
    },
  };

  const menuItems = [
    {
      id: 1,
      name: 'Test Coffee',
      description: 'Nice hot drink',
      price: 3.5,
      category: 'Drinks',
    },
  ];

  const order = {
    id: 101,
    userId: customer.user.id,
    items: [{ menuItemId: 1, quantity: 1 }],
    status: 'new' as const,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('allows customer to create order and redirects to status page', () => {
    cy.intercept('POST', `${API_URL}/login`, {
      statusCode: 200,
      body: customer,
    }).as('login');

    cy.intercept('GET', `${API_URL}/menuItems`, {
      statusCode: 200,
      body: menuItems,
    }).as('getMenu');

    cy.intercept('POST', `${API_URL}/orders`, {
      statusCode: 200,
      body: order,
    }).as('createOrder');

    cy.intercept('GET', `${API_URL}/orders/${order.id}`, {
      statusCode: 200,
      body: order,
    }).as('getOrder');

    cy.visit('/login');

    cy.get('input[placeholder="Enter your email"]').type(customer.user.email);
    cy.get('input[placeholder="Enter your password"]').type('password123');
    cy.contains('button', 'Log in').click();

    cy.wait('@login');
    cy.url().should('include', '/menu');

    cy.wait('@getMenu');
    cy.contains('Test Coffee').click();

    cy.url().should('include', '/checkout');

    cy.get('input[placeholder="Name"]').type('John Customer');
    cy.get('input[placeholder="Phone"]').type('123456789');
    cy.contains('button', 'Cash').click();

    cy.contains('button', 'Review & confirm').click();

    cy.contains('button', 'Confirm').click();

    cy.wait('@createOrder');
    cy.wait('@getOrder');

    cy.url().should('include', `/orders/${order.id}`);
    cy.contains(`Order #${order.id}`).should('be.visible');
  });
});
