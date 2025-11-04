import { useState } from 'react';

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
} from '../components/ui/ui-kit';
import {} from 'react-icons/bs';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  return (
    <Screen>
      <Header>
        <IconButton aria-label="menu">
          <IconMenu />
        </IconButton>
        <Title>OrderLite</Title>
        <span />
      </Header>

      <div className="container">
        <h2 style={{ textAlign: 'center', margin: '10px 0 16px' }}>Welcome back</h2>

        <Field>
          <Label>Email</Label>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <Helper>
            <a href="#">Forgot password?</a>
          </Helper>
        </Field>

        <Button full style={{ marginTop: 8 }}>
          Log in
        </Button>
      </div>

      <SafeBottom />
    </Screen>
  );
}
