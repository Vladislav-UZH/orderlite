import { useState, type ChangeEvent } from 'react';
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

export function RegisterScreen() {
  const [form, setForm] = useState({ name: '', email: '', pass: '', pass2: '' });
  const canSubmit = form.name && form.email && form.pass && form.pass2 && form.pass === form.pass2;

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <Screen>
      <Header>
        <IconButton aria-label="back">
          <IconBack />
        </IconButton>
        <Title>Register</Title>
        <span />
      </Header>

      <div className="container">
        <Field>
          <Label>Name</Label>
          <Input placeholder="Name" value={form.name} onChange={set('name')} />
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
          <Input placeholder="Password" type="password" value={form.pass} onChange={set('pass')} />
        </Field>
        <Field>
          <Label>Repeat password</Label>
          <Input
            placeholder="Repeat password"
            type="password"
            value={form.pass2}
            onChange={set('pass2')}
          />
          {form.pass2 && form.pass !== form.pass2 && <Helper>Password mismatch</Helper>}
        </Field>

        <Button full disabled={!canSubmit} style={{ marginTop: 8 }}>
          Register
        </Button>
      </div>

      <SafeBottom />
      <Spacer />
    </Screen>
  );
}
