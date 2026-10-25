import { Product, OrderItem } from "../types"

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Everyday leather tote",
    rwName: "Isakoshi y'uruhu",
    category: "Bags",
    price: 48500,
    oldPrice: 59000,
    rating: 4.8,
    badge: "Bestseller",
    description:
      "A considered everyday essential crafted from supple full-grain leather, selected for lasting quality and effortless style across Kigali.",
    image:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Cloud runner sneakers",
    rwName: "Inkweto za siporo",
    category: "Shoes",
    price: 72000,
    rating: 4.9,
    badge: "New",
    description:
      "Ultralight breathable knit upper with responsive cushioned sole designed for all-day comfort, walking, and training.",
    image:
      "https://images.unsplash.com/photo-1657287893089-c4b41bbe1f30?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Glow ritual set",
    rwName: "Ibikoresho by'uruhu",
    category: "Beauty",
    price: 34500,
    rating: 4.7,
    description:
      "A 3-step botanical hydration and radiance regimen featuring pure natural extracts that replenish and protect everyday skin.",
    image:
      "https://images.unsplash.com/photo-1685527645763-2cd1b47a2cd2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Noir evening heels",
    rwName: "Inkweto z'umukara",
    category: "Shoes",
    price: 68000,
    oldPrice: 79000,
    rating: 4.6,
    badge: "-14%",
    description:
      "Sculptural silhouette heels with cushioned footbed and refined silhouette for formal gatherings and dinners.",
    image:
      "https://images.unsplash.com/photo-1566958799193-c2aa57a835d4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Rose travel pouch",
    rwName: "Agasakoshi gatoya",
    category: "Bags",
    price: 26500,
    rating: 4.5,
    description:
      "Compact structured vanity case with waterproof lining, brass zippers, and interior compartments for travel essentials.",
    image:
      "https://images.unsplash.com/photo-1720609602393-207f35b618c1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Natural beauty edit",
    rwName: "Ubwiza bwa kamere",
    category: "Beauty",
    price: 41500,
    rating: 4.8,
    description:
      "Antioxidant-rich body and hair care bundle infused with Rwandan cold-pressed oils, shea butter, and gentle floral essences.",
    image:
      "https://images.unsplash.com/photo-1676570092589-a6c09ecbb373?auto=format&fit=crop&w=900&q=85",
  },
]

export const CATEGORIES = ["All", "Bags", "Shoes", "Beauty", "Home"] as const

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "DG-2084",
    customer: "Aline Mukamana",
    date: "23 Oct 2026",
    status: "On the way",
    itemsCount: 1,
    total: 51000,
    productName: "Everyday leather tote",
    productImage:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85",
    stepIndex: 2,
    estimatedArrival: "Thursday, 24 October",
  },
  {
    id: "DG-2083",
    customer: "Eric Niyonzima",
    date: "22 Oct 2026",
    status: "Processing",
    itemsCount: 1,
    total: 72000,
    productName: "Cloud runner sneakers",
    productImage:
      "https://images.unsplash.com/photo-1657287893089-c4b41bbe1f30?auto=format&fit=crop&w=900&q=85",
    stepIndex: 1,
  },
  {
    id: "DG-2082",
    customer: "Mutesi Alice",
    date: "19 Oct 2026",
    status: "Delivered",
    itemsCount: 3,
    total: 109500,
    productName: "Glow ritual set",
    productImage:
      "https://images.unsplash.com/photo-1685527645763-2cd1b47a2cd2?auto=format&fit=crop&w=900&q=85",
    stepIndex: 3,
  },
  {
    id: "DG-2081",
    customer: "Uwase Diane",
    date: "15 Oct 2026",
    status: "Confirmed",
    itemsCount: 1,
    total: 34500,
    productName: "Rose travel pouch",
    productImage:
      "https://images.unsplash.com/photo-1720609602393-207f35b618c1?auto=format&fit=crop&w=900&q=85",
    stepIndex: 0,
  },
]

export const PAST_ORDERS = [
  {
    id: "DG-1942",
    date: "12 Sep 2025",
    status: "Delivered",
    total: 106500,
  },
  {
    id: "DG-1880",
    date: "28 Jul 2025",
    status: "Delivered",
    total: 48500,
  },
]

export const money = (value: number): string => {
  try {
    return `${new Intl.NumberFormat("en-RW").format(value)} RWF`
  } catch {
    return `${value.toLocaleString()} RWF`
  }
}

export const copy = {
  en: {
    greeting: "Good morning, Aline",
    guestGreeting: "Welcome to D&G Market",
    discover: "Discover something\nmade for you.",
    heroKicker: "NEW SEASON 01",
    heroTitle: "Fresh finds,\nbeautifully chosen.",
    heroBody: "Curated essentials for every day, delivered across Rwanda.",
    shopNow: "Shop collection",
    shopByCategory: "Shop by category",
    popular: "Popular right now",
    seeAll: "See all",
    search: "Search products",
    cart: "Your bag",
    orders: "My orders",
    profile: "My account",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    checkout: "Secure checkout",
    orderDG: "Order DG-2084",
    thankYou: "Thank you, Aline!",
    confirmedNotice: "Your order is confirmed and will arrive in 2–3 business days.",
    trackOrder: "Track my order",
    emptyBag: "Your bag is waiting",
    emptyBagSub: "Browse our latest edit and add something you love.",
    startShopping: "Start shopping",
    purchases: "Purchases & delivery",
    onTheWay: "On the way",
    pastOrders: "Past orders",
    welcomeBack: "Welcome back",
    signOut: "Sign out",
    savedItems: "Saved items",
    deliveryAddresses: "Delivery addresses",
    paymentMethods: "Payment methods",
    languageLabel: "Language",
    exploreTitle: "Explore the edit",
    findFavorite: "Find your new favorite",
    noProducts: "No products found",
    noProductsSub: "Try another keyword or change your filter category.",
  },
  rw: {
    greeting: "Mwaramutse, Aline",
    guestGreeting: "Murakaza neza kuri D&G Market",
    discover: "Hitamo ikikubereye\nuyu munsi.",
    heroKicker: "IBIGEZWEHO 01",
    heroTitle: "Ibishya,\nbyatoranyijwe neza.",
    heroBody: "Ibikoresho byiza bya buri munsi, tubigeza hose mu Rwanda.",
    shopNow: "Reba ibicuruzwa",
    shopByCategory: "Hitamo icyiciro",
    popular: "Bikunzwe ubu",
    seeAll: "Reba byose",
    search: "Shakisha ibicuruzwa",
    cart: "Igikapu cyawe",
    orders: "Komande zanjye",
    profile: "Konti yanjye",
    subtotal: "Igiteranyo cy'ibicuruzwa",
    delivery: "Kugeza",
    total: "Igiteranyo cyose",
    checkout: "Kwishura mu mutekano",
    orderDG: "Komande DG-2084",
    thankYou: "Urakoze cyane, Aline!",
    confirmedNotice: "Komande yawe yakiriwe neza kandi izakugeraho mu minsi 2–3 y'akazi.",
    trackOrder: "Gukurikirana komande",
    emptyBag: "Igikapu cyawe kiracyarimo ubusa",
    emptyBagSub: "Reba ibicuruzwa byacu bishya wihitiremo ibikunogeye.",
    startShopping: "Tangira guhaha",
    purchases: "Ibyaguzwe & n'aho bigeze",
    onTheWay: "Biri mu nzira bikugana",
    pastOrders: "Komande zashize",
    welcomeBack: "Murakaza neza",
    signOut: "Gusohoka",
    savedItems: "Ibyo wakunze",
    deliveryAddresses: "Aderesi zo kugezwaho",
    paymentMethods: "Uburyo bwo kwishyura",
    languageLabel: "Ururimi",
    exploreTitle: "Shakisha ibicuruzwa",
    findFavorite: "Hitamo icyo ukunda",
    noProducts: "Nta gicuruzwa cyabonetse",
    noProductsSub: "Gerageza andi magambo cyangwa uhindure icyiciro.",
  },
} as const
