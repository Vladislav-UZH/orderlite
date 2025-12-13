import dotenv from 'dotenv';
import { connectMongo, MenuItemModel, nextSeq } from './models';
dotenv.config();

async function seed() {
  await connectMongo(process.env.MONGODB_URI!);

  const count = await MenuItemModel.countDocuments();
  if (count > 0) {
    console.log('Menu already seeded');
    process.exit(0);
  }

  const items = [
    { name: 'Espresso', description: '30ml', price: 45, category: 'coffee' },
    { name: 'Cappuccino', description: '250ml', price: 70, category: 'coffee' },
  ];

  for (const it of items) {
    const id = await nextSeq('menuItems');
    await MenuItemModel.create({ id, ...it });
  }

  console.log('Seed done');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
