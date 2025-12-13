import { API_URL } from '../../src/common/api';

describe('Auth flow and protected routes', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('opens login page on /login', () => {
    cy.visit('/login');

    cy.contains('Welcome back').should('be.visible');
    cy.get('input[placeholder="Enter your email"]').should('be.visible');
    cy.get('input[placeholder="Enter your password"]').should('be.visible');
    cy.contains('button', 'Log in').should('be.visible');
  });

  it('redirects protected route /menu to /login when not authed', () => {
    cy.visit('/menu');
    cy.contains('Welcome back').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('logs in successfully and opens menu', () => {
    cy.intercept('POST', `${API_URL}/login`, {
      statusCode: 200,
      body: {
        accessToken: 'test-token',
        user: {
          id: 1,
          name: 'John Customer',
          email: 'john@example.com',
          role: 'customer',
        },
      },
    }).as('login');

    cy.visit('/login');

    cy.get('input[placeholder="Enter your email"]').type('john@example.com');
    cy.get('input[placeholder="Enter your password"]').type('password123');
    cy.contains('button', 'Log in').click();

    cy.wait('@login');

    cy.url().should('include', '/menu');
    cy.contains('Menu Items').should('be.visible');
  });
});
