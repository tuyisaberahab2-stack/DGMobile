import React from "react"
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native"
import { ShoppingBag, Star, X } from "lucide-react-native"
import { Product, Language } from "../types"
import { colors } from "../theme/colors"
import { money } from "../data/mockData"

type ProductModalProps = {
  product: Product | null
  language: Language
  onClose: () => void
  onAddToCart: (productId: number) => void
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  language,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null

  const displayName = language === "en" ? product.name : product.rwName

  return (
    <Modal
      visible={!!product}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.outsideOverlay} onPress={onClose} />
        <View style={styles.modalSheet}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={18} color={colors.textPrimary} />
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: product.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <Text style={styles.kicker}>
                {product.category.toUpperCase()} · D&G EDIT
              </Text>
              <Text style={styles.title}>{displayName}</Text>

              <View style={styles.ratingRow}>
                <Star size={15} color={colors.accent} fill={colors.accent} />
                <Text style={styles.ratingText}>
                  {product.rating} <Text style={styles.ratingMuted}>· 128 reviews</Text>
                </Text>
              </View>

              <Text style={styles.description}>
                {product.description ||
                  "A considered everyday essential, selected for lasting quality, effortless style, and beautiful finish across Rwanda."}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>{money(product.price)}</Text>
                {product.oldPrice && (
                  <Text style={styles.oldPrice}>{money(product.oldPrice)}</Text>
                )}
              </View>

              <Pressable
                style={styles.primaryButton}
                onPress={() => onAddToCart(product.id)}
              >
                <ShoppingBag size={18} color="#FFF" />
                <Text style={styles.primaryButtonText}>Add to bag</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(20, 24, 21, 0.65)",
    justifyContent: "flex-end",
  },
  outsideOverlay: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    zIndex: 10,
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(251, 250, 246, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroImage: {
    width: "100%",
    height: 310,
    backgroundColor: colors.surfaceAlt,
  },
  content: {
    padding: 24,
    paddingBottom: 36,
  },
  kicker: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 30,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
  },
  ratingMuted: {
    color: colors.textSecondary,
    fontWeight: "400",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 22,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  oldPrice: {
    fontSize: 14,
    color: colors.textSubtle,
    textDecorationLine: "line-through",
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
})
