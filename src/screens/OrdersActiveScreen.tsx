import { useState } from 'react';
import {
  IconBack,
  Screen,
  Header,
  Title,
  IconButton,
  SafeBottom,
  ListRow,
  RowTitle,
  RowRight,
  IconPlus,
  ButtonSm,
  Dot,
  RowThumb,
  Stack,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
export function OrdersActiveScreen() {
  const list = [
    {
      name: 'Latte',
      id: 1234,
      active: true,
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Cappuccino',
      id: 1235,
      active: true,
      img: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Espresso',
      id: 1236,
      active: true,
      img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400&auto=format&fit=crop',
    },
  ];

  const [tab, setTab] = useState('Active');

  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconBack />
        </IconButton>
        <Title>Orders</Title>
        <span />
      </Header>

      <div className="container">
        <Stack dir="row" gap={18} style={{ marginBottom: 6 }}>
          <button
            onClick={() => setTab('All')}
            style={{ background: 'transparent', border: 0, fontWeight: tab === 'All' ? 800 : 600 }}
          >
            All
          </button>
          <button
            onClick={() => setTab('Active')}
            style={{
              background: 'transparent',
              border: 0,
              fontWeight: tab === 'Active' ? 800 : 600,
            }}
          >
            Active
          </button>
        </Stack>
        <div style={{ height: 3, background: '#dfe7ef', borderRadius: 999, marginBottom: 8 }}>
          <div
            style={{
              width: tab === 'Active' ? '30%' : '10%',
              height: '100%',
              background: 'var(--color-accent)',
              borderRadius: 999,
            }}
          />
        </div>

        {list.map((o) => (
          <ListRow key={o.id} onClick={() => {}}>
            <RowThumb src={o.img} alt={o.name} />
            <div>
              <RowTitle>{o.name}</RowTitle>
              <a href="#">Order #{o.id}</a>
            </div>
            <RowRight>
              <Dot color="#16a34a" />
            </RowRight>
          </ListRow>
        ))}
      </div>

      <div style={{ position: 'fixed', right: 16, bottom: 88 }}>
        <ButtonSm>
          <IconPlus /> New Order
        </ButtonSm>
      </div>

      <BottomTabs />

      <SafeBottom />
    </Screen>
  );
}
