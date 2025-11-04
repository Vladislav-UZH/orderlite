import { useState, type ReactNode } from 'react';
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
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
export function ProfileScreen() {
  const [notif, setNotif] = useState(false);

  const Avatar = () => (
    <div
      style={{
        width: 88,
        height: 88,
        borderRadius: '50%',
        background: '#fde68a',
        display: 'grid',
        placeItems: 'center',
        border: '2px solid var(--line)',
        margin: '12px auto 8px',
      }}
    >
      <span role="img" aria-label="avatar" style={{ fontSize: 40 }}>
        🧑🏻‍💻
      </span>
    </div>
  );

  const Row = ({
    left,
    right,
    editable,
  }: {
    left: ReactNode | null;
    right: ReactNode | null;
    editable: ReactNode | null;
  }) => (
    <Stack dir="row" gap={8} style={{ alignItems: 'center', padding: '10px 2px' }}>
      <div style={{ flex: 1 }}>{left}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {editable && <IconEdit />}
        {right}
        <IconChevron />
      </div>
    </Stack>
  );

  const orders = [
    { status: 'Ready', id: 123456, dt: '01/15/2024', price: 12.5 },
    { status: 'Completed', id: 123457, dt: '01/16/2024', price: 8.75 },
    { status: 'Ready', id: 123458, dt: '01/17/2024', price: 15.0 },
  ];

  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconBack />
        </IconButton>
        <Title>Profile</Title>
        <span />
      </Header>

      <div className="container">
        <Avatar />
        <H1 style={{ textAlign: 'center', margin: 0 }}>Ethan Carter</H1>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          <Muted>ethan.carter@email.com</Muted>
        </Text>

        <Card>
          <CardBody>
            <H2>Account</H2>
            <Row
              left={
                <>
                  <div>Name</div>
                  <Muted>Ethan Carter</Muted>
                </>
              }
              right={null}
              editable
            />
            <Divider />
            <Row
              left={
                <>
                  <div>Phone</div>
                  <Muted>+1 (555) 123-4567</Muted>
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
            {orders.map((o) => (
              <Stack key={o.id} dir="row" style={{ alignItems: 'center', padding: '8px 2px' }}>
                <div style={{ flex: 1 }}>
                  <a href="#">Order #{o.id}</a> • <Muted>{o.dt}</Muted> •{' '}
                  <Muted>${o.price.toFixed(2)}</Muted>
                </div>
                <IconChevron />
              </Stack>
            ))}
          </CardBody>
        </Card>
      </div>

      <BottomTabs />

      <SafeBottom />
    </Screen>
  );
}
