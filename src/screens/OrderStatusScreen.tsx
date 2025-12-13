import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

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
  Helper,
} from '../components/ui/ui-kit';
import { useOrders, type Order, type OrderStatus } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';

const STAGES = [
  { name: 'New', key: 'new' as const, midValue: 10, message: 'We received your order' },
  {
    name: 'In progress',
    key: 'inProgress' as const,
    midValue: 40,
    message: 'Your order is being prepared',
  },
  { name: 'Ready', key: 'ready' as const, midValue: 70, message: 'Your order is ready' },
  { name: 'Delivered', key: 'delivered' as const, midValue: 100, message: 'Order delivered' },
];

export function OrderStatusScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Invalid order id');
        setLoading(false);
        return;
      }

      const orderId = Number(id);
      if (Number.isNaN(orderId)) {
        setError('Invalid order id');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, getOrderById]);

  const statusIndex = useMemo(() => {
    if (!order) return -1;
    return STAGES.findIndex((s) => s.key === order.status);
  }, [order]);

  const currentStage = useMemo(
    () => (statusIndex >= 0 ? STAGES[statusIndex] : null),
    [statusIndex],
  );

  const getProgressValue = (stageIndex: number) => {
    if (statusIndex < 0) return 0;
    if (stageIndex < statusIndex) return 100;
    if (stageIndex === statusIndex) return STAGES[stageIndex].midValue;
    return 0;
  };

  const titleText = order ? `Order #${order.id}` : 'Order';
  const subtitleText =
    currentStage?.message ?? (loading ? 'Loading order...' : 'Unable to load order status.');

  const handleChangeStatus = async (status: OrderStatus) => {
    if (!order || updating) return;
    setUpdating(true);
    setUpdateError(null);
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrder(updated);
    } catch {
      setUpdateError('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <IconBack />
        </IconButton>
        <Title>OrderLite</Title>
        <span />
      </Header>

      <div className="container">
        <H1 style={{ textAlign: 'center', marginTop: 6 }}>{titleText}</H1>
        <Text style={{ textAlign: 'center', marginBottom: 12 }}>
          <Muted>{subtitleText}</Muted>
        </Text>

        {loading && <Helper>Loading status...</Helper>}
        {error && !loading && <Helper style={{ color: 'red', marginBottom: 8 }}>{error}</Helper>}

        {!loading && !error && order && (
          <>
            {STAGES.map((s, index) => (
              <div key={s.name} style={{ margin: '12px 0' }}>
                <div style={{ fontSize: 14, margin: '0 0 6px 2px' }}>{s.name}</div>
                <Progress value={getProgressValue(index)} />
              </div>
            ))}

            {isAdmin && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 14, marginBottom: 6 }}>Change status</div>
                <select
                  value={order.status}
                  onChange={(e) => handleChangeStatus(e.target.value as OrderStatus)}
                  disabled={updating}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--color-secondary)',
                    background: 'white',
                  }}
                >
                  <option value="new">New</option>
                  <option value="inProgress">In progress</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                </select>
                {updateError && (
                  <Helper style={{ color: 'red', marginTop: 4 }}>{updateError}</Helper>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <BottomTabs />
      <SafeBottom />
    </Screen>
  );
}
