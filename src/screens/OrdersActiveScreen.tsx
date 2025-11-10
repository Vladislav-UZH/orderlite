import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

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
  Helper,
  Muted,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
import { useOrders } from '../hooks/useOrders';
import { useMenuItems } from '../hooks/useMenuItems';
import { useAuth } from '../hooks/useAuth';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400&auto=format&fit=crop',
];

export function OrdersActiveScreen() {
  const [tab, setTab] = useState<'All' | 'Active'>('Active');
  const navigate = useNavigate();

  const { orders, loading, error } = useOrders();
  const { items: menuItems } = useMenuItems();

  const { user } = useAuth();
  const viewOrders = useMemo(() => {
    return orders.map((o) => {
      const totalItems = o.items?.reduce((sum, it) => sum + it.quantity, 0) ?? 0;
      const firstItem = o.items?.[0];
      const menuItem = firstItem ? menuItems.find((m) => m.id === firstItem.menuItemId) : undefined;

      const name = menuItem?.name ?? `Order #${o.id}`;
      const active = o.status !== 'delivered';
      const img = FALLBACK_IMAGES[o.id % FALLBACK_IMAGES.length];

      return { ...o, viewName: name, totalItems, active, img };
    });
  }, [orders, menuItems]);

  const filtered = useMemo(
    () => viewOrders.filter((o) => (tab === 'All' ? true : o.active)),
    [viewOrders, tab],
  );

  if (!user || user.role !== 'admin') {
    return (
      <Screen>
        <Header>
          <IconButton aria-label="back" onClick={() => navigate(-1)}>
            <IconBack />
          </IconButton>
          <Title>Orders</Title>
          <span />
        </Header>
        <div className="container">
          <Helper>You do not have access to this page.</Helper>
        </div>
        <BottomTabs />
        <SafeBottom />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <IconBack />
        </IconButton>
        <Title>Orders</Title>
        <span />
      </Header>

      <div className="container">
        <Stack dir="row" gap={18} style={{ marginBottom: 6 }}>
          <button
            type="button"
            onClick={() => setTab('All')}
            style={{
              background: 'transparent',
              border: 0,
              fontWeight: tab === 'All' ? 800 : 600,
              cursor: 'pointer',
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab('Active')}
            style={{
              background: 'transparent',
              border: 0,
              fontWeight: tab === 'Active' ? 800 : 600,
              cursor: 'pointer',
            }}
          >
            Active
          </button>
        </Stack>
        <div
          style={{
            height: 3,
            background: '#dfe7ef',
            borderRadius: 999,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: tab === 'Active' ? '30%' : '10%',
              height: '100%',
              background: 'var(--color-accent)',
              borderRadius: 999,
              transition: 'width 0.2s ease',
            }}
          />
        </div>

        {loading && <Helper>Loading orders...</Helper>}
        {error && !loading && <Helper style={{ color: 'red', marginBottom: 8 }}>{error}</Helper>}
        {!loading && !error && filtered.length === 0 && <Helper>No orders to show.</Helper>}

        {filtered.map((o) => (
          <ListRow key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
            <RowThumb src={o.img} alt={o.viewName} />
            <div>
              <RowTitle>{o.viewName}</RowTitle>
              <Muted>Order #{o.id}</Muted>
            </div>
            <RowRight>
              <Dot color={o.active ? '#16a34a' : '#9ca3af'} />
            </RowRight>
          </ListRow>
        ))}
      </div>

      <div style={{ position: 'fixed', right: 16, bottom: 88 }}>
        <ButtonSm
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            paddingInline: 12,
          }}
          onClick={() => navigate('/menu')}
        >
          <IconPlus /> New Order
        </ButtonSm>
      </div>

      <BottomTabs />
      <SafeBottom />
    </Screen>
  );
}
