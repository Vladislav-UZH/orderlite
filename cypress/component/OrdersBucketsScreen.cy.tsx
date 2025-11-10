import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { OrdersBucketsScreen } from '../../src/screens/OrdersBucketsScreen';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function mountWithAuthAndRoute() {
  cy.mount(
    <MemoryRouter initialEntries={['/orders']}>
      <Routes>
        <Route path="/orders" element={<OrdersBucketsScreen />} />
        <Route path="/orders/:id" element={<div data-testid="order-page">Order page</div>} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe('OrdersBucketsScreen', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('denies access for non-admin user', () => {
    const auth = {
      accessToken: 't',
      user: { id: 1, name: 'User', email: 'u@example.com', role: 'customer' as const },
    };
    window.localStorage.setItem('orderlite_auth', JSON.stringify(auth));

    cy.intercept('GET', 'http://localhost:3000/orders', {
      statusCode: 200,
      body: [],
    }).as('getOrders');

    mountWithAuthAndRoute();

    cy.contains('You do not have access to this page.').should('be.visible');
  });

  it('shows buckets for admin and allows opening last order in each bucket', () => {
    const auth = {
      accessToken: 't',
      user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' as const },
    };
    window.localStorage.setItem('orderlite_auth', JSON.stringify(auth));

    const orders = [
      {
        id: 1,
        userId: 1,
        items: [{ menuItemId: 1, quantity: 1 }],
        status: 'new',
        createdAt: '2024-01-01T10:00:00.000Z',
      },
      {
        id: 2,
        userId: 1,
        items: [{ menuItemId: 2, quantity: 1 }],
        status: 'inProgress',
        createdAt: '2024-01-01T11:00:00.000Z',
      },
      {
        id: 3,
        userId: 1,
        items: [{ menuItemId: 3, quantity: 1 }],
        status: 'ready',
        createdAt: '2024-01-01T12:00:00.000Z',
      },
      {
        id: 4,
        userId: 1,
        items: [{ menuItemId: 1, quantity: 2 }],
        status: 'delivered',
        createdAt: '2024-01-01T13:00:00.000Z',
      },
    ];

    cy.intercept('GET', 'http://localhost:3000/orders', {
      statusCode: 200,
      body: orders,
    }).as('getOrders');

    mountWithAuthAndRoute();

    cy.wait('@getOrders');

    cy.contains('New').parent().next().contains('1 order');
    cy.contains('In progress').parent().next().contains('1 order');
    cy.contains('Ready').parent().next().contains('1 order');
    cy.contains('Delivered').parent().next().contains('1 order');

    cy.contains('Delivered').parent().next().contains('Order #4').click();

    cy.get('[data-testid="location"]').should('contain', '/orders/4');
    cy.get('[data-testid="order-page"]').should('be.visible');
  });

  it('shows loading and error states', () => {
    const auth = {
      accessToken: 't',
      user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' as const },
    };
    window.localStorage.setItem('orderlite_auth', JSON.stringify(auth));

    // 1) loading -> success (порожній список)
    cy.intercept('GET', 'http://localhost:3000/orders', {
      delay: 300,
      statusCode: 200,
      body: [],
    }).as('slowOrders');

    mountWithAuthAndRoute();

    cy.contains('Loading orders...').should('be.visible');
    cy.wait('@slowOrders');
    cy.contains('Loading orders...').should('not.exist');

    // 2) помилка сервера
    cy.intercept('GET', 'http://localhost:3000/orders', {
      statusCode: 500,
      body: 'Server error',
    }).as('errorOrders');

    mountWithAuthAndRoute();

    cy.wait('@errorOrders');
    cy.contains('Server error').should('be.visible');
  });
});
