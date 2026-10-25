const { neon } = require("@neondatabase/serverless");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_sf5IuPqBYLn1@ep-proud-butterfly-b477ly7l-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function testConnection() {
  console.log("Connecting to Neon PostgreSQL...");
  const sql = neon(databaseUrl);

  try {
    const result = await sql`SELECT NOW() as current_time, version() as version;`;
    console.log("Neon Connected Successfully!");
    console.log("Current DB Time:", result[0].current_time);
    console.log("Postgres Version:", result[0].version.split(" on ")[0]);

    // Create tables for the app if they do not exist
    console.log("\nEnsuring tables exist for DGMobile...");
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rw_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL,
        old_price INTEGER,
        rating NUMERIC(2,1) DEFAULT 4.8,
        badge VARCHAR(50),
        image TEXT NOT NULL,
        description TEXT,
        stock INTEGER DEFAULT 10
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        delivery_address TEXT,
        status VARCHAR(50) DEFAULT 'Confirmed',
        total INTEGER NOT NULL,
        items_count INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log("Tables verified: products, orders, users.");

    // Check count of products
    const productCount = await sql`SELECT COUNT(*)::int as count FROM products;`;
    console.log(`Current product count: ${productCount[0].count}`);

    if (productCount[0].count === 0) {
      console.log("Seeding initial products into Neon...");
      await sql`
        INSERT INTO products (id, name, rw_name, category, price, old_price, rating, badge, image, description, stock)
        VALUES 
          (1, 'Everyday leather tote', 'Isakoshi y''uruhu', 'Bags', 48500, 59000, 4.8, 'Bestseller', 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85', 'A considered everyday essential crafted from supple full-grain leather, selected for lasting quality and effortless style across Kigali.', 14),
          (2, 'Cloud runner sneakers', 'Inkweto za siporo', 'Shoes', 72000, NULL, 4.9, 'New', 'https://images.unsplash.com/photo-1657287893089-c4b41bbe1f30?auto=format&fit=crop&w=900&q=85', 'Ultralight breathable knit upper with responsive cushioned sole designed for all-day comfort, walking, and training.', 5),
          (3, 'Glow ritual set', 'Ibikoresho by''uruhu', 'Beauty', 34500, NULL, 4.7, NULL, 'https://images.unsplash.com/photo-1685527645763-2cd1b47a2cd2?auto=format&fit=crop&w=900&q=85', 'A 3-step botanical hydration and radiance regimen featuring pure natural extracts that replenish and protect everyday skin.', 21),
          (4, 'Noir evening heels', 'Inkweto z''umukara', 'Shoes', 68000, 79000, 4.6, '-14%', 'https://images.unsplash.com/photo-1566958799193-c2aa57a835d4?auto=format&fit=crop&w=900&q=85', 'Sculptural silhouette heels with cushioned footbed and refined silhouette for formal gatherings and dinners.', 2),
          (5, 'Rose travel pouch', 'Agasakoshi gatoya', 'Bags', 26500, NULL, 4.5, NULL, 'https://images.unsplash.com/photo-1720609602393-207f35b618c1?auto=format&fit=crop&w=900&q=85', 'Compact structured vanity case with waterproof lining, brass zippers, and interior compartments for travel essentials.', 9),
          (6, 'Natural beauty edit', 'Ubwiza bwa kamere', 'Beauty', 41500, NULL, 4.8, NULL, 'https://images.unsplash.com/photo-1676570092589-a6c09ecbb373?auto=format&fit=crop&w=900&q=85', 'Antioxidant-rich body and hair care bundle infused with Rwandan cold-pressed oils, shea butter, and gentle floral essences.', 17)
        ON CONFLICT (id) DO NOTHING;
      `;
      console.log("Initial products seeded successfully!");
    }

    const fetchedProducts = await sql`SELECT id, name, category, price, stock FROM products ORDER BY id;`;
    console.log("\nProducts in Neon database:");
    console.table(fetchedProducts);

    console.log("\nAll Neon database tests PASSED!");
  } catch (err) {
    console.error("Neon connection failed:", err);
    process.exit(1);
  }
}

testConnection();
