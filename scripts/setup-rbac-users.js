const { neon } = require("@neondatabase/serverless");

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_sf5IuPqBYLn1@ep-proud-butterfly-b477ly7l-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function setupUsers() {
  const sql = neon(DATABASE_URL);
  console.log("Setting up RBAC users in Neon...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'customer',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`;

  // Seed standard store owner and customer
  await sql`
    INSERT INTO users (name, email, role, phone, address)
    VALUES 
      ('Diane Gasana', 'owner@dgmarket.rw', 'owner', '0788998877', 'Kigali HQ, Rwanda'),
      ('Diane Gasana', 'admin@dgmarket.rw', 'owner', '0788998877', 'Kigali HQ, Rwanda'),
      ('Aline Mukamana', 'aline.m@example.com', 'customer', '0788123456', 'KG 11 Ave, Gasabo')
    ON CONFLICT (email) DO UPDATE 
    SET role = EXCLUDED.role, name = EXCLUDED.name, phone = EXCLUDED.phone, address = EXCLUDED.address;
  `;

  const users = await sql`SELECT id, name, email, role, phone FROM users;`;
  console.log("Current RBAC users in Neon:");
  console.table(users);
}

setupUsers().catch(console.error);
