import React from 'react';
import { MemoryRouter } from 'react-router';
import { RegisterScreen } from '../../src/screens/RegisterScreen';

describe('RegisterScreen', () => {
  const mountRegister = () => {
    cy.mount(
      <MemoryRouter initialEntries={['/register']}>
        <RegisterScreen />
      </MemoryRouter>,
    );
  };

  it('disables submit when form is invalid and enables when valid', () => {
    mountRegister();

    cy.contains('button', 'Register').should('be.disabled');

    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('user@example.com');
    cy.get('input[placeholder="Password"]').type('secret123');
    cy.get('input[placeholder="Repeat password"]').type('secret123');

    cy.contains('button', 'Register').should('not.be.disabled');
  });

  it('shows validation error when passwords do not match', () => {
    mountRegister();

    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('user@example.com');
    cy.get('input[placeholder="Password"]').type('secret123');
    cy.get('input[placeholder="Repeat password"]').type('different');

    cy.get('form').submit();

    cy.contains('Check name, email and passwords (min 6 chars, must match).').should('be.visible');
    cy.contains('Password mismatch').should('be.visible');
  });

  it('calls register API and handles successful submit', () => {
    cy.intercept('POST', 'http://localhost:3000/register', {
      statusCode: 200,
      body: {
        accessToken: 'reg-token-1',
        user: {
          id: 2,
          email: 'user@example.com',
          name: 'Test User',
          role: 'customer',
        },
      },
    }).as('register');

    mountRegister();

    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('user@example.com');
    cy.get('input[placeholder="Password"]').type('secret123');
    cy.get('input[placeholder="Repeat password"]').type('secret123');

    cy.contains('button', 'Register').should('not.be.disabled');
    cy.get('form').submit();

    cy.wait('@register')
      .its('request.body')
      .should((body) => {
        expect(body.name).to.equal('Test User');
        expect(body.email).to.equal('user@example.com');
        expect(body.password).to.equal('secret123');
      });

    cy.contains('Check name, email and passwords').should('not.exist');
  });
});
