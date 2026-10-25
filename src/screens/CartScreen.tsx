import React from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native"
import {
  Check,
  ChevronRight,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react-native"
import { Product, Language } from "../types"
import { colors } from "../theme/colors"
import { copy, money } from "../data/mockData"

type CartScreenProps = {
  cart: Record<number, number>
  products: Product[]
  language: Language
  checkedOut: boolean
  onUpdateQuantity: (productId: number, change: number) => void
  onStartCheckout: () => void
  onExplore: () => void
  onTrackOrder: () => void
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  products,
  language,
  checkedOut,
  onUpdateQuantity,
  onStartCheckout,
  onExplore,
  onTrackOrder,
}) => {
  const t = copy[language]

  const cartItems = products
    .filter((p) => (cart[p.id] || 0) > 0)
    .map((p) => ({
      ...p,
      quantity: cart[p.id],
    }))

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const deliveryFee = cartItems.length > 0 ? 2500 : 0
  const grandTotal = subtotal + deliveryFee

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>READY WHEN YOU ARE</Text>
          <Text style={styles.title}>{t.cart}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{cartCount}</Text>
        </View>
      </View>

      {/* Confirmation State if just checked out */}
      {checkedOut ? (
        <View style={styles.successCard}>
          <View style={styles.checkCircle}>
            <Check size={36} color="#FFF" />
          </View>
          <Text style={styles.successOrderLabel}>ORDER DG-2084</Text>
          <Text style={styles.successTitle}>{t.thankYou}</Text>
          <Text style={styles.successSub}>{t.confirmedNotice}</Text>

          <Pressable style={styles.trackButton} onPress={onTrackOrder}>
            <Text style={styles.trackButtonText}>{t.trackOrder}</Text>
            <Truck size={17} color="#FFF" />
          </Pressable>
        </View>
      ) : cartItems.length > 0 ? (
        <>
          {/* Cart Items List */}
          <View style={styles.itemsList}>
            {cartItems.map((item) => {
              const displayName =
                language === "en" ? item.name : item.rwName

              return (
                <View key={item.id} style={styles.cartCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cartImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cartCardInfo}>
                    <Text style={styles.itemCategory}>
                      {item.category.toUpperCase()}
                    </Text>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {displayName}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {money(item.price * item.quantity)}
                    </Text>

                    {/* Stepper */}
                    <View style={styles.stepper}>
                      <Pressable
                        style={styles.stepperButton}
                        onPress={() => onUpdateQuantity(item.id, -1)}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={14} color={colors.danger} />
                        ) : (
                          <Minus size={14} color={colors.primary} />
                        )}
                      </Pressable>

                      <Text style={styles.stepperValue}>{item.quantity}</Text>

                      <Pressable
                        style={styles.stepperButton}
                        onPress={() => onUpdateQuantity(item.id, 1)}
                      >
                        <Plus size={14} color={colors.primary} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEyebrow}>ORDER SUMMARY</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t.subtotal}</Text>
              <Text style={styles.summaryValue}>{money(subtotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t.delivery}</Text>
              <Text style={styles.summaryValue}>{money(deliveryFee)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t.total}</Text>
              <Text style={styles.totalValue}>{money(grandTotal)}</Text>
            </View>

            {/* Delivery address snippet */}
            <View style={styles.deliverySnippet}>
              <MapPin size={18} color={colors.primary} />
              <View style={styles.deliverySnippetText}>
                <Text style={styles.deliverySnippetTitle}>Delivering to</Text>
                <Text style={styles.deliverySnippetAddress}>
                  Kigali, Gasabo
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textSecondary} />
            </View>

            {/* Checkout CTA */}
            <Pressable
              style={styles.checkoutButton}
              onPress={onStartCheckout}
            >
              <CreditCard size={18} color="#FFF" />
              <Text style={styles.checkoutButtonText}>{t.checkout}</Text>
            </Pressable>

            <Text style={styles.paymentNote}>
              Mobile Money · Visa · Mastercard
            </Text>
          </View>
        </>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={34} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>{t.emptyBag}</Text>
          <Text style={styles.emptySub}>{t.emptyBagSub}</Text>
          <Pressable style={styles.startShopButton} onPress={onExplore}>
            <Text style={styles.startShopButtonText}>{t.startShopping}</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  itemsList: {
    gap: 12,
    marginBottom: 18,
  },
  cartCard: {
    flexDirection: "row",
    backgroundColor: colors.surfaceLight,
    borderRadius: 18,
    padding: 12,
    gap: 14,
  },
  cartImage: {
    width: 95,
    height: 110,
    borderRadius: 13,
    backgroundColor: colors.surfaceAlt,
  },
  cartCardInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  itemCategory: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    minWidth: 18,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: 22,
    padding: 20,
    marginTop: 6,
  },
  summaryEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  deliverySnippet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginBottom: 18,
  },
  deliverySnippetText: {
    flex: 1,
  },
  deliverySnippetTitle: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  deliverySnippetAddress: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  checkoutButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  checkoutButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  paymentNote: {
    textAlign: "center",
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  startShopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  startShopButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  successCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    padding: 24,
    borderRadius: 22,
    marginTop: 10,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successOrderLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  trackButton: {
    backgroundColor: colors.primary,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
})
