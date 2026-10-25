import React, { useMemo } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native"
import { Search, X } from "lucide-react-native"
import { Product, Language } from "../types"
import { colors } from "../theme/colors"
import { CATEGORIES, copy } from "../data/mockData"
import { ProductCard } from "../components/ProductCard"

type SearchScreenProps = {
  products: Product[]
  language: Language
  query: string
  category: string
  favorites: number[]
  onQueryChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onSelectProduct: (product: Product) => void
  onAddToCart: (productId: number) => void
  onToggleFavorite: (productId: number) => void
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  products,
  language,
  query,
  category,
  favorites,
  onQueryChange,
  onCategoryChange,
  onSelectProduct,
  onAddToCart,
  onToggleFavorite,
}) => {
  const t = copy[language]

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        category === "All" || product.category === category
      const matchQuery =
        !query ||
        `${product.name} ${product.rwName} ${product.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      return matchCategory && matchQuery
    })
  }, [products, category, query])

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page Title */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>{t.exploreTitle.toUpperCase()}</Text>
            <Text style={styles.title}>{t.findFavorite}</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{filtered.length}</Text>
          </View>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchBox}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.search}
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={onQueryChange}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => onQueryChange("")} hitSlop={8}>
              <X size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Filter Categories Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat
            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => onCategoryChange(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Grid Results or Empty State */}
        {filtered.length > 0 ? (
          <View style={styles.productGrid}>
            {filtered.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                language={language}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => onToggleFavorite(item.id)}
                onPress={() => onSelectProduct(item)}
                onAddToCart={() => onAddToCart(item.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Search size={28} color={colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>{t.noProducts}</Text>
            <Text style={styles.emptySubtitle}>{t.noProductsSub}</Text>
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                onQueryChange("")
                onCategoryChange("All")
              }}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
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
  searchBox: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFF",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
})
