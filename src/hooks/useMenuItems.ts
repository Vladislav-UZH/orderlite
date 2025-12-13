import { useEffect, useState } from 'react';
import { api } from '../common/api';

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api
      .get<MenuItem[]>('/menuItems')
      .then(({ data }) => {
        if (!active) return;
        setItems(data);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (!active) return;
        const msg = e?.response?.data || e?.message || 'Failed to load menu items';
        setError(typeof msg === 'string' ? msg : 'Failed to load menu items');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}
