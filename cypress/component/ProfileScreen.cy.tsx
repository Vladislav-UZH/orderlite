import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { ProfileScreen } from '../../src/screens/ProfileScreen';

const API_URL = 'http://localhost:3000';
const STORAGE_KEY = 'orderlite_auth';

function Wrapper() {
  const location = useLocation();
  return (
    <>
      <div data-testid="location">{location.pathname}</div>
      <Routes>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/orders/:id" element={<div>Order page</div>} />
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </>
  );
}

describe('ProfileScreen', () => {
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

  it('renders guest state when no user and shows empty history', () => {
    cy.window().then((win) => win.localStorage.removeItem(STORAGE_KEY));

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: [],
    }).as('getOrders');

    cy.mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.wait('@getOrders');

    cy.contains('Guest').should('be.visible');
    cy.contains('—').should('be.visible');
    cy.contains('No orders yet.').should('be.visible');
  });

  it('shows user info and filters order history by userId', () => {
    setAuth('customer');

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: [
        {
          id: 101,
          userId: 1,
          items: [{ menuItemId: 1, quantity: 2 }],
          status: 'new',
          createdAt: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 102,
          userId: 2,
          items: [{ menuItemId: 1, quantity: 1 }],
          status: 'ready',
          createdAt: '2024-01-16T10:00:00.000Z',
        },
      ],
    }).as('getOrders');

    cy.mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.wait('@getOrders');

    cy.contains('Test User').should('be.visible');
    cy.contains('user@example.com').should('be.visible');

    cy.contains('Order #101').should('be.visible');
    cy.contains('Order #102').should('not.exist');
  });

  it('navigates to order details when clicking history link', () => {
    setAuth('customer');

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: [
        {
          id: 201,
          userId: 1,
          items: [{ menuItemId: 1, quantity: 1 }],
          status: 'ready',
          createdAt: '2024-01-17T10:00:00.000Z',
        },
      ],
    }).as('getOrders');

    cy.mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.wait('@getOrders');

    cy.contains('Order #201').click();
    cy.get('[data-testid="location"]').should('have.text', '/orders/201');
  });

  it('logs out and redirects to /login', () => {
    setAuth('customer');

    cy.intercept('GET', `${API_URL}/orders`, {
      statusCode: 200,
      body: [],
    }).as('getOrders');

    cy.mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.wait('@getOrders');

    cy.contains('Log out').click();
    cy.get('[data-testid="location"]').should('have.text', '/login');

    cy.window().then((win) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(win.localStorage.getItem(STORAGE_KEY)).to.be.null;
    });
  });
});
