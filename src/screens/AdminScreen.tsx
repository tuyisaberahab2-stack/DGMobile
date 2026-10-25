import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native"
import {
  AlertCircle,
  BarChart3,
  Boxes,
  Check,
  ChevronRight,
  Eye,
  LayoutDashboard,
  Minus,
  PackageCheck,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react-native"
import { Product } from "../types"
import { colors } from "../theme/colors"
import { INITIAL_ORDERS, money } from "../data/mockData"
import { updateProductStock } from "../services/neon"

type AdminScreenProps = {
  products: Product[]
  onAddProduct: (product: Omit<Product, "id">) => Promise<void>
  onUpdateProduct: (product: Product) => Promise<void>
  onDeleteProduct: (productId: number) => Promise<void>
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
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

  // Product CRUD Form Modal State
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [formName, setFormName] = useState("")
  const [formRwName, setFormRwName] = useState("")
  const [formCategory, setFormCategory] = useState("Leather")
  const [formPrice, setFormPrice] = useState("")
  const [formStock, setFormStock] = useState("10")
  const [formBadge, setFormBadge] = useState("Handmade")
  const [formImage, setFormImage] = useState(
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
  )
  const [formDesc, setFormDesc] = useState("")
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)

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

  const handleOpenAddModal = () => {
    setIsEditing(false)
    setEditingProductId(null)
    setFormName("")
    setFormRwName("")
    setFormCategory("Leather")
    setFormPrice("")
    setFormStock("10")
    setFormBadge("New")
    setFormImage(
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
    )
    setFormDesc("")
    setFormError("")
    setModalVisible(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true)
    setEditingProductId(product.id)
    setFormName(product.name)
    setFormRwName(product.rwName || product.name)
    setFormCategory(product.category)
    setFormPrice(String(product.price))
    setFormStock(String(stock[product.id] ?? product.stock ?? 10))
    setFormBadge(product.badge || "")
    setFormImage(product.image)
    setFormDesc(product.description || "")
    setFormError("")
    setModalVisible(true)
  }

  const handleConfirmDelete = (product: Product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to remove "${product.name}" from the store catalog? This will delete the item from Neon PostgreSQL.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await onDeleteProduct(product.id)
            } catch (err: any) {
              Alert.alert("Error", "Could not delete product.")
            }
          },
        },
      ],
    )
  }

  const handleSaveProduct = async () => {
    setFormError("")
    if (!formName.trim()) {
      setFormError("Please enter product name.")
      return
    }
    const priceNum = parseInt(formPrice.replace(/[^0-9]/g, ""), 10)
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please enter a valid price in RWF.")
      return
    }
    const stockNum = parseInt(formStock.replace(/[^0-9]/g, ""), 10) || 0

    setSaving(true)
    try {
      if (isEditing && editingProductId !== null) {
        await onUpdateProduct({
          id: editingProductId,
          name: formName.trim(),
          rwName: formRwName.trim() || formName.trim(),
          category: formCategory,
          price: priceNum,
          stock: stockNum,
          badge: formBadge.trim() || undefined,
          image:
            formImage.trim() ||
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
          description: formDesc.trim() || undefined,
          rating: 4.9,
        })
        setStock((curr) => ({ ...curr, [editingProductId]: stockNum }))
      } else {
        await onAddProduct({
          name: formName.trim(),
          rwName: formRwName.trim() || formName.trim(),
          category: formCategory,
          price: priceNum,
          stock: stockNum,
          badge: formBadge.trim() || undefined,
          image:
            formImage.trim() ||
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
          description: formDesc.trim() || undefined,
          rating: 4.9,
        })
      }
      setModalVisible(false)
    } catch (err: any) {
      setFormError(err?.message || "Failed to save product.")
    } finally {
      setSaving(false)
    }
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
            <Pressable style={styles.addProductBtn} onPress={handleOpenAddModal}>
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
                    {isLow ? "Low" : "Active"}
                  </Text>
                </View>

                {/* CRUD Action Buttons: Edit & Delete */}
                <View style={styles.actionButtonGroup}>
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => handleOpenEditModal(product)}
                  >
                    <Pencil size={13} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleConfirmDelete(product)}
                  >
                    <Trash2 size={13} color={colors.danger} />
                  </Pressable>
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

      {/* Product Form Modal (Add / Edit) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalKicker}>
                  {isEditing ? "EDIT CATALOG ITEM" : "NEW PRODUCT"}
                </Text>
                <Text style={styles.modalTitle}>
                  {isEditing ? "Update Product" : "Add to Storefront"}
                </Text>
              </View>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}
              >
                <X size={18} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Name (English) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Product Name (English)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="e.g. Rwandan Leather Tote"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Name (Kinyarwanda) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Product Name (Ikinyarwanda)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formRwName}
                  onChangeText={setFormRwName}
                  placeholder="e.g. Igisakoshi cy'uruhu cyiza"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Category Pills */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryPillsRow}
                >
                  {[
                    "Leather",
                    "Accessories",
                    "Apparel",
                    "Footwear",
                    "Bags",
                    "Shoes",
                    "Beauty",
                    "Home",
                  ].map((cat) => {
                    const isSelected = formCategory === cat
                    return (
                      <Pressable
                        key={cat}
                        style={[
                          styles.categoryPill,
                          isSelected && styles.categoryPillSelected,
                        ]}
                        onPress={() => setFormCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryPillText,
                            isSelected && styles.categoryPillTextSelected,
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    )
                  })}
                </ScrollView>
              </View>

              {/* Price & Stock Row */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Price (RWF)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formPrice}
                    onChangeText={setFormPrice}
                    placeholder="e.g. 48500"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>Stock Count</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formStock}
                    onChangeText={setFormStock}
                    placeholder="10"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Badge Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Badge / Highlight</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryPillsRow}
                >
                  {[
                    "Handmade",
                    "New",
                    "Pure Silk",
                    "Bestseller",
                    "Featured",
                  ].map((b) => {
                    const isSelected = formBadge === b
                    return (
                      <Pressable
                        key={b}
                        style={[
                          styles.categoryPill,
                          isSelected && styles.categoryPillSelected,
                        ]}
                        onPress={() => setFormBadge(isSelected ? "" : b)}
                      >
                        <Text
                          style={[
                            styles.categoryPillText,
                            isSelected && styles.categoryPillTextSelected,
                          ]}
                        >
                          {b}
                        </Text>
                      </Pressable>
                    )
                  })}
                </ScrollView>
              </View>

              {/* Photo Presets & URL */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Photo (Presets or Image URL)</Text>
                <View style={styles.presetsRow}>
                  {[
                    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=85",
                    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85",
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=85",
                  ].map((url, idx) => {
                    const isSelected = formImage === url
                    return (
                      <Pressable
                        key={idx}
                        style={[
                          styles.presetThumbWrap,
                          isSelected && styles.presetThumbWrapSelected,
                        ]}
                        onPress={() => setFormImage(url)}
                      >
                        <Image
                          source={{ uri: url }}
                          style={styles.presetThumb}
                        />
                        {isSelected && (
                          <View style={styles.presetCheck}>
                            <Check size={10} color="#FFF" />
                          </View>
                        )}
                      </Pressable>
                    )
                  })}
                </View>

                <TextInput
                  style={[styles.formInput, { marginTop: 8 }]}
                  value={formImage}
                  onChangeText={setFormImage}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={styles.formTextArea}
                  value={formDesc}
                  onChangeText={setFormDesc}
                  placeholder="Product story, materials, and artisan details..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {formError ? (
                <View style={styles.errorBox}>
                  <AlertCircle size={14} color={colors.dangerText} />
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              {/* Submit Button */}
              <Pressable
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveProduct}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Check size={16} color="#FFF" />
                    <Text style={styles.saveBtnText}>
                      {isEditing ? "Save Changes" : "Create Product"}
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  actionButtonGroup: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  actionBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: colors.dangerLight,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(20, 24, 21, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "92%",
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalKicker: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 14,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  formLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  formInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 12,
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    fontSize: 12,
    color: colors.textPrimary,
  },
  formTextArea: {
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 12,
    backgroundColor: "#FFF",
    padding: 12,
    fontSize: 12,
    color: colors.textPrimary,
    textAlignVertical: "top",
    minHeight: 70,
  },
  categoryPillsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  categoryPillSelected: {
    backgroundColor: colors.primary,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  categoryPillTextSelected: {
    color: "#FFF",
  },
  presetsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  presetThumbWrap: {
    width: 54,
    height: 54,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    position: "relative",
  },
  presetThumbWrapSelected: {
    borderColor: colors.accent,
  },
  presetThumb: {
    width: "100%",
    height: "100%",
  },
  presetCheck: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: 6,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    height: 48,
    borderRadius: 13,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: {
    color: colors.dangerText,
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
})
