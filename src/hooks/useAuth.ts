import { useCallback, useEffect, useState } from 'react';
import { api, setAuthToken } from '../common/api';

export type Role = 'customer' | 'admin';

export type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };

type AuthResponse = {
  accessToken: string;
  user: User;
};

const STORAGE_KEY = 'orderlite_auth';

function saveAuth(auth: AuthResponse) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function loadAuth(): AuthResponse | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthResponse | null>(() => {
    const stored = loadAuth();
    if (stored?.accessToken) {
      setAuthToken(stored.accessToken);
    }
    return stored;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = auth?.accessToken ?? null;
  const user = auth?.user ?? null;
  const isAuthed = !!token;

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>('/login', payload);
      setAuth(data);
      saveAuth(data);
      setAuthToken(data.accessToken);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || 'Login failed';
      setError(typeof msg === 'string' ? msg : 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>('/register', payload);
      setAuth(data);
      saveAuth(data);
      setAuthToken(data.accessToken);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || 'Register failed';
      setError(typeof msg === 'string' ? msg : 'Register failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    clearAuth();
    setAuthToken(null);
  }, []);

  useEffect(() => {
    const handler = () => {
      const stored = loadAuth();
      setAuth(stored);
      setAuthToken(stored?.accessToken ?? null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return {
    user,
    token,
    isAuthed,
    loading,
    error,
    login,
    register,
    logout,
  };
}
