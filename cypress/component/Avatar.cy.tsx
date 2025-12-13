import { Avatar } from '../../src/components/Avatar';

describe('Avatar', () => {
  it('renders fallback emoji when src is not provided', () => {
    cy.mount(<Avatar size={64} />);
    cy.contains('🧑🏻').should('be.visible');
  });

  it('renders image when src is provided', () => {
    cy.mount(
      <Avatar
        size={64}
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format"
        alt="User avatar"
      />,
    );
    cy.get('img[alt="User avatar"]').should('be.visible');
  });
});
