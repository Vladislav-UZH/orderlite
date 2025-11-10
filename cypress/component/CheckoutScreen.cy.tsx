import { MemoryRouter, useLocation } from 'react-router';
import { CheckoutScreen } from '../../src/screens/CheckoutScreen';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe('CheckoutScreen', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows error when user is not logged in', () => {
    cy.mount(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout',
            state: {
              from: 'menu',
              items: [{ menuItemId: 1, quantity: 1 }],
            },
          },
        ]}
      >
        <CheckoutScreen />
      </MemoryRouter>,
    );

    cy.get('form').submit();
    cy.contains('You must be logged in to place an order.').should('be.visible');
  });

  it('shows error when cart is empty for logged-in user', () => {
    const auth = {
      accessToken: 'test-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer' as const,
      },
    };
    window.localStorage.setItem('orderlite_auth', JSON.stringify(auth));

    cy.mount(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout',
            state: {
              from: 'menu',
              items: [],
            },
          },
        ]}
      >
        <CheckoutScreen />
      </MemoryRouter>,
    );

    cy.get('form').submit();
    cy.contains('Your cart is empty. Please select an item from the menu.').should('be.visible');
  });

  it('creates order and redirects to order status', () => {
    const auth = {
      accessToken: 'test-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer' as const,
      },
    };
    window.localStorage.setItem('orderlite_auth', JSON.stringify(auth));

    cy.intercept('POST', 'http://localhost:3000/orders', {
      statusCode: 201,
      body: {
        id: 101,
        userId: auth.user.id,
        items: [{ menuItemId: 1, quantity: 2 }],
        status: 'new',
        createdAt: '2024-01-01T10:00:00.000Z',
      },
    }).as('createOrder');

    cy.mount(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/checkout',
            state: {
              from: 'menu',
              items: [{ menuItemId: 1, quantity: 2 }],
            },
          },
        ]}
      >
        <LocationDisplay />
        <CheckoutScreen />
      </MemoryRouter>,
    );

    cy.get('input[placeholder="Name"]').type('John Doe');
    cy.get('input[placeholder="Phone"]').type('123456789');
    cy.contains('button', 'Cash').click();

    cy.contains('button', 'Review & confirm').click();
    cy.contains('Confirm order').should('be.visible');

    cy.contains('button', 'Confirm').click();

    cy.wait('@createOrder');
    cy.get('[data-testid="location"]').should('contain', '/orders/101');
  });
});
