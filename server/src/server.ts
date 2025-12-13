import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';

import {
  connectMongo,
  UserModel,
  MenuItemModel,
  OrderModel,
  nextSeq,
  type Role,
  type UserRecord,
  type OrderStatus,
} from './db/models';

dotenv.config();

const BCRYPT_ROUNDS = 10;

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

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type OrderItem = { menuItemId: number; quantity: number };

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
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orderlite';

const sessions = new Map<string, number>();

app.use(cors());
app.use(express.json());

function toPublicUser(user: UserRecord): PublicUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
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

  const user = await UserModel.findOne({ id: userId }).lean();
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

  const email = payload.email.toLowerCase();
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const isFirstUser = (await UserModel.countDocuments()) === 0;
  const role: Role = isFirstUser ? 'admin' : 'customer';

  const id = await nextSeq('users');

  const passwordHash = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);

  const newUser: UserRecord = {
    id,
    email,
    name: payload.name,
    password: passwordHash,
    role,
  };

  await UserModel.create(newUser);

  const accessToken = createToken();
  sessions.set(accessToken, newUser.id);

  const response: AuthResponse = { accessToken, user: toPublicUser(newUser) };
  res.status(201).json(response);
});

app.post('/login', async (req: Request, res: Response) => {
  const payload = req.body as LoginPayload;
  if (!payload.email || !payload.password) {
    res.status(400).json({ message: 'Missing email or password' });
    return;
  }

  const email = payload.email.toLowerCase();
  const user = await UserModel.findOne({ email }).lean();
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const accessToken = createToken();
  sessions.set(accessToken, user.id);

  const response: AuthResponse = { accessToken, user: toPublicUser(user) };
  res.json(response);
});

app.get('/menuItems', async (_req: Request, res: Response) => {
  const items = await MenuItemModel.find().sort({ id: 1 }).lean();
  res.json(items);
});

app.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.userId || !req.userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.userRole === 'admin') {
    const orders = await OrderModel.find().sort({ id: -1 }).lean();
    res.json(orders);
    return;
  }

  const userOrders = await OrderModel.find({ userId: req.userId }).sort({ id: -1 }).lean();
  res.json(userOrders);
});

app.get('/orders/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.userId || !req.userRole) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) {
    res.status(400).json({ message: 'Invalid order id' });
    return;
  }

  const order = await OrderModel.findOne({ id: orderId }).lean();
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

  const id = await nextSeq('orders');

  const newOrder = {
    id,
    userId: payload.userId,
    items: payload.items,
    status: payload.status ?? 'new',
    createdAt: new Date().toISOString(),
  };

  await OrderModel.create(newOrder);

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

  const updated = await OrderModel.findOneAndUpdate(
    { id: orderId },
    { $set: { status: body.status } },
    { new: true },
  ).lean();

  if (!updated) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  res.json(updated);
});


const clientDist = path.resolve(process.cwd(), 'dist');

app.use(express.static(clientDist));

app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});


async function bootstrap() {
  await connectMongo(MONGODB_URI);
  console.log('Mongo connected');

  app.listen(PORT, () => {
    console.log(`OrderLite API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
