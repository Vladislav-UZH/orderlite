import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { ProtectedRoute } from '../../src/screens/ProtectedRoute';

const STORAGE_KEY = 'orderlite_auth';

function Wrapper() {
  const location = useLocation();
  return (
    <>
      <div data-testid="location">{location.pathname}</div>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/menu" element={<div>Menu page</div>} />
          <Route path="/profile" element={<div>Profile page</div>} />
        </Route>
      </Routes>
    </>
  );
}

describe('ProtectedRoute', () => {
  const setAuth = () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken: 'token-123',
          user: { id: 1, email: 'user@example.com', name: 'Test User', role: 'customer' },
        }),
      );
    });
  };

  it('redirects to /login when not authenticated', () => {
    cy.window().then((win) => win.localStorage.removeItem(STORAGE_KEY));

    cy.mount(
      <MemoryRouter initialEntries={['/menu']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.get('[data-testid="location"]').should('have.text', '/login');
    cy.contains('Login page').should('be.visible');
  });

  it('renders child route when authenticated', () => {
    setAuth();

    cy.mount(
      <MemoryRouter initialEntries={['/menu']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.get('[data-testid="location"]').should('have.text', '/menu');
    cy.contains('Menu page').should('be.visible');
  });

  it('allows access to another protected route when authenticated', () => {
    setAuth();

    cy.mount(
      <MemoryRouter initialEntries={['/profile']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.get('[data-testid="location"]').should('have.text', '/profile');
    cy.contains('Profile page').should('be.visible');
  });
});
