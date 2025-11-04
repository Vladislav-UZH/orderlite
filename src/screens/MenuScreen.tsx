import { useMemo, useState } from 'react';
import {
  IconBack,
  Screen,
  Header,
  Title,
  Label,
  Field,
  Input,
  IconButton,
  SafeBottom,
  IconCart,
  IconSearch,
  H2,
  Pills,
  Pill,
  ListRow,
  RowTitle,
  RowSub,
  RowRight,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
export function MenuScreen() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Coffee');

  const items = useMemo(
    () => [
      { name: 'Latte', sub: 'Espresso with steamed milk', price: 3.5 },
      { name: 'Americano', sub: 'Espresso with hot water', price: 2.75 },
      { name: 'Cappuccino', sub: 'Espresso with frothed milk', price: 3.25 },
      { name: 'Mocha', sub: 'Espresso with chocolate and milk', price: 4.0 },
      { name: 'Caramel Macchiato', sub: 'Espresso with caramel and milk', price: 4.5 },
    ],
    [],
  );

  const cats = ['Coffee', 'Pastries', 'Sandwiches'];
  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconBack />
        </IconButton>
        <Title>OrderLite</Title>
        <IconButton aria-label="cart">
          <IconCart />
        </IconButton>
      </Header>

      <div className="container">
        <Field>
          <Label htmlFor="q">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconSearch /> Search
            </span>
          </Label>
          <Input
            id="q"
            placeholder="Search menu items"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>

        <H2>Categories</H2>
        <Pills>
          {cats.map((c) => (
            <Pill key={c} $selected={c === cat} onClick={() => setCat(c)}>
              {c}
            </Pill>
          ))}
        </Pills>

        <H2 style={{ marginTop: 16 }}>Menu Items</H2>
        <div>
          {filtered.map((i) => (
            <ListRow key={i.name} onClick={() => {}}>
              <div />
              <div>
                <RowTitle>{i.name}</RowTitle>
                <RowSub>{i.sub}</RowSub>
              </div>
              <RowRight>${i.price.toFixed(2)}</RowRight>
            </ListRow>
          ))}
        </div>
      </div>

      <BottomTabs />

      <SafeBottom />
    </Screen>
  );
}
