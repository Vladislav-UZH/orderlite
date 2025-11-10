import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { NotFoundScreen } from '../../src/screens/NotFoundScreen';

function Wrapper() {
  const location = useLocation();
  return (
    <>
      <div data-testid="location">{location.pathname}</div>
      <Routes>
        <Route path="/menu" element={<div>Menu</div>} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </>
  );
}

describe('NotFoundScreen', () => {
  it('renders 404 content and actions', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/unknown']}>
        <NotFoundScreen />
      </MemoryRouter>,
    );

    cy.contains('404').should('be.visible');
    cy.contains('Order not found').should('be.visible');
    cy.contains('Повернутись до меню').should('be.visible');
    cy.contains('Назад').should('be.visible');
  });

  it('navigates to /menu when clicking primary button', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/unknown']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.contains('Повернутись до меню').click();
    cy.get('[data-testid="location"]').should('have.text', '/menu');
  });

  it('navigates back when clicking secondary button', () => {
    cy.mount(
      <MemoryRouter initialEntries={['/menu', '/unknown']}>
        <Wrapper />
      </MemoryRouter>,
    );

    cy.contains('Назад').click();
    cy.get('[data-testid="location"]').should('have.text', '/menu');
  });
});
