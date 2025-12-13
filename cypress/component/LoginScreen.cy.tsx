import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { LoginScreen } from '../../src/screens/LoginScreen';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function MenuStub() {
  return <div data-testid="menu-page">Menu page</div>;
}

describe('LoginScreen', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('disables submit when form is invalid and enables when valid', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    cy.contains('button', 'Log in').should('be.disabled');

    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('input[placeholder="Enter your password"]').type('123456');

    cy.contains('button', 'Log in').should('not.be.disabled');
  });

  it('shows local validation error when submitting invalid form', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </MemoryRouter>,
    );

    cy.get('input[placeholder="Enter your email"]').type('bad');
    cy.get('input[placeholder="Enter your password"]').type('123');

    cy.get('form').submit();

    cy.contains('Please enter a valid email and password (min 6 chars).').should('be.visible');
  });

  it('calls login API and handles successful submit', () => {
    cy.intercept('POST', 'http://localhost:3000/login', {
      statusCode: 200,
      body: {
        accessToken: 'token-123',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'customer',
        },
      },
    }).as('login');

    cy.mount(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/menu" element={<MenuStub />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
    );

    cy.get('input[placeholder="Enter your email"]').type('test@example.com');
    cy.get('input[placeholder="Enter your password"]').type('123456');

    cy.contains('button', 'Log in').click();

    cy.wait('@login');
    cy.get('[data-testid="location"]').should('contain', '/menu');
    cy.get('[data-testid="menu-page"]').should('be.visible');
  });
});
