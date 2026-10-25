import React, { useState, useEffect } from "react"
import { StatusBar, StyleSheet, View } from "react-native"
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context"
import { Tab, Role, Language, Product, OrderItem, User, AuthMode } from "./src/types"
import { colors } from "./src/theme/colors"
import { PRODUCTS, INITIAL_ORDERS } from "./src/data/mockData"
import { getProducts, saveOrder, signInUser, registerUser } from "./src/services/neon"
import { Header } from "./src/components/Header"
import { BottomNav } from "./src/components/BottomNav"
import { ProductModal } from "./src/components/ProductModal"
import { AuthModal } from "./src/components/AuthModal"
import { CheckoutModal } from "./src/components/CheckoutModal"
import { HomeScreen } from "./src/screens/HomeScreen"
import { SearchScreen } from "./src/screens/SearchScreen"
import { CartScreen } from "./src/screens/CartScreen"
import { OrdersScreen } from "./src/screens/OrdersScreen"
import { ProfileScreen } from "./src/screens/ProfileScreen"
import { AdminScreen } from "./src/screens/AdminScreen"
import { SplashScreen } from "./src/components/SplashScreen"

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>("customer")
  const [tab, setTab] = useState<Tab>("home")
  const [language, setLanguage] = useState<Language>("en")

  const [category, setCategory] = useState("All")
  const [query, setQuery] = useState("")

  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [cart, setCart] = useState<Record<number, number>>({ 1: 1 })
  const [favorites, setFavorites] = useState<number[]>([2])
  const [activeOrder, setActiveOrder] = useState<OrderItem>(INITIAL_ORDERS[0])

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkedOut, setCheckedOut] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(true)

  // Fetch live products from Neon database on mount & show splash logo
  useEffect(() => {
    let isMounted = true
    const startTime = Date.now()

    getProducts()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setProducts(data)
        }
      })
      .finally(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, 1800 - elapsed)
        setTimeout(() => {
          if (isMounted) {
            setIsAppLoading(false)
          }
        }, remaining)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Derived state
  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0)
  const subtotal = products.filter((p) => (cart[p.id] || 0) > 0).reduce(
    (sum, item) => sum + item.price * (cart[item.id] || 0),
    0,
  )

  const handleAddToCart = (productId: number) => {
    setCart((curr) => ({
      ...curr,
      [productId]: (curr[productId] || 0) + 1,
    }))
    setSelectedProduct(null)
  }

  const handleUpdateQuantity = (productId: number, change: number) => {
    setCart((curr) => {
      const next = (curr[productId] || 0) + change
      if (next <= 0) {
        const copyCart = { ...curr }
        delete copyCart[productId]
        return copyCart
      }
      return { ...curr, [productId]: next }
    })
  }

  const handleToggleFavorite = (productId: number) => {
    setFavorites((curr) =>
      curr.includes(productId)
        ? curr.filter((id) => id !== productId)
        : [...curr, productId],
    )
  }

  const handleToggleLanguage = () => {
    setLanguage((curr) => (curr === "en" ? "rw" : "en"))
  }

  const handleStartCheckout = () => {
    if (!authenticated) {
      setPendingCheckout(true)
      setAuthModalOpen(true)
    } else {
      setCheckoutOpen(true)
    }
  }

  // Unified RBAC Authentication
  const handleAuthenticate = async ({
    email,
    password,
    name,
    mode,
  }: {
    email: string
    password?: string
    name?: string
    mode: AuthMode
  }) => {
    let user: User
    if (mode === "register" && name) {
      user = await registerUser(name, email)
    } else {
      user = await signInUser(email)
    }

    setCurrentUser(user)
    setAuthenticated(true)
    setRole(user.role)
    setAuthModalOpen(false)

    // RBAC: Direct owner straight to the admin dashboard!
    if (user.role === "owner") {
      setTab("admin")
    } else {
      if (pendingCheckout) {
        setPendingCheckout(false)
        setCheckoutOpen(true)
      } else {
        setTab("home")
      }
    }
  }

  const handleSignOut = () => {
    setAuthenticated(false)
    setCurrentUser(null)
    setRole("customer")
    setCheckedOut(false)
    setTab("home")
  }

  const handleCheckoutSuccess = (orderId: string) => {
    const customerName = currentUser?.name || "Aline Mukamana"
    const customerPhone = currentUser?.phone || "0788123456"
    const deliveryAddress = currentUser?.address || "KG 11 Ave, Gasabo"

    saveOrder({
      id: orderId,
      customerName,
      customerPhone,
      deliveryAddress,
      total: subtotal + 2500,
      itemsCount: cartCount,
    })
    setCart({})
    setCheckedOut(true)
    setActiveOrder((prev) => ({
      ...prev,
      id: orderId,
      customer: customerName,
      status: "On the way",
      stepIndex: 2,
    }))
    setTab("orders")
  }

  const handleNavigateSearch = (cat?: string) => {
    if (cat) {
      setCategory(cat)
    }
    setTab("search")
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          {/* Universal Header with RBAC navigation */}
          <Header
            authenticated={authenticated}
            role={role}
            user={currentUser}
            language={language}
            cartCount={cartCount}
            onToggleLanguage={handleToggleLanguage}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenCart={() => setTab("cart")}
            onGoHome={() => setTab(role === "owner" ? "admin" : "home")}
            onGoToProfile={() => setTab("profile")}
            onGoToAdmin={() => setTab("admin")}
          />

          {/* Active Screen Body */}
          <View style={styles.screenContainer}>
            {tab === "home" && (
              <HomeScreen
                products={products}
                language={language}
                authenticated={authenticated}
                user={currentUser}
                favorites={favorites}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                onNavigateSearch={handleNavigateSearch}
              />
            )}

            {tab === "search" && (
              <SearchScreen
                products={products}
                language={language}
                query={query}
                category={category}
                favorites={favorites}
                onQueryChange={setQuery}
                onCategoryChange={setCategory}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {tab === "cart" && (
              <CartScreen
                cart={cart}
                products={products}
                language={language}
                checkedOut={checkedOut}
                onUpdateQuantity={handleUpdateQuantity}
                onStartCheckout={handleStartCheckout}
                onExplore={() => setTab("search")}
                onTrackOrder={() => setTab("orders")}
              />
            )}

            {tab === "orders" && (
              <OrdersScreen
                authenticated={authenticated}
                activeOrder={activeOrder}
                language={language}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {tab === "profile" && (
              <ProfileScreen
                authenticated={authenticated}
                user={currentUser}
                favoritesCount={favorites.length}
                language={language}
                onOpenAuth={() => setAuthModalOpen(true)}
                onSignOut={handleSignOut}
                onNavigateTab={(targetTab) => setTab(targetTab)}
                onToggleLanguage={handleToggleLanguage}
              />
            )}

            {tab === "admin" && (
              role === "owner" ? (
                <AdminScreen products={products} />
              ) : (
                <HomeScreen
                  products={products}
                  language={language}
                  authenticated={authenticated}
                  user={currentUser}
                  favorites={favorites}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigateSearch={handleNavigateSearch}
                />
              )
            )}
          </View>

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={tab}
            role={role}
            cartCount={cartCount}
            onSelectTab={(selectedTab) => setTab(selectedTab)}
          />

          {/* Product Detail Modal */}
          <ProductModal
            product={selectedProduct}
            language={language}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />

          {/* Authentication Modal - No client/owner tabs, direct RBAC */}
          <AuthModal
            visible={authModalOpen}
            language={language}
            checkoutPrompt={pendingCheckout}
            onClose={() => {
              setAuthModalOpen(false)
              setPendingCheckout(false)
            }}
            onAuthenticate={handleAuthenticate}
          />

          {/* Checkout Modal */}
          <CheckoutModal
            visible={checkoutOpen}
            subtotal={subtotal}
            deliveryFee={cartCount > 0 ? 2500 : 0}
            onClose={() => setCheckoutOpen(false)}
            onSuccess={handleCheckoutSuccess}
          />

          {/* Opening Splash Screen with Brand Logo & Neon status */}
          {isAppLoading && (
            <SplashScreen statusText="Connecting to Neon Cloud..." />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
})
