import { neon } from "@neondatabase/serverless"
import { Product, OrderItem, User, Role } from "../types"
import { PRODUCTS, INITIAL_ORDERS } from "../data/mockData"

declare const process: any

// Neon connection string
const DATABASE_URL =
  (typeof process !== "undefined" && process?.env?.DATABASE_URL) ||
  "postgresql://neondb_owner:npg_sf5IuPqBYLn1@ep-proud-butterfly-b477ly7l-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

// Initialize serverless SQL client (works over HTTP/fetch)
export const sql = neon(DATABASE_URL)

/**
 * Fetch all products from Neon database with local fallback
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT id, name, rw_name, category, price, old_price, rating, badge, image, description, stock
      FROM products
      ORDER BY id ASC;
    `
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: Number(r.id),
        name: r.name,
        rwName: r.rw_name,
        category: r.category,
        price: Number(r.price),
        oldPrice: r.old_price ? Number(r.old_price) : undefined,
        rating: Number(r.rating || 4.8),
        badge: r.badge || undefined,
        image: r.image,
        description: r.description || undefined,
        stock: r.stock !== undefined ? Number(r.stock) : 10,
      }))
    }
    return PRODUCTS
  } catch (error) {
    console.warn("Neon getProducts offline or error, using local fallback:", error)
    return PRODUCTS
  }
}

/**
 * Update stock in Neon database
 */
export async function updateProductStock(
  productId: number,
  newStock: number,
): Promise<boolean> {
  try {
    await sql`
      UPDATE products
      SET stock = ${newStock}
      WHERE id = ${productId};
    `
    return true
  } catch (error) {
    console.warn("Neon updateProductStock error:", error)
    return false
  }
}

/**
 * Create a new product in Neon database (Store Owner CRUD)
 */
export async function createProduct(product: {
  name: string
  rwName?: string
  category: string
  price: number
  oldPrice?: number
  badge?: string
  image: string
  description?: string
  stock?: number
}): Promise<Product | null> {
  try {
    const stockVal = product.stock !== undefined ? product.stock : 10
    const rows = await sql`
      INSERT INTO products (name, rw_name, category, price, old_price, rating, badge, image, description, stock)
      VALUES (
        ${product.name},
        ${product.rwName || product.name},
        ${product.category},
        ${product.price},
        ${product.oldPrice || null},
        4.9,
        ${product.badge || null},
        ${product.image},
        ${product.description || null},
        ${stockVal}
      )
      RETURNING id, name, rw_name, category, price, old_price, rating, badge, image, description, stock;
    `
    if (rows && rows.length > 0) {
      const r = rows[0]
      return {
        id: Number(r.id),
        name: r.name,
        rwName: r.rw_name,
        category: r.category,
        price: Number(r.price),
        oldPrice: r.old_price ? Number(r.old_price) : undefined,
        rating: Number(r.rating || 4.9),
        badge: r.badge || undefined,
        image: r.image,
        description: r.description || undefined,
        stock: Number(r.stock ?? 10),
      }
    }
  } catch (error) {
    console.warn("Neon createProduct error:", error)
  }
  return null
}

/**
 * Update product details in Neon database (Store Owner CRUD)
 */
export async function updateProduct(product: Product): Promise<boolean> {
  try {
    const stockVal = product.stock !== undefined ? product.stock : 10
    await sql`
      UPDATE products
      SET name = ${product.name},
          rw_name = ${product.rwName || product.name},
          category = ${product.category},
          price = ${product.price},
          old_price = ${product.oldPrice || null},
          badge = ${product.badge || null},
          image = ${product.image},
          description = ${product.description || null},
          stock = ${stockVal}
      WHERE id = ${product.id};
    `
    return true
  } catch (error) {
    console.warn("Neon updateProduct error:", error)
    return false
  }
}

/**
 * Delete product from Neon database (Store Owner CRUD)
 */
export async function deleteProduct(productId: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM products
      WHERE id = ${productId};
    `
    return true
  } catch (error) {
    console.warn("Neon deleteProduct error:", error)
    return false
  }
}

/**
 * Save new order in Neon database
 */
export async function saveOrder(order: {
  id: string
  customerName: string
  customerPhone?: string
  deliveryAddress?: string
  total: number
  itemsCount: number
}): Promise<boolean> {
  try {
    await sql`
      INSERT INTO orders (id, customer_name, customer_phone, delivery_address, total, items_count, status)
      VALUES (${order.id}, ${order.customerName}, ${order.customerPhone || null}, ${order.deliveryAddress || null}, ${order.total}, ${order.itemsCount}, 'Confirmed')
      ON CONFLICT (id) DO UPDATE
      SET status = EXCLUDED.status;
    `
    return true
  } catch (error) {
    console.warn("Neon saveOrder error:", error)
    return false
  }
}

/**
 * Fetch orders from Neon database
 */
export async function getOrders(): Promise<OrderItem[]> {
  try {
    const rows = await sql`
      SELECT id, customer_name, customer_phone, delivery_address, status, total, items_count, created_at
      FROM orders
      ORDER BY created_at DESC;
    `
    if (rows && rows.length > 0) {
      return rows.map((r: any, idx: number) => ({
        id: r.id,
        customer: r.customer_name,
        date: new Date(r.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: r.status as any,
        itemsCount: Number(r.items_count),
        total: Number(r.total),
        productName: "Everyday leather tote",
        productImage:
          "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85",
        stepIndex: r.status === "Delivered" ? 3 : r.status === "On the way" ? 2 : 1,
      }))
    }
    return INITIAL_ORDERS
  } catch (error) {
    console.warn("Neon getOrders error, using local fallback:", error)
    return INITIAL_ORDERS
  }
}

/**
 * Look up order by Purchase ID from Neon database (for guest or customer tracking)
 */
export async function getOrderByPurchaseId(
  purchaseId: string,
): Promise<OrderItem | null> {
  try {
    const cleanId = purchaseId.trim()
    const rows = await sql`
      SELECT id, customer_name, customer_phone, delivery_address, status, total, items_count, created_at
      FROM orders
      WHERE LOWER(id) = LOWER(${cleanId})
      LIMIT 1;
    `
    if (rows && rows.length > 0) {
      const r = rows[0]
      return {
        id: r.id,
        customer: r.customer_name,
        date: new Date(r.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: (r.status || "Confirmed") as any,
        itemsCount: Number(r.items_count || 1),
        total: Number(r.total || 0),
        productName: "Order items · Rwanda delivery",
        productImage:
          "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85",
        stepIndex:
          r.status === "Delivered"
            ? 3
            : r.status === "On the way"
            ? 2
            : r.status === "Packed"
            ? 1
            : 0,
        estimatedArrival: "Within 2–3 business days",
      }
    }
  } catch (error) {
    console.warn("Neon getOrderByPurchaseId error:", error)
  }
  return null
}

/**
 * Helper to compute initials from a name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

/**
 * Authenticate or look up user from Neon database (RBAC)
 */
export async function signInUser(email: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase()
  try {
    const rows = await sql`
      SELECT id, name, email, role, phone, address
      FROM users
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1;
    `
    if (rows && rows.length > 0) {
      const u = rows[0]
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: (u.role === "owner" ? "owner" : "customer") as Role,
        initials: getInitials(u.name),
        phone: u.phone || undefined,
        address: u.address || undefined,
      }
    }
  } catch (error) {
    console.warn("Neon signInUser error, using RBAC fallback:", error)
  }

  // Fallback / Auto-provision rule
  const isOwner =
    cleanEmail.includes("owner") ||
    cleanEmail.includes("admin") ||
    cleanEmail.endsWith("@dgmarket.rw")

  const role: Role = isOwner ? "owner" : "customer"
  const name = isOwner ? "Diane Gasana" : "Aline Mukamana"

  try {
    await sql`
      INSERT INTO users (name, email, role)
      VALUES (${name}, ${cleanEmail}, ${role})
      ON CONFLICT (email) DO NOTHING;
    `
  } catch (_) {}

  return {
    name,
    email: cleanEmail,
    role,
    initials: getInitials(name),
  }
}

/**
 * Register new user into Neon database (RBAC)
 */
export async function registerUser(name: string, email: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase()
  const cleanName = name.trim()
  const isOwner =
    cleanEmail.includes("owner") ||
    cleanEmail.includes("admin") ||
    cleanEmail.endsWith("@dgmarket.rw")
  const role: Role = isOwner ? "owner" : "customer"

  try {
    const rows = await sql`
      INSERT INTO users (name, email, role)
      VALUES (${cleanName}, ${cleanEmail}, ${role})
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name
      RETURNING id, name, email, role, phone, address;
    `
    if (rows && rows.length > 0) {
      const u = rows[0]
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as Role,
        initials: getInitials(u.name),
        phone: u.phone || undefined,
        address: u.address || undefined,
      }
    }
  } catch (error) {
    console.warn("Neon registerUser error:", error)
  }

  return {
    name: cleanName,
    email: cleanEmail,
    role,
    initials: getInitials(cleanName),
  }
}
