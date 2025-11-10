import { API_URL } from '../../src/common/api';

describe('Role based access to orders pages', () => {
  const customer = {
    accessToken: 'cust-token',
    user: {
      id: 1,
      name: 'John Customer',
      email: 'john@example.com',
      role: 'customer' as const,
    },
  };

  const admin = {
    accessToken: 'admin-token',
    user: {
      id: 2,
      name: 'Alice Admin',
      email: 'admin@example.com',
      role: 'admin' as const,
    },
  };

  const orders = [
    {
      id: 1,
      userId: customer.user.id,
      items: [{ menuItemId: 1, quantity: 2 }],
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: customer.user.id,
      items: [{ menuItemId: 1, quantity: 1 }],
      status: 'ready' as const,
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('denies access to /orders for customer', () => {
    window.localStorage.setItem('orderlite_auth', JSON.stringify(customer));

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: orders,
    }).as('getOrders');

    cy.visit('/orders');

    cy.contains('You do not have access to this page.').should('be.visible');
  });

  it('allows access to /orders for admin and shows buckets', () => {
    window.localStorage.setItem('orderlite_auth', JSON.stringify(admin));

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: orders,
    }).as('getOrders');

    cy.visit('/orders');

    cy.wait('@getOrders');

    cy.contains('New').should('be.visible');
    cy.contains('In progress').should('be.visible');
    cy.contains('Ready').should('be.visible');
    cy.contains('Delivered').should('be.visible');

    cy.contains('1 order').should('exist');
  });
});
