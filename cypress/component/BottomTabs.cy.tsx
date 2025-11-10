import { MemoryRouter, useLocation } from 'react-router';
import BottomTabs from '../../src/components/BottomTabs';

function Wrapper() {
  const location = useLocation();
  return (
    <>
      <div data-testid="location">{location.pathname}</div>
      <BottomTabs />
    </>
  );
}

describe('BottomTabs', () => {
  it('highlights Menu and navigates to Orders and Profile', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/menu']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.get('[data-testid="location"]').should('have.text', '/menu');
    cy.contains('Orders/Status').click();
    cy.get('[data-testid="location"]').should('have.text', '/orders');

    cy.contains('Profile').click();
    cy.get('[data-testid="location"]').should('have.text', '/profile');
  });
});
