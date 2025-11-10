import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import BottomTabs from '../components/BottomTabs';
import {
  ButtonSm,
  H2,
  Header,
  IconBack,
  IconButton,
  IconPlus,
  Muted,
  SafeBottom,
  Screen,
  Spacer,
  Stack,
  Title,
  Helper,
} from '../components/ui/ui-kit';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';

type SectionRowProps = {
  title: string;
  count: number;
  lastOrderId?: number;
  onOpenOrder?: () => void;
};

function SectionRow({ title, count, lastOrderId, onOpenOrder }: SectionRowProps) {
  const hasOrders = count > 0;
  const itemsLabel = count === 0 ? 'No orders yet' : `${count} ${count === 1 ? 'order' : 'orders'}`;

  return (
    <>
      <Stack dir="row" gap={8} style={{ alignItems: 'center', marginTop: 6, marginBottom: 8 }}>
        <H2 style={{ margin: 0 }}>{title}</H2>
        <Spacer />
        <ButtonSm type="button" style={{ opacity: hasOrders ? 1 : 0.5 }} disabled={!hasOrders}>
          Notify customer
        </ButtonSm>
      </Stack>
      <div style={{ margin: '0 2px 12px' }}>
        <Muted>{itemsLabel}</Muted>
        {hasOrders && lastOrderId && onOpenOrder && (
          <>
            <br />
            <button
              type="button"
              onClick={onOpenOrder}
              style={{
                padding: 0,
                marginTop: 2,
                border: 'none',
                background: 'none',
                color: '#1172d4',
                fontSize: 14,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Order #{lastOrderId}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export function OrdersBucketsScreen() {
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders();
  const { user } = useAuth();

  const buckets = useMemo(
    () => ({
      new: orders.filter((o) => o.status === 'new'),
      inProgress: orders.filter((o) => o.status === 'inProgress'),
      ready: orders.filter((o) => o.status === 'ready'),
      delivered: orders.filter((o) => o.status === 'delivered'),
    }),
    [orders],
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

  const getLastId = (arr: typeof orders) => (arr.length ? arr[arr.length - 1].id : undefined);

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <IconBack />
        </IconButton>
        <Title>Orders</Title>
        <IconButton aria-label="new order" onClick={() => navigate('/menu')}>
          <IconPlus />
        </IconButton>
      </Header>

      <div className="container">
        {loading && <Helper>Loading orders...</Helper>}
        {error && !loading && <Helper style={{ color: 'red', marginBottom: 8 }}>{error}</Helper>}

        <SectionRow
          title="New"
          count={buckets.new.length}
          lastOrderId={getLastId(buckets.new)}
          onOpenOrder={
            buckets.new.length ? () => navigate(`/orders/${getLastId(buckets.new)}`) : undefined
          }
        />
        <SectionRow
          title="In progress"
          count={buckets.inProgress.length}
          lastOrderId={getLastId(buckets.inProgress)}
          onOpenOrder={
            buckets.inProgress.length
              ? () => navigate(`/orders/${getLastId(buckets.inProgress)}`)
              : undefined
          }
        />
        <SectionRow
          title="Ready"
          count={buckets.ready.length}
          lastOrderId={getLastId(buckets.ready)}
          onOpenOrder={
            buckets.ready.length ? () => navigate(`/orders/${getLastId(buckets.ready)}`) : undefined
          }
        />
        <SectionRow
          title="Delivered"
          count={buckets.delivered.length}
          lastOrderId={getLastId(buckets.delivered)}
          onOpenOrder={
            buckets.delivered.length
              ? () => navigate(`/orders/${getLastId(buckets.delivered)}`)
              : undefined
          }
        />
      </div>

      <BottomTabs />
      <SafeBottom />
    </Screen>
  );
}
