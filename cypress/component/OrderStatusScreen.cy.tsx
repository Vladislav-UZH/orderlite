import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { OrderStatusScreen } from '../../src/screens/OrderStatusScreen';

const API_URL = 'http://localhost:3000';
const STORAGE_KEY = 'orderlite_auth';

describe('OrderStatusScreen', () => {
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

  const mountWithRoute = (initialPath: string) => {
    cy.mount(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/orders/:id" element={<OrderStatusScreen />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('loads order for customer and shows progress', () => {
    setAuth('customer');

    cy.intercept('GET', `${API_URL}/orders/123`, {
      statusCode: 200,
      body: {
        id: 123,
        userId: 1,
        items: [],
        status: 'inProgress',
        createdAt: new Date().toISOString(),
      },
    }).as('getOrder');

    mountWithRoute('/orders/123');

    cy.wait('@getOrder');

    cy.contains('Order #123').should('be.visible');
    cy.contains('Your order is being prepared').should('be.visible');
    cy.get('[role="progressbar"]').should('have.length', 4);
    cy.contains('Change status').should('not.exist');
  });

  it('shows error when order not found', () => {
    setAuth('customer');

    cy.intercept('GET', `${API_URL}/orders/999`, {
      statusCode: 404,
      body: { message: 'Not found' },
    }).as('getOrder');

    mountWithRoute('/orders/999');

    cy.wait('@getOrder');

    cy.contains('Order').should('be.visible');
    cy.contains('Order not found').should('be.visible');
  });

  it('allows admin to change status and sends PATCH', () => {
    setAuth('admin');

    cy.intercept('GET', `${API_URL}/orders/321`, {
      statusCode: 200,
      body: {
        id: 321,
        userId: 1,
        items: [],
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    }).as('getOrder');

    cy.intercept('PATCH', `${API_URL}/orders/321`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 321,
          userId: 1,
          items: [],
          status: req.body.status,
          createdAt: new Date().toISOString(),
        },
      });
    }).as('patchOrder');

    mountWithRoute('/orders/321');

    cy.wait('@getOrder');

    cy.contains('Order #321').should('be.visible');
    cy.contains('We received your order').should('be.visible');
    cy.contains('Change status').should('be.visible');

    cy.get('select').should('have.value', 'new');
    cy.get('select').select('Ready');

    cy.wait('@patchOrder')
      .its('request.body')
      .should((body) => {
        expect(body.status).to.equal('ready');
      });

    cy.get('select').should('have.value', 'ready');
    cy.contains('Your order is ready').should('be.visible');
  });
});
