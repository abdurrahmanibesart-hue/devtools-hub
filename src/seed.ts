import 'reflect-metadata';
import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AdminDoc, AdminSchema } from './auth/schemas/admin.schema';

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('missing SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD');
    process.exit(1);
  }

  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/devtools';
  await mongoose.connect(uri);

  const Admin = mongoose.model(AdminDoc.name, AdminSchema);

  const count = await Admin.countDocuments();
  if (count > 0) {
    console.log('Admin already exists. Skipping seed.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash });

  console.log(`Admin created: ${email}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
