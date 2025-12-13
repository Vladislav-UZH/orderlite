import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
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
  ListRow,
  RowTitle,
  RowSub,
  RowRight,
  Select,
  Helper,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
import { useMenuItems } from '../hooks/useMenuItems';

export function MenuScreen() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  const navigate = useNavigate();
  const { items, loading, error } = useMenuItems();

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchesQuery =
          !query.trim() ||
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase());

        const matchesCat = cat === 'All' || i.category.toLowerCase() === cat.toLowerCase();

        return matchesQuery && matchesCat;
      }),
    [items, query, cat],
  );

  const handleItemClick = (menuItemId: number) => {
    navigate('/checkout', {
      state: {
        from: 'menu',
        items: [{ menuItemId, quantity: 1 }],
      },
    });
  };

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <IconBack />
        </IconButton>
        <Title>OrderLite</Title>
        <IconButton aria-label="cart" onClick={() => navigate('/orders/active')}>
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

        <H2>Filter</H2>
        <Field>
          <Label>Category</Label>
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <H2 style={{ marginTop: 16 }}>Menu Items</H2>

        {loading && <Helper>Loading menu...</Helper>}
        {error && !loading && <Helper style={{ color: 'red' }}>{error}</Helper>}
        {!loading && !error && filtered.length === 0 && (
          <Helper>No items match your search.</Helper>
        )}

        <div>
          {filtered.map((i) => (
            <ListRow key={i.id} onClick={() => handleItemClick(i.id)}>
              <div />
              <div>
                <RowTitle>{i.name}</RowTitle>
                <RowSub>{i.description}</RowSub>
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
