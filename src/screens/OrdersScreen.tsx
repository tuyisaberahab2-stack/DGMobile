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
  LogIn,
  PackageCheck,
  Truck,
} from "lucide-react-native"
import { OrderItem, Language } from "../types"
import { colors } from "../theme/colors"
import { copy, money, PAST_ORDERS } from "../data/mockData"

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.kicker}>{t.purchases.toUpperCase()}</Text>
        <Text style={styles.title}>{t.orders}</Text>
      </View>

      {authenticated ? (
        <>
          {/* Active Order Card */}
          <View style={styles.orderCard}>
            <View style={styles.orderTop}>
              <View>
                <Text style={styles.orderIdLabel}>ORDER {activeOrder.id}</Text>
                <Text style={styles.orderStatusTitle}>{activeOrder.status}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Truck size={16} color="#FFF" />
                <Text style={styles.statusBadgeText}>2 days</Text>
              </View>
            </View>

            <View style={styles.orderProductRow}>
              <Image
                source={{ uri: activeOrder.productImage }}
                style={styles.orderProductImage}
                resizeMode="cover"
              />
              <View style={styles.orderProductInfo}>
                <Text style={styles.orderProductName}>
                  {activeOrder.productName}
                </Text>
                <Text style={styles.orderProductSub}>
                  {activeOrder.itemsCount} item · {money(activeOrder.total)}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </View>

            {/* Tracking Steps */}
            <View style={styles.trackingContainer}>
              {trackingSteps.map((step, idx) => {
                const isDone = idx <= activeOrder.stepIndex
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
                Estimated arrival: {activeOrder.estimatedArrival || "Thursday, 24 October"}
              </Text>
            </View>
          </View>

          {/* Past Orders Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.pastOrders}</Text>
          </View>

          <View style={styles.pastOrdersList}>
            {PAST_ORDERS.map((item) => (
              <View key={item.id} style={styles.pastOrderCard}>
                <View style={styles.pastOrderLeft}>
                  <View style={styles.pastOrderIconBox}>
                    <Check size={16} color={colors.success} />
                  </View>
                  <View>
                    <Text style={styles.pastOrderId}>
                      {item.id} · {item.date}
                    </Text>
                    <Text style={styles.pastOrderStatus}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.pastOrderTotal}>{money(item.total)}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        /* Guest State */
        <View style={styles.guestContainer}>
          <View style={styles.guestIconCircle}>
            <PackageCheck size={36} color={colors.accent} />
          </View>
          <Text style={styles.guestTitle}>Sign in to view orders</Text>
          <Text style={styles.guestSub}>
            Track existing purchases, manage delivery progress in real time, and view receipts.
          </Text>
          <Pressable style={styles.signInButton} onPress={onOpenAuth}>
            <LogIn size={16} color="#FFF" />
            <Text style={styles.signInButtonText}>Sign in or register</Text>
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
  header: {
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
  orderCard: {
    backgroundColor: colors.surfaceTan,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
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
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
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
    paddingVertical: 16,
  },
  orderProductImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  orderProductInfo: {
    flex: 1,
  },
  orderProductName: {
    fontSize: 14,
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
    paddingVertical: 14,
    position: "relative",
  },
  stepColumn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
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
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
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
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.successLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pastOrderId: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pastOrderStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  pastOrderTotal: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  guestContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  guestIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  guestSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  signInButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  signInButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
})
