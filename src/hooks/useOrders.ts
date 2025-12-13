import { useCallback, useEffect, useState } from 'react';
import { api } from '../common/api';

export type OrderStatus = 'new' | 'inProgress' | 'ready' | 'delivered';

export type OrderItem = {
  menuItemId: number;
  quantity: number;
};

export type Order = {
  id: number;
  userId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
};

type CreateOrderPayload = {
  userId: number;
  items: OrderItem[];
  status?: OrderStatus;
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Order[]>('/orders');
      setOrders(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || 'Failed to load orders';
      setError(typeof msg === 'string' ? msg : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (payload: CreateOrderPayload) => {
    const body: Omit<Order, 'id'> = {
      userId: payload.userId,
      items: payload.items,
      status: payload.status ?? 'new',
      createdAt: new Date().toISOString(),
    };

    const { data } = await api.post<Order>('/orders', body);
    setOrders((prev) => [...prev, data]);
    return data;
  }, []);

  const getOrderById = useCallback(async (id: number) => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  }, []);

  const updateOrderStatus = useCallback(async (id: number, status: OrderStatus) => {
    const { data } = await api.patch<Order>(`/orders/${id}`, { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? data : o)));
    return data;
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
  };
}
