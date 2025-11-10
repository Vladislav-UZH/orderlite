import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { MenuScreen } from '../../src/screens/MenuScreen';

function CheckoutStateSpy() {
  const location = useLocation();
  return <div data-testid="checkout-state">{JSON.stringify(location.state || null)}</div>;
}

describe('MenuScreen', () => {
  const menuItems = [
    {
      id: 1,
      name: 'Latte',
      description: 'Milk coffee',
      price: 4.5,
      category: 'Coffee',
    },
    {
      id: 2,
      name: 'Espresso',
      description: 'Strong coffee',
      price: 3,
      category: 'Coffee',
    },
    {
      id: 3,
      name: 'Muffin',
      description: 'Blueberry muffin',
      price: 2.5,
      category: 'Dessert',
    },
  ];

  function mountWithData(delay = 0) {
    cy.intercept('GET', 'http://localhost:3000/menuItems', {
      delay,
      statusCode: 200,
      body: menuItems,
    }).as('getMenu');

    cy.mount(
      <MemoryRouter initialEntries={['/menu']}>
        <Routes>
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/checkout" element={<CheckoutStateSpy />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('shows loading state then renders menu items', () => {
    mountWithData(200);

    cy.contains('Loading menu...').should('be.visible');
    cy.wait('@getMenu');
    cy.contains('Loading menu...').should('not.exist');

    cy.contains('Latte').should('be.visible');
    cy.contains('Espresso').should('be.visible');
    cy.contains('Muffin').should('be.visible');
  });

  it('filters by search query', () => {
    mountWithData();

    cy.wait('@getMenu');
    cy.get('input[placeholder="Search menu items"]').type('latte');

    cy.contains('Latte').should('be.visible');
    cy.contains('Espresso').should('not.exist');
    cy.contains('Muffin').should('not.exist');
  });

  it('filters by category', () => {
    mountWithData();

    cy.wait('@getMenu');
    cy.get('select').select('Dessert');

    cy.contains('Muffin').should('be.visible');
    cy.contains('Latte').should('not.exist');
  });

  it('shows empty state when nothing matches search', () => {
    mountWithData();

    cy.wait('@getMenu');
    cy.get('input[placeholder="Search menu items"]').type('zzzzzz');

    cy.contains('No items match your search.').should('be.visible');
  });

  it('navigates to checkout with selected item in state', () => {
    mountWithData();

    cy.wait('@getMenu');
    cy.contains('Latte').click();

    cy.get('[data-testid="checkout-state"]')
      .should('contain', '"from":"menu"')
      .and('contain', '"menuItemId":1')
      .and('contain', '"quantity":1');
  });
});
