import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const SEED_USERS = [
  { name: 'John Doe', email: 'victor@asvesy.com', password: 'password', role: 'admin' },
  { name: 'Lucy Doe', email: 'lucydoe@gmail.com', password: 'password', role: 'user'  },
] as const;

async function main() {
  for (const u of SEED_USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    const { error } = await supabase.from('users').upsert(
      { name: u.name, email: u.email, password: hashed, role: u.role },
      { onConflict: 'email', ignoreDuplicates: true },
    );
    if (error) console.error(`Failed to seed ${u.email}:`, error.message);
    else console.log(`Seeded: ${u.email}`);
  }
}

main();
