import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native"
import {
  AlertCircle,
  Check,
  ChevronRight,
  LogIn,
  PackageCheck,
  Search,
  Sparkles,
  Truck,
} from "lucide-react-native"
import { OrderItem, Language } from "../types"
import { colors } from "../theme/colors"
import { copy, money, PAST_ORDERS } from "../data/mockData"
import { getOrderByPurchaseId } from "../services/neon"

type OrdersScreenProps = {
  authenticated: boolean
  activeOrder: OrderItem
  language: Language
  onOpenAuth: () => void
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  authenticated,
  activeOrder,
  language,
  onOpenAuth,
}) => {
  const t = copy[language]
  const trackingSteps = ["Confirmed", "Packed", "On the way", "Delivered"]

  const [searchId, setSearchId] = useState("")
  const [searchedOrder, setSearchedOrder] = useState<OrderItem | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  const displayOrder = searchedOrder || activeOrder

  const handleTrackById = async () => {
    if (!searchId.trim()) return
    setSearchError("")
    setSearching(true)

    // Check if it matches active order
    if (searchId.trim().toUpperCase() === activeOrder.id.toUpperCase()) {
      setSearchedOrder(activeOrder)
      setSearching(false)
      return
    }

    // Check past orders
    const pastMatch = PAST_ORDERS.find(
      (p) => p.id.toUpperCase() === searchId.trim().toUpperCase(),
    )
    if (pastMatch) {
      setSearchedOrder({
        id: pastMatch.id,
        customer: "Customer",
        date: pastMatch.date,
        status: pastMatch.status as any,
        itemsCount: 1,
        total: pastMatch.total,
        productName: "Everyday leather tote",
        productImage:
          "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=900&q=85",
        stepIndex: 3,
        estimatedArrival: "Delivered",
      })
      setSearching(false)
      return
    }

    // Query Neon PostgreSQL
    const dbOrder = await getOrderByPurchaseId(searchId.trim())
    setSearching(false)
    if (dbOrder) {
      setSearchedOrder(dbOrder)
    } else {
      setSearchError(
        `Purchase ID "${searchId.trim()}" not found. Please verify the ID on your receipt.`,
      )
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>{t.purchases.toUpperCase()}</Text>
        <Text style={styles.title}>{t.orders}</Text>
      </View>

      {/* Purchase ID Quick Tracker Input */}
      <View style={styles.trackerCard}>
        <Text style={styles.trackerTitle}>Track with Purchase ID</Text>
        <Text style={styles.trackerSub}>
          Check delivery progress anytime without signing in.
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Search size={16} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={searchId}
              onChangeText={(txt) => {
                setSearchId(txt)
                if (searchError) setSearchError("")
              }}
              placeholder="e.g. DG-2084"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
            />
          </View>
          <Pressable
            style={[styles.trackButton, searching && styles.buttonDisabled]}
            onPress={handleTrackById}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.trackButtonText}>Track</Text>
            )}
          </Pressable>
        </View>

        {searchError ? (
          <View style={styles.errorBox}>
            <AlertCircle size={14} color={colors.dangerText} />
            <Text style={styles.errorText}>{searchError}</Text>
          </View>
        ) : null}

        {searchedOrder && (
          <Pressable
            style={styles.resetButton}
            onPress={() => {
              setSearchedOrder(null)
              setSearchId("")
            }}
          >
            <Text style={styles.resetButtonText}>View current active order</Text>
          </Pressable>
        )}
      </View>

      {/* Active Order Card */}
      {displayOrder && (
        <View style={styles.orderCard}>
          <View style={styles.orderTop}>
            <View>
              <View style={styles.idPill}>
                <Sparkles size={11} color={colors.accentAmber} />
                <Text style={styles.orderIdLabel}>PURCHASE ID: {displayOrder.id}</Text>
              </View>
              <Text style={styles.orderStatusTitle}>{displayOrder.status}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Truck size={15} color="#FFF" />
              <Text style={styles.statusBadgeText}>
                {displayOrder.status === "Delivered" ? "Completed" : "2–3 days"}
              </Text>
            </View>
          </View>

          <View style={styles.orderProductRow}>
            <Image
              source={{ uri: displayOrder.productImage }}
              style={styles.orderProductImage}
              resizeMode="cover"
            />
            <View style={styles.orderProductInfo}>
              <Text style={styles.orderProductName}>
                {displayOrder.productName}
              </Text>
              <Text style={styles.orderProductSub}>
                {displayOrder.itemsCount} {displayOrder.itemsCount === 1 ? "item" : "items"} · {money(displayOrder.total)}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </View>

          {/* Tracking Steps Stepper */}
          <View style={styles.trackingContainer}>
            {trackingSteps.map((step, idx) => {
              const isDone = idx <= displayOrder.stepIndex
              return (
                <View key={step} style={styles.stepColumn}>
                  <View
                    style={[
                      styles.stepDot,
                      isDone && styles.stepDotDone,
                    ]}
                  >
                    {isDone && <Check size={10} color="#FFF" />}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isDone && styles.stepLabelDone,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              )
            })}
          </View>

          {/* Arrival Notice */}
          <View style={styles.arrivalBox}>
            <PackageCheck size={18} color={colors.primary} />
            <Text style={styles.arrivalText}>
              Estimated arrival: {displayOrder.estimatedArrival || "Thursday, 24 October"}
            </Text>
          </View>
        </View>
      )}

      {/* Past Orders Section (Available to authenticated users, or informative card for guests) */}
      {authenticated ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.pastOrders}</Text>
          </View>

          <View style={styles.pastOrdersList}>
            {PAST_ORDERS.map((item) => (
              <Pressable
                key={item.id}
                style={styles.pastOrderCard}
                onPress={() => {
                  setSearchId(item.id)
                  handleTrackById()
                }}
              >
                <View style={styles.pastOrderLeft}>
                  <View style={styles.pastOrderIconBox}>
                    <Check size={16} color={colors.success} />
                  </View>
                  <View>
                    <Text style={styles.pastOrderId}>
                      PURCHASE ID: {item.id} · {item.date}
                    </Text>
                    <Text style={styles.pastOrderStatus}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.pastOrderTotal}>{money(item.total)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.guestNoticeCard}>
          <View style={styles.guestNoticeIcon}>
            <Sparkles size={20} color={colors.accentAmber} />
          </View>
          <View style={styles.guestNoticeTextGroup}>
            <Text style={styles.guestNoticeTitle}>Guest Orders Protected</Text>
            <Text style={styles.guestNoticeSub}>
              All guest purchases receive a unique Purchase ID. Want all orders saved to a permanent account?
            </Text>
            <Pressable style={styles.inlineSignIn} onPress={onOpenAuth}>
              <LogIn size={14} color={colors.primary} />
              <Text style={styles.inlineSignInText}>Sign in or register</Text>
            </Pressable>
          </View>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
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
  trackerCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  trackerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  trackerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    height: 44,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  trackButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.dangerLight,
    padding: 9,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: {
    color: colors.dangerText,
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  resetButton: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
  },
  orderCard: {
    backgroundColor: colors.surfaceTan,
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  idPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  orderIdLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1,
  },
  orderStatusTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 11,
  },
  statusBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  orderProductRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  orderProductImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  orderProductInfo: {
    flex: 1,
  },
  orderProductName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  orderProductSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  trackingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    position: "relative",
  },
  stepColumn: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderDark,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepLabel: {
    fontSize: 9,
    color: colors.textSubtle,
    fontWeight: "600",
    textAlign: "center",
  },
  stepLabelDone: {
    color: colors.primary,
    fontWeight: "800",
  },
  arrivalBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    padding: 11,
    borderRadius: 12,
    marginTop: 6,
  },
  arrivalText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  pastOrdersList: {
    gap: 10,
  },
  pastOrderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 16,
  },
  pastOrderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pastOrderIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.successLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pastOrderId: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: "600",
  },
  pastOrderStatus: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pastOrderTotal: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  guestNoticeCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  guestNoticeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  guestNoticeTextGroup: {
    flex: 1,
  },
  guestNoticeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  guestNoticeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  inlineSignIn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inlineSignInText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
})
