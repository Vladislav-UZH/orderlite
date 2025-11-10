import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

type Role = 'customer' | 'admin';

type UserRecord = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
};

type PublicUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

type AuthResponse = {
  accessToken: string;
  user: PublicUser;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

type OrderStatus = 'new' | 'inProgress' | 'ready' | 'delivered';

type OrderItem = {
  menuItemId: number;
  quantity: number;
};

type Order = {
  id: number;
  userId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
};

type DbData = {
  users: UserRecord[];
  menuItems: MenuItem[];
  orders: Order[];
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type CreateOrderPayload = {
  userId: number;
  items: OrderItem[];
  status?: OrderStatus;
};

interface AuthRequest extends Request {
  userId?: number;
  userRole?: Role;
}

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, '..', 'db.json');
const sessions = new Map<string, number>();

app.use(cors());
app.use(express.json());

async function readDb(): Promise<DbData> {
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data) as DbData;
}

async function writeDb(db: DbData): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function createToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const token = header.slice(7);
  const userId = sessions.get(token);
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const db = await readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  req.userId = user.id;
  req.userRole = user.role;
  next();
}

app.post('/register', async (req: Request, res: Response) => {
  const payload = req.body as RegisterPayload;
  if (!payload.name || !payload.email || !payload.password) {
    res.status(400).json({ message: 'Missing fields' });
    return;
  }

  const db = await readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const nextId = db.users.length ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const role: Role = db.users.length === 0 ? 'admin' : 'customer';

  const newUser: UserRecord = {
    id: nextId,
    email: payload.email,
    name: payload.name,
    password: payload.password,
    role,
  };

  db.users.push(newUser);
  await writeDb(db);

  const accessToken = createToken();
  sessions.set(accessToken, newUser.id);

  const response: AuthResponse = {
    accessToken,
    user: toPublicUser(newUser),
  };

  res.status(201).json(response);
});

app.post('/login', async (req: Request, res: Response) => {
  const payload = req.body as LoginPayload;
  if (!payload.email || !payload.password) {
    res.status(400).json({ message: 'Missing email or password' });
    return;
  }

  const db = await readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (!user || user.password !== payload.password) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const accessToken = createToken();
  sessions.set(accessToken, user.id);

  const response: AuthResponse = {
    accessToken,
    user: toPublicUser(user),
  };

  res.json(response);
});

app.get('/menuItems', async (_req: Request, res: Response) => {
  const db = await readDb();
  res.json(db.menuItems);
});

app.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await readDb();
  if (!req.userId || !req.userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.userRole === 'admin') {
    res.json(db.orders);
    return;
  }

  const userOrders = db.orders.filter((o) => o.userId === req.userId);
  res.json(userOrders);
});

app.get('/orders/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await readDb();
  if (!req.userId || !req.userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    res.status(400).json({ message: 'Invalid order id' });
    return;
  }

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (req.userRole !== 'admin' && order.userId !== req.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  res.json(order);
});

app.post('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.userId || !req.userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const payload = req.body as CreateOrderPayload;
  if (!payload.userId || !Array.isArray(payload.items) || payload.items.length === 0) {
    res.status(400).json({ message: 'Invalid order payload' });
    return;
  }

  if (payload.userId !== req.userId && req.userRole !== 'admin') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const db = await readDb();
  const nextId = db.orders.length ? Math.max(...db.orders.map((o) => o.id)) + 1 : 1;

  const newOrder: Order = {
    id: nextId,
    userId: payload.userId,
    items: payload.items,
    status: payload.status ?? 'new',
    createdAt: new Date().toISOString(),
  };

  db.orders.push(newOrder);
  await writeDb(db);

  res.status(201).json(newOrder);
});

app.patch('/orders/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.userId || !req.userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.userRole !== 'admin') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    res.status(400).json({ message: 'Invalid order id' });
    return;
  }

  const body = req.body as { status?: OrderStatus };
  if (!body.status || !['new', 'inProgress', 'ready', 'delivered'].includes(body.status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  const db = await readDb();
  const index = db.orders.findIndex((o) => o.id === orderId);
  if (index === -1) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  db.orders[index] = { ...db.orders[index], status: body.status };
  await writeDb(db);

  res.json(db.orders[index]);
});

app.listen(PORT, () => {
  console.log(`OrderLite API running on http://localhost:${PORT}`);
});
