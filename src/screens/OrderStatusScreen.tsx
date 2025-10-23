import BottomTabs from '../components/BottomTabs';
import {
  Screen,
  Header,
  IconButton,
  Title,
  H1,
  Text,
  Muted,
  Progress,
  SafeBottom,
  IconBack,
} from '../components/ui/ui-kit';
export function OrderStatusScreen() {
  const stages = [
    { name: 'New', value: 10 },
    { name: 'In progress', value: 40 },
    { name: 'Ready', value: 70 },
    { name: 'Delivered', value: 100 },
  ];

  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconBack />
        </IconButton>
        <Title>OrderLite</Title>
        <span />
      </Header>

      <div className="container">
        <H1 style={{ textAlign: 'center', marginTop: 6 }}>Order #123</H1>
        <Text style={{ textAlign: 'center', marginBottom: 12 }}>
          <Muted>Your order is being prepared</Muted>
        </Text>

        {stages.map((s) => (
          <div key={s.name} style={{ margin: '12px 0' }}>
            <div style={{ fontSize: 14, margin: '0 0 6px 2px' }}>{s.name}</div>
            <Progress value={s.value} />
          </div>
        ))}
      </div>

      <BottomTabs />

      <SafeBottom />
    </Screen>
  );
}
