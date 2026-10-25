import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from "react-native"
import {
  AlertCircle,
  BarChart3,
  Boxes,
  ChevronRight,
  Eye,
  LayoutDashboard,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react-native"
import { Product } from "../types"
import { colors } from "../theme/colors"
import { INITIAL_ORDERS, money } from "../data/mockData"
import { updateProductStock } from "../services/neon"

type AdminScreenProps = {
  products: Product[]
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ products }) => {
  const [section, setSection] = useState<
    "overview" | "products" | "orders" | "reports"
  >("overview")

  const [stock, setStock] = useState<Record<number, number>>({
    1: 14,
    2: 5,
    3: 21,
    4: 2,
    5: 9,
    6: 17,
  })

  const [simulatedError, setSimulatedError] = useState(false)

  const handleStockChange = (productId: number, change: number) => {
    setStock((current) => {
      const nextVal = Math.max(0, (current[productId] || 0) + change)
      updateProductStock(productId, nextVal)
      return {
        ...current,
        [productId]: nextVal,
      }
    })
  }

  if (simulatedError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconCircle}>
          <AlertCircle size={32} color={colors.danger} />
        </View>
        <Text style={styles.errorTitle}>Couldn't load business data</Text>
        <Text style={styles.errorSubtitle}>
          Check your network connection and try again. Offline storefront data remains accessible.
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => setSimulatedError(false)}
        >
          <RefreshCw size={16} color="#FFF" />
          <Text style={styles.retryButtonText}>Try again</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.adminHeader}>
        <View>
          <Text style={styles.kicker}>OWNER WORKSPACE</Text>
          <Text style={styles.title}>Good morning, Diane.</Text>
          <Text style={styles.subtitle}>
            Here's what's happening across D&G Market today.
          </Text>
        </View>

        <Pressable
          style={styles.syncButton}
          onPress={() => setSimulatedError(true)}
        >
          <RefreshCw size={14} color={colors.primary} />
          <Text style={styles.syncButtonText}>Sync data</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {[
          { id: "overview" as const, Icon: LayoutDashboard, label: "Overview" },
          { id: "products" as const, Icon: Boxes, label: "Products" },
          { id: "orders" as const, Icon: PackageCheck, label: "Orders" },
          { id: "reports" as const, Icon: BarChart3, label: "Reports" },
        ].map(({ id, Icon, label }) => {
          const isActive = section === id
          return (
            <Pressable
              key={id}
              style={[
                styles.tabChip,
                isActive && styles.tabChipActive,
              ]}
              onPress={() => setSection(id)}
            >
              <Icon
                size={16}
                color={isActive ? "#FFF" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabChipText,
                  isActive && styles.tabChipTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* SECTION: Overview */}
      {section === "overview" && (
        <>
          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricIconWrap}>
                <Wallet size={18} color={colors.success} />
              </View>
              <Text style={styles.metricLabel}>Revenue today</Text>
              <Text style={styles.metricValue}>{money(486500)}</Text>
              <Text style={styles.metricChange}>+18.4% vs yesterday</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconWrap}>
                <ShoppingBag size={18} color={colors.primary} />
              </View>
              <Text style={styles.metricLabel}>Orders today</Text>
              <Text style={styles.metricValue}>24</Text>
              <Text style={styles.metricChange}>+6 new orders</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconWrap}>
                <TrendingUp size={18} color={colors.accent} />
              </View>
              <Text style={styles.metricLabel}>Customers</Text>
              <Text style={styles.metricValue}>1,248</Text>
              <Text style={styles.metricChange}>+32 this week</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, styles.metricIconAlert]}>
                <AlertCircle size={18} color={colors.danger} />
              </View>
              <Text style={styles.metricLabel}>Low stock</Text>
              <Text style={styles.metricValue}>2 items</Text>
              <Text style={[styles.metricChange, { color: colors.danger }]}>
                Needs attention
              </Text>
            </View>
          </View>

          {/* Weekly Sales Chart */}
          <View style={styles.reportBox}>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportKicker}>SALES PERFORMANCE</Text>
                <Text style={styles.reportTitle}>Weekly revenue</Text>
              </View>
              <Text style={styles.reportHighlight}>1.84M RWF</Text>
            </View>

            <View style={styles.barChart}>
              {[
                { day: "M", height: 50 },
                { day: "T", height: 75 },
                { day: "W", height: 60 },
                { day: "T", height: 95 },
                { day: "F", height: 80 },
                { day: "S", height: 120 },
                { day: "S", height: 90 },
              ].map(({ day, height }, idx) => (
                <View key={idx} style={styles.barCol}>
                  <View style={[styles.bar, { height }]} />
                  <Text style={styles.barLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stock Alerts */}
          <View style={styles.reportBox}>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportKicker}>INVENTORY</Text>
                <Text style={styles.reportTitle}>Stock alerts</Text>
              </View>
              <Pressable onPress={() => setSection("products")}>
                <Text style={styles.manageLink}>Manage</Text>
              </Pressable>
            </View>

            {products
              .filter((p) => (stock[p.id] || 0) <= 5)
              .map((product) => (
                <View key={product.id} style={styles.stockAlertRow}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.stockAlertImage}
                  />
                  <View style={styles.stockAlertInfo}>
                    <Text style={styles.stockAlertName}>{product.name}</Text>
                    <Text style={styles.stockAlertCount}>
                      {stock[product.id]} units remaining
                    </Text>
                  </View>
                  <AlertCircle size={18} color={colors.danger} />
                </View>
              ))}
          </View>
        </>
      )}

      {/* SECTION: Products & Inventory */}
      {section === "products" && (
        <View style={styles.reportBox}>
          <View style={styles.reportHeader}>
            <View>
              <Text style={styles.reportKicker}>CATALOG</Text>
              <Text style={styles.reportTitle}>Products & inventory</Text>
            </View>
            <Pressable style={styles.addProductBtn}>
              <Plus size={14} color="#FFF" />
              <Text style={styles.addProductText}>Add item</Text>
            </Pressable>
          </View>

          {products.map((product) => {
            const currentStock = stock[product.id] || 0
            const isLow = currentStock <= 5

            return (
              <View key={product.id} style={styles.productRow}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productRowImage}
                />
                <View style={styles.productRowInfo}>
                  <Text style={styles.productRowName}>{product.name}</Text>
                  <Text style={styles.productRowSub}>
                    {product.category} · {money(product.price)}
                  </Text>
                </View>

                {/* Editable Stock Stepper */}
                <View style={styles.stockStepper}>
                  <Pressable
                    style={styles.stockStepBtn}
                    onPress={() => handleStockChange(product.id, -1)}
                  >
                    <Minus size={12} color={colors.textPrimary} />
                  </Pressable>
                  <Text style={styles.stockValue}>{currentStock}</Text>
                  <Pressable
                    style={styles.stockStepBtn}
                    onPress={() => handleStockChange(product.id, 1)}
                  >
                    <Plus size={12} color={colors.textPrimary} />
                  </Pressable>
                </View>

                <View
                  style={[
                    styles.stockStatusBadge,
                    isLow
                      ? styles.stockStatusWarning
                      : styles.stockStatusGood,
                  ]}
                >
                  <Text
                    style={[
                      styles.stockStatusText,
                      isLow
                        ? styles.stockStatusTextWarning
                        : styles.stockStatusTextGood,
                    ]}
                  >
                    {isLow ? "Low stock" : "Active"}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      )}

      {/* SECTION: Orders */}
      {section === "orders" && (
        <View style={styles.reportBox}>
          <View style={styles.reportHeader}>
            <View>
              <Text style={styles.reportKicker}>FULFILMENT</Text>
              <Text style={styles.reportTitle}>Recent orders</Text>
            </View>
            <Text style={styles.reportHighlight}>24 open</Text>
          </View>

          {INITIAL_ORDERS.map((ord) => (
            <View key={ord.id} style={styles.orderItemRow}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemId}>{ord.id}</Text>
                <Text style={styles.orderItemCustomer}>{ord.customer}</Text>
              </View>

              <View style={styles.orderStatusPill}>
                <Text style={styles.orderStatusPillText}>{ord.status}</Text>
              </View>

              <Text style={styles.orderItemTotal}>{money(ord.total)}</Text>
              <Eye size={17} color={colors.textSecondary} />
            </View>
          ))}
        </View>
      )}

      {/* SECTION: Reports */}
      {section === "reports" && (
        <>
          <View style={styles.reportMetricsRow}>
            <View style={styles.reportMetricCard}>
              <Text style={styles.metricLabel}>Gross sales</Text>
              <Text style={styles.metricValue}>{money(6842000)}</Text>
              <Text style={styles.metricChange}>October 2026</Text>
            </View>
            <View style={styles.reportMetricCard}>
              <Text style={styles.metricLabel}>Average order</Text>
              <Text style={styles.metricValue}>{money(68420)}</Text>
              <Text style={styles.metricChange}>100 orders</Text>
            </View>
          </View>

          <View style={styles.reportBox}>
            <View style={styles.reportHeader}>
              <View>
                <Text style={styles.reportKicker}>REPORTING</Text>
                <Text style={styles.reportTitle}>Sales by category</Text>
              </View>
            </View>

            {[
              { cat: "Shoes", amount: 2600000, share: 38 },
              { cat: "Bags", amount: 1980000, share: 29 },
              { cat: "Beauty", amount: 1436000, share: 21 },
              { cat: "Home", amount: 826000, share: 12 },
            ].map(({ cat, amount, share }) => (
              <View key={cat} style={styles.categoryShareRow}>
                <Text style={styles.categoryShareName}>{cat}</Text>
                <View style={styles.categoryProgressBar}>
                  <View
                    style={[
                      styles.categoryProgressFill,
                      { width: `${share}%` },
                    ]}
                  />
                </View>
                <Text style={styles.categoryShareAmount}>{money(amount)}</Text>
                <Text style={styles.categorySharePercent}>{share}%</Text>
              </View>
            ))}
          </View>
        </>
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
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  syncButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  tabsRow: {
    gap: 8,
    paddingBottom: 16,
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
  },
  tabChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  tabChipTextActive: {
    color: "#FFF",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricIconAlert: {
    backgroundColor: colors.dangerLight,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.success,
  },
  reportBox: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  reportKicker: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  reportHighlight: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  manageLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
  },
  barChart: {
    height: 140,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingTop: 10,
  },
  barCol: {
    alignItems: "center",
    gap: 6,
  },
  bar: {
    width: 22,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  stockAlertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stockAlertImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  stockAlertInfo: {
    flex: 1,
  },
  stockAlertName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  stockAlertCount: {
    fontSize: 10,
    color: colors.danger,
    marginTop: 2,
  },
  addProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addProductText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  productRowImage: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  productRowInfo: {
    flex: 1,
  },
  productRowName: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  productRowSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stockStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 3,
  },
  stockStepBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  stockValue: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textPrimary,
    minWidth: 16,
    textAlign: "center",
  },
  stockStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  stockStatusGood: {
    backgroundColor: colors.successLight,
  },
  stockStatusWarning: {
    backgroundColor: colors.dangerLight,
  },
  stockStatusText: {
    fontSize: 9,
    fontWeight: "700",
  },
  stockStatusTextGood: {
    color: colors.successText,
  },
  stockStatusTextWarning: {
    color: colors.dangerText,
  },
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  orderItemLeft: {
    flex: 1,
  },
  orderItemId: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  orderItemCustomer: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  orderStatusPill: {
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatusPillText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.primary,
  },
  orderItemTotal: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  reportMetricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  reportMetricCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
  },
  categoryShareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  categoryShareName: {
    width: 60,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  categoryProgressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceAlt,
    overflow: "hidden",
  },
  categoryProgressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  categoryShareAmount: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textPrimary,
    minWidth: 65,
    textAlign: "right",
  },
  categorySharePercent: {
    fontSize: 10,
    color: colors.textSecondary,
    width: 30,
    textAlign: "right",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
})
