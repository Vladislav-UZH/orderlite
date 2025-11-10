import {
  Button,
  ButtonSm,
  Input,
  TextArea,
  Pill,
  Progress,
  ListRow,
  RowTitle,
  RowSub,
  RowRight,
  Dot,
  ToastBar,
  Select,
} from '../../src/components/ui/ui-kit';
import { useState } from 'react';

describe('ui-kit Button', () => {
  it('renders label and handles click', () => {
    const onClick = cy.stub().as('click');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.mount(<Button onClick={onClick as any}>Click me</Button>);

    cy.contains('button', 'Click me').click();
    cy.get('@click').should('have.been.called');
  });

  it('supports full width and disabled state', () => {
    cy.mount(
      <div style={{ width: 300 }}>
        <Button full disabled>
          Disabled
        </Button>
      </div>,
    );

    cy.contains('button', 'Disabled').should('be.disabled');
  });

  it('renders small button variant', () => {
    cy.mount(<ButtonSm>Small</ButtonSm>);
    cy.contains('button', 'Small').should('be.visible');
  });
});

describe('ui-kit Input and TextArea', () => {
  it('allows typing into Input', () => {
    cy.mount(<Input placeholder="Type here" />);

    cy.get('input[placeholder="Type here"]').type('Hello');
    cy.get('input[placeholder="Type here"]').should('have.value', 'Hello');
  });

  it('allows typing into TextArea', () => {
    cy.mount(<TextArea placeholder="Write here" />);

    cy.get('textarea[placeholder="Write here"]').type('Multiline');
    cy.get('textarea[placeholder="Write here"]').should('have.value', 'Multiline');
  });
});

describe('ui-kit Pill', () => {
  function PillExample() {
    const [selected, setSelected] = useState(false);
    return (
      <Pill data-testid="pill" $selected={selected} onClick={() => setSelected((v) => !v)}>
        {selected ? 'Selected' : 'Not selected'}
      </Pill>
    );
  }

  it('renders selected and unselected states', () => {
    cy.mount(<PillExample />);

    cy.get('[data-testid="pill"]').contains('Not selected');
    cy.get('[data-testid="pill"]').click();
    cy.get('[data-testid="pill"]').contains('Selected');
  });
});

describe('ui-kit Progress', () => {
  it('sets proper aria attributes and width', () => {
    cy.mount(<Progress value={40} />);

    cy.get('[role="progressbar"]')
      .should('have.attr', 'aria-valuemin', '0')
      .and('have.attr', 'aria-valuemax', '100')
      .and('have.attr', 'aria-valuenow', '40');
  });

  it('clamps value between 0 and 100', () => {
    cy.mount(<Progress value={-10} />);
    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuenow', '0');

    cy.mount(<Progress value={200} />);
    cy.get('[role="progressbar"]').should('have.attr', 'aria-valuenow', '100');
  });
});

describe('ui-kit ListRow', () => {
  it('renders row with title, subtitle and right content', () => {
    const onClick = cy.stub().as('rowClick');

    cy.mount(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <ListRow onClick={onClick as any}>
        <div />
        <div>
          <RowTitle>Title</RowTitle>
          <RowSub>Subtitle</RowSub>
        </div>
        <RowRight>Right</RowRight>
      </ListRow>,
    );

    cy.contains('Title').should('be.visible');
    cy.contains('Subtitle').should('be.visible');
    cy.contains('Right').should('be.visible');

    cy.contains('Title').click();
    cy.get('@rowClick').should('have.been.called');
  });

  it('supports status dot', () => {
    cy.mount(<Dot data-testid="dot" color="#16a34a" />);

    cy.get('[data-testid="dot"]').should('have.css', 'background-color');
  });
});

describe('ui-kit ToastBar', () => {
  it('shows and hides toast based on $show prop', () => {
    cy.mount(
      <ToastBar data-testid="toast" $show={false}>
        Hello
      </ToastBar>,
    );
    cy.get('[data-testid="toast"]').should('have.css', 'opacity', '0');

    cy.mount(
      <ToastBar data-testid="toast" $show>
        Hello
      </ToastBar>,
    );
    cy.get('[data-testid="toast"]').should('have.css', 'opacity', '1');
  });
});

describe('ui-kit Select', () => {
  it('renders select and allows changing value', () => {
    cy.mount(
      <Select data-testid="select">
        <option value="one">One</option>
        <option value="two">Two</option>
      </Select>,
    );

    cy.get('[data-testid="select"]').select('two');
    cy.get('[data-testid="select"]').should('have.value', 'two');
  });
});
