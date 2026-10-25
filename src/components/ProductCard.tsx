import React from "react"
import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { Heart, Plus } from "lucide-react-native"
import { Product, Language } from "../types"
import { colors } from "../theme/colors"
import { money } from "../data/mockData"

type ProductCardProps = {
  product: Product
  language: Language
  isFavorite: boolean
  onToggleFavorite: () => void
  onPress: () => void
  onAddToCart: () => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  isFavorite,
  onToggleFavorite,
  onPress,
  onAddToCart,
}) => {
  const displayName = language === "en" ? product.name : product.rwName

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </Pressable>

      <Pressable
        style={[styles.heartButton, isFavorite && styles.heartButtonActive]}
        onPress={onToggleFavorite}
        hitSlop={8}
      >
        <Heart
          size={16}
          color={isFavorite ? colors.danger : colors.textPrimary}
          fill={isFavorite ? colors.danger : "transparent"}
        />
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Pressable onPress={onPress}>
          <Text style={styles.title} numberOfLines={1}>
            {displayName}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{money(product.price)}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>{money(product.oldPrice)}</Text>
            )}
          </View>

          <Pressable
            style={styles.addButton}
            onPress={onAddToCart}
            hitSlop={6}
          >
            <Plus size={16} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 16,
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 195,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 9,
    left: 9,
    backgroundColor: "rgba(251, 250, 246, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heartButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(251, 250, 246, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  heartButtonActive: {
    backgroundColor: "rgba(251, 250, 246, 0.98)",
  },
  info: {
    paddingTop: 8,
  },
  category: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.textSubtle,
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceContainer: {
    flexDirection: "column",
  },
  price: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  oldPrice: {
    fontSize: 10,
    color: colors.textSubtle,
    textDecorationLine: "line-through",
    marginTop: 1,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
})
