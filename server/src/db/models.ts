import mongoose, { Schema, model } from 'mongoose';

export type Role = 'customer' | 'admin';
export type OrderStatus = 'new' | 'inProgress' | 'ready' | 'delivered';

export type UserRecord = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

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

const UserSchema = new Schema<UserRecord>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 60 },
  },
  { versionKey: false },
);

const MenuItemSchema = new Schema<MenuItem>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { versionKey: false },
);

const OrderItemSchema = new Schema<OrderItem>(
  {
    menuItemId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const OrderSchema = new Schema<Order>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    userId: { type: Number, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, enum: ['new', 'inProgress', 'ready', 'delivered'], required: true },
    createdAt: { type: String, required: true },
  },
  { versionKey: false },
);

export const UserModel = model<UserRecord>('User', UserSchema);
export const MenuItemModel = model<MenuItem>('MenuItem', MenuItemSchema);
export const OrderModel = model<Order>('Order', OrderSchema);

const CounterSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { versionKey: false },
);

export const CounterModel = model('Counter', CounterSchema);

export async function nextSeq(name: string): Promise<number> {
  const doc = await CounterModel.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  ).lean();
  return doc!.seq;
}

export async function connectMongo(uri: string) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}
