export type Tab = "home" | "search" | "cart" | "orders" | "profile" | "admin"

export type Role = "customer" | "owner"

export type AuthMode = "login" | "register" | "recover"

export type Language = "en" | "rw"

export type PaymentMethod = "momo" | "visa" | "mastercard"

export type Product = {
  id: number
  name: string
  rwName: string
  category: "Bags" | "Shoes" | "Beauty" | "Home" | string
  price: number
  oldPrice?: number
  rating: number
  image: string
  badge?: string
  description?: string
  stock?: number
}

export type OrderItem = {
  id: string
  customer: string
  date: string
  status: "Confirmed" | "Packed" | "On the way" | "Delivered" | "Processing"
  itemsCount: number
  total: number
  productName: string
  productImage: string
  stepIndex: number // 0: Confirmed, 1: Packed, 2: On the way, 3: Delivered
  estimatedArrival?: string
}

export type UserProfile = {
  name: string
  email: string
  initials: string
  phone: string
  address: string
}

export type User = {
  id?: number | string
  name: string
  email: string
  role: Role
  initials?: string
  phone?: string
  address?: string
}
