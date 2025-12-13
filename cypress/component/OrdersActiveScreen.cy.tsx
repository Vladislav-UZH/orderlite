import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { OrdersActiveScreen } from '../../src/screens/OrdersActiveScreen';

const API_URL = 'http://localhost:3000';
const STORAGE_KEY = 'orderlite_auth';

function Wrapper() {
  const location = useLocation();
  return (
    <>
      <div data-testid="location">{location.pathname}</div>
      <Routes>
        <Route path="/orders/active" element={<OrdersActiveScreen />} />
        <Route path="/orders/:id" element={<div>Order page</div>} />
      </Routes>
    </>
  );
}

describe('OrdersActiveScreen', () => {
  const setAuth = (role: 'customer' | 'admin') => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken: 'token-123',
          user: { id: 1, email: 'user@example.com', name: 'Test User', role },
        }),
      );
    });
  };

  it('denies access for non-admin user', () => {
    cy.intercept('GET', `${API_URL}/orders`, { statusCode: 200, body: [] }).as('getOrders');
    cy.intercept('GET', `${API_URL}/menuItems`, { statusCode: 200, body: [] }).as('getMenu');

    cy.mount(
      <MemoryRouter initialEntries={['/orders/active']}>
        <OrdersActiveScreen />
      </MemoryRouter>,
    );

    cy.wait(['@getOrders', '@getMenu']);

    cy.contains('You do not have access to this page.').should('be.visible');
  });

  it('shows orders for admin and allows switching tabs and opening order', () => {
    setAuth('admin');

    cy.intercept('GET', `${API_URL}/menuItems`, {
      statusCode: 200,
      body: [
        { id: 10, name: 'Latte', description: 'Coffee', price: 3.5, category: 'Coffee' },
        { id: 11, name: 'Espresso', description: 'Coffee', price: 2.0, category: 'Coffee' },
      ],
    }).as('getMenu');

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          userId: 1,
          items: [{ menuItemId: 10, quantity: 1 }],
          status: 'new',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          userId: 1,
          items: [{ menuItemId: 11, quantity: 2 }],
          status: 'delivered',
          createdAt: new Date().toISOString(),
        },
      ],
    }).as('getOrders');

    cy.mount(
      <MemoryRouter initialEntries={['/orders/active']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.wait(['@getOrders', '@getMenu']);

    cy.contains('Latte').should('be.visible');
    cy.contains('Espresso').should('not.exist');

    cy.contains('All').click();
    cy.contains('Espresso').should('be.visible');

    cy.contains('Latte').click();
    cy.get('[data-testid="location"]').should('have.text', '/orders/1');
  });
});
