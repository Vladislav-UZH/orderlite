import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
  Screen,
  Header,
  IconButton,
  Title,
  H2,
  Field,
  Label,
  Input,
  Pills,
  Pill,
  Button,
  Spacer,
  SafeBottom,
  SheetOverlay,
  BottomSheet,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  ToastBar,
  Helper,
} from '../components/ui/ui-kit';
import BottomTabs from '../components/BottomTabs';
import { useAuth } from '../hooks/useAuth';
import { useOrders, type OrderItem } from '../hooks/useOrders';

type CheckoutState = {
  from?: string;
  items?: OrderItem[];
} | null;

export function CheckoutScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pay, setPay] = useState<'cash' | 'card' | ''>('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  const state = location.state as CheckoutState;
  const items = state?.items ?? [];

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.trim().length >= 8;
  const isPayValid = !!pay;
  const hasItems = items.length > 0;

  const canSubmit = isNameValid && isPhoneValid && isPayValid && hasItems && !!user && !submitting;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const handleOpenConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFormError('You must be logged in to place an order.');
      return;
    }
    if (!hasItems) {
      setFormError('Your cart is empty. Please select an item from the menu.');
      return;
    }
    if (!isNameValid || !isPhoneValid || !isPayValid) {
      setFormError('Please fill all fields correctly.');
      return;
    }

    setFormError(null);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!canSubmit || !user) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const created = await createOrder({
        userId: user.id,
        items,
        status: 'new',
      });

      setConfirmOpen(false);
      setToast('Order submitted ✅');
      navigate(`/orders/${created.id}`, { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (e: any) {
      setFormError('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          ✕
        </IconButton>
        <Title>Checkout</Title>
        <span />
      </Header>

      <form className="container" onSubmit={handleOpenConfirm} noValidate>
        <H2>Contact</H2>
        <Field>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            autoComplete="name"
          />
        </Field>
        <Field>
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>

        <H2>Payment</H2>
        <Pills>
          <Pill $selected={pay === 'cash'} onClick={() => setPay('cash')}>
            Cash
          </Pill>
          <Pill $selected={pay === 'card'} onClick={() => setPay('card')}>
            Card
          </Pill>
        </Pills>

        <H2 style={{ marginTop: 16 }}>Order summary</H2>
        {hasItems ? (
          <Helper>
            Items: <b>{items.length}</b> • Payment: <b>{pay || '—'}</b>
          </Helper>
        ) : (
          <Helper>Your cart is empty. Go back to menu and pick something ☕</Helper>
        )}

        {formError && <Helper style={{ color: 'red', marginTop: 8 }}>{formError}</Helper>}

        <Spacer />
        <Button
          type="submit"
          disabled={!canSubmit}
          style={{ marginTop: 12, width: '100%' }} // замість full
        >
          Review & confirm
        </Button>
      </form>

      <SheetOverlay $open={confirmOpen} onClick={() => setConfirmOpen(false)} />
      <BottomSheet $open={confirmOpen} aria-hidden={!confirmOpen}>
        <SheetHandle />
        <SheetHeader>
          <SheetTitle>Confirm order</SheetTitle>
          <IconButton aria-label="close" onClick={() => setConfirmOpen(false)}>
            ✕
          </IconButton>
        </SheetHeader>
        <div style={{ padding: '0 2px 8px', fontSize: 14 }}>
          Name: <b>{name || '—'}</b>
          <br />
          Phone: <b>{phone || '—'}</b>
          <br />
          Payment: <b>{pay || '—'}</b>
          <br />
          Items: <b>{items.length}</b>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            style={{ flex: 1, opacity: 0.8 }}
            type="button"
          >
            Edit
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit || submitting}
            style={{ flex: 1 }}
            type="button"
          >
            {submitting ? 'Submitting...' : 'Confirm'}
          </Button>
        </div>
        <SafeBottom />
      </BottomSheet>

      {/* Toast */}
      <ToastBar $show={!!toast}>{toast}</ToastBar>

      <BottomTabs />
      <SafeBottom />
    </Screen>
  );
}
