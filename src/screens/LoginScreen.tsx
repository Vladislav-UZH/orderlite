import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { FiMenu as IconMenu } from 'react-icons/fi';

import {
  Screen,
  Header,
  IconButton,
  Title,
  Field,
  Label,
  Input,
  Helper,
  Button,
  SafeBottom,
  Text,
} from '../components/ui/ui-kit';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/menu';

  const isEmailValid = email.trim().length > 3 && email.includes('@');
  const isPassValid = pass.trim().length >= 6;
  const canSubmit = isEmailValid && isPassValid;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setLocalError('Please enter a valid email and password (min 6 chars).');
      return;
    }

    setLocalError(null);
    try {
      await login({ email, password: pass });
      navigate(from, { replace: true });
    } catch {
      //
    }
  };

  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconMenu />
        </IconButton>
        <Title>OrderLite</Title>
        <span />
      </Header>

      <form className="container" onSubmit={handleSubmit} noValidate>
        <h2 style={{ textAlign: 'center', margin: '10px 0 16px' }}>Welcome back</h2>

        <Field>
          <Label>Email</Label>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />
          <Helper>Forgot password?</Helper>
        </Field>

        {(localError || error) && (
          <Text style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{localError || error}</Text>
        )}

        <Button full={true} style={{ marginTop: 8 }} type="submit" disabled={!canSubmit || loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>

        <Helper style={{ marginTop: 10 }}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </Helper>
      </form>

      <SafeBottom />
    </Screen>
  );
}
