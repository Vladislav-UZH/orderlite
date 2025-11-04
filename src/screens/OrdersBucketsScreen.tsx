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
} from '../components/ui/ui-kit';
export function OrdersBucketsScreen() {
  const SectionRow = ({
    title,
    items,
    orderId,
  }: {
    title: string;
    items: string;
    orderId: number;
  }) => (
    <>
      <Stack dir="row" gap={8} style={{ alignItems: 'center', marginTop: 6, marginBottom: 8 }}>
        <H2 style={{ margin: 0 }}>{title}</H2>
        <Spacer />
        <ButtonSm variant="subtle">Notify customer</ButtonSm>
      </Stack>
      <div style={{ margin: '0 2px 12px' }}>
        <Muted>{items}</Muted>
        <br />
        <a href="#">Order #{orderId}</a>
      </div>
    </>
  );

  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconBack />
        </IconButton>
        <Title>Orders</Title>
        <IconButton aria-label="more">
          <IconPlus />
        </IconButton>
      </Header>

      <div className="container">
        <SectionRow title="New" items="2 items" orderId={1234} />
        <SectionRow title="In progress" items="3 items" orderId={1235} />
        <SectionRow title="Ready" items="1 item" orderId={1236} />
        <SectionRow title="Delivered" items="2 items" orderId={1237} />
      </div>

      <BottomTabs />

      <SafeBottom />
    </Screen>
  );
}
