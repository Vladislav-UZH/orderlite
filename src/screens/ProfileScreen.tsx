import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';

import {
  Card,
  CardBody,
  Divider,
  H1,
  H2,
  Header,
  IconBack,
  IconButton,
  IconChevron,
  IconEdit,
  Muted,
  SafeBottom,
  Screen,
  Stack,
  Text,
  Title,
  Helper,
  Button,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';

type RowProps = {
  left: ReactNode | null;
  right: ReactNode | null;
  editable?: boolean;
};

function Row({ left, right, editable }: RowProps) {
  return (
    <Stack dir="row" gap={8} style={{ alignItems: 'center', padding: '10px 2px' }}>
      <div style={{ flex: 1 }}>{left}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {editable && <IconEdit />}
        {right}
        <IconChevron />
      </div>
    </Stack>
  );
}

export function ProfileScreen() {
  const [notif, setNotif] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { orders, loading, error } = useOrders();

  const displayName = user?.name ?? 'Guest';
  const displayEmail = user?.email ?? '—';

  const userOrders = useMemo(
    () => (user ? orders.filter((o) => o.userId === user.id) : []),
    [orders, user],
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <IconBack />
        </IconButton>
        <Title>Profile</Title>
        <span />
      </Header>

      <div className="container">
        <div style={{ display: 'grid', placeItems: 'center', margin: '12px 0 8px' }}>
          <Avatar src="" size={88} />
        </div>
        <H1 style={{ textAlign: 'center', margin: 0 }}>{displayName}</H1>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          <Muted>{displayEmail}</Muted>
        </Text>

        <Card>
          <CardBody>
            <H2>Account</H2>
            <Row
              left={
                <>
                  <div>Name</div>
                  <Muted>{displayName}</Muted>
                </>
              }
              right={null}
              editable
            />
            <Divider />
            <Row
              left={
                <>
                  <div>Email</div>
                  <Muted>{displayEmail}</Muted>
                </>
              }
              right={null}
              editable
            />
          </CardBody>
        </Card>

        <div style={{ height: 12 }} />

        <Card>
          <CardBody>
            <H2>Preferences</H2>
            <Stack dir="row" style={{ alignItems: 'center' }}>
              <div style={{ flex: 1 }}>Browser Notifications</div>
              <button
                onClick={() => setNotif((v) => !v)}
                aria-pressed={notif}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 999,
                  border: '1px solid var(--color-secondary)',
                  background: notif ? 'var(--color-accent)' : '#eaf1f7',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: notif ? 22 : 3,
                    width: 22,
                    height: 22,
                    background: '#fff',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'left 0.15s ease',
                  }}
                />
              </button>
            </Stack>
          </CardBody>
        </Card>

        <div style={{ height: 12 }} />

        <Card>
          <CardBody>
            <H2>Order History</H2>

            {loading && <Helper>Loading orders...</Helper>}
            {error && !loading && (
              <Helper style={{ color: 'red', marginBottom: 4 }}>{error}</Helper>
            )}
            {!loading && !error && userOrders.length === 0 && <Helper>No orders yet.</Helper>}

            {userOrders.map((o) => {
              const date = new Date(o.createdAt);
              const dt = isNaN(date.getTime())
                ? '—'
                : date.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  });
              const itemsCount = o.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

              return (
                <Stack key={o.id} dir="row" style={{ alignItems: 'center', padding: '8px 2px' }}>
                  <div style={{ flex: 1 }}>
                    <Link
                      to={`/orders/${o.id}`}
                      style={{ textDecoration: 'none', color: 'var(--color-accent)' }}
                    >
                      Order #{o.id}
                    </Link>{' '}
                    • <Muted>{dt}</Muted> • <Muted>{itemsCount} items</Muted>
                  </div>
                  <IconChevron />
                </Stack>
              );
            })}
          </CardBody>
        </Card>

        <div style={{ height: 16 }} />

        <Button
          type="button"
          onClick={handleLogout}
          style={{ width: '100%', marginTop: 4 }}
          variant="outline"
        >
          Log out
        </Button>
      </div>

      <BottomTabs />
      <SafeBottom />
    </Screen>
  );
}
