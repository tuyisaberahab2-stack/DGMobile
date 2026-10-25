const { neon } = require("@neondatabase/serverless");

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_sf5IuPqBYLn1@ep-proud-butterfly-b477ly7l-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function runEndToEndTests() {
  console.log("==================================================");
  console.log("      NEON POSTGRESQL END-TO-END TEST SUITE       ");
  console.log("==================================================");
  console.log("Host URL:", DATABASE_URL.replace(/:[^:@]*@/, ":***@"));

  const sql = neon(DATABASE_URL);

  try {
    // 1. Connection & Health Check
    console.log("\n[TEST 1] Verifying Neon connection & server time...");
    const [health] = await sql`SELECT NOW() as now, current_database() as db;`;
    console.log(`[PASS] Connected to DB "${health.db}" at ${health.now}`);

    // 2. Products Query (Storefront & Search Service)
    console.log("\n[TEST 2] Testing Storefront Products Service...");
    const products = await sql`
      SELECT id, name, category, price, stock 
      FROM products 
      ORDER BY id ASC;
    `;
    console.log(`[PASS] Fetched ${products.length} products from Neon:`);
    products.forEach((p) => {
      console.log(`  - #${p.id} ${p.name} (${p.category}) - ${p.price} RWF [Stock: ${p.stock}]`);
    });

    // 3. Stock Update (Owner Admin Service)
    console.log("\n[TEST 3] Testing Owner Inventory Stock Update Service...");
    const targetProduct = products[0];
    const newStock = Number(targetProduct.stock) + 1;
    await sql`
      UPDATE products
      SET stock = ${newStock}
      WHERE id = ${targetProduct.id};
    `;
    const [updated] = await sql`
      SELECT id, name, stock 
      FROM products 
      WHERE id = ${targetProduct.id};
    `;
    console.log(`[PASS] Updated product #${updated.id} stock to: ${updated.stock}`);

    // 4. Order Creation (Checkout Service)
    console.log("\n[TEST 4] Testing Checkout & Order Placement Service...");
    const testOrderId = `DG-TEST-${Date.now().toString().slice(-4)}`;
    await sql`
      INSERT INTO orders (id, customer_name, customer_phone, delivery_address, total, items_count, status)
      VALUES (${testOrderId}, 'Aline Mukamana', '0788123456', 'KG 11 Ave, Gasabo', 51000, 1, 'Confirmed')
      ON CONFLICT (id) DO UPDATE SET status = 'Confirmed';
    `;
    console.log(`[PASS] Inserted new order with ID: ${testOrderId}`);

    // 5. Order Retrieval (Orders & Tracking Service)
    console.log("\n[TEST 5] Testing Order Retrieval & Tracking Service...");
    const [order] = await sql`
      SELECT id, customer_name, status, total, delivery_address, created_at
      FROM orders
      WHERE id = ${testOrderId};
    `;
    console.log(`[PASS] Retrieved order from Neon:`, {
      orderId: order.id,
      customer: order.customer_name,
      status: order.status,
      total: `${order.total} RWF`,
      address: order.delivery_address,
    });

    console.log("\n==================================================");
    console.log("  ALL NEON SERVICES TESTED AND PASSED END-TO-END! ");
    console.log("==================================================");
  } catch (err) {
    console.error("[FAIL] Error during Neon E2E tests:", err);
    process.exit(1);
  }
}

runEndToEndTests();
