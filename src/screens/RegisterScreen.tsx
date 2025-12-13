import { type FormEvent, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import {
  IconBack,
  Screen,
  Header,
  Title,
  Label,
  Field,
  Input,
  IconButton,
  Button,
  SafeBottom,
  Spacer,
  Helper,
} from '../components/ui/ui-kit';
import { useAuth } from '../hooks/useAuth';

export function RegisterScreen() {
  const [form, setForm] = useState({ name: '', email: '', pass: '', pass2: '' });
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const isNameValid = form.name.trim().length >= 2;
  const isEmailValid = form.email.trim().length > 3 && form.email.includes('@');
  const isPassValid = form.pass.trim().length >= 6;
  const isPassMatch = form.pass && form.pass === form.pass2;

  const canSubmit = isNameValid && isEmailValid && isPassValid && isPassMatch;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setLocalError('Check name, email and passwords (min 6 chars, must match).');
      return;
    }

    setLocalError(null);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.pass,
      });
      navigate('/menu', { replace: true });
    } catch {
      //
    }
  };

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <IconBack />
        </IconButton>
        <Title>Register</Title>
        <span />
      </Header>

      <form className="container" onSubmit={handleSubmit} noValidate>
        <Field>
          <Label>Name</Label>
          <Input placeholder="Name" value={form.name} onChange={set('name')} autoComplete="name" />
        </Field>

        <Field>
          <Label>Email</Label>
          <Input
            placeholder="Email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
          />
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            value={form.pass}
            onChange={set('pass')}
          />
        </Field>

        <Field>
          <Label>Repeat password</Label>
          <Input
            placeholder="Repeat password"
            type="password"
            autoComplete="new-password"
            value={form.pass2}
            onChange={set('pass2')}
          />
          {form.pass2 && !isPassMatch && <Helper>Password mismatch</Helper>}
        </Field>

        {(localError || error) && (
          <Helper style={{ color: 'red', marginTop: 4 }}>{localError || error}</Helper>
        )}

        <Button full={true} disabled={!canSubmit || loading} style={{ marginTop: 8 }} type="submit">
          {loading ? 'Creating account...' : 'Register'}
        </Button>

        <Helper style={{ marginTop: 10 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Helper>
      </form>

      <SafeBottom />
      <Spacer />
    </Screen>
  );
}
