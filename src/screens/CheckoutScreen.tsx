import { useState } from 'react';

import {
  Screen,
  Header,
  IconButton,
  Title,
  H2,
  Field,
  Label,
  Input,
  Button,
  Pills,
  Pill,
  Spacer,
  SafeBottom,
  IconBack,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
export function CheckoutScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pay, setPay] = useState('');

  const canSubmit = name && phone && pay;

  return (
    <Screen>
      <Header>
        <IconButton aria-label="close">
          <IconBack />
        </IconButton>
        <Title>Checkout</Title>
        <span />
      </Header>
      <div className="container">
        <H2>Contact</H2>
        <Field>
          <Label>Name</Label>
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field>
          <Label>Phone</Label>
          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
        </Field>

        <H2>Payment</H2>
        <Pills>
          <Pill $selected={pay === 'cash'} onClick={() => setPay('cash')}>
            Cash
          </Pill>
          <Pill $selected={pay === 'card'} onClick={() => setPay('card')}>
            Card
          </Pill>
        </Pills>

        <Spacer />
        <Button full disabled={!canSubmit} style={{ marginTop: 12 }}>
          Submit Order
        </Button>
      </div>
      <BottomTabs />
      <SafeBottom />
    </Screen>
  );
}
