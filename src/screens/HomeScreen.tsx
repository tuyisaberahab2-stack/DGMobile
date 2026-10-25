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
  ChevronRight,
  Heart,
  Home as HomeIcon,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react-native"
import { Product, Language, User } from "../types"
import { colors } from "../theme/colors"
import { copy } from "../data/mockData"
import { ProductCard } from "../components/ProductCard"

type HomeScreenProps = {
  products: Product[]
  language: Language
  authenticated: boolean
  user?: User | null
  favorites: number[]
  onSelectProduct: (product: Product) => void
  onAddToCart: (productId: number) => void
  onToggleFavorite: (productId: number) => void
  onNavigateSearch: (category?: string) => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  language,
  authenticated,
  user,
  favorites,
  onSelectProduct,
  onAddToCart,
  onToggleFavorite,
  onNavigateSearch,
}) => {
  const t = copy[language]

  const categories = [
    { name: "Bags", icon: ShoppingBag, tint: colors.categories.Bags },
    { name: "Shoes", icon: Sparkles, tint: colors.categories.Shoes },
    { name: "Beauty", icon: Heart, tint: colors.categories.Beauty },
    { name: "Home", icon: HomeIcon, tint: colors.categories.Home },
  ]

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Banner */}
      <View style={styles.welcomeRow}>
        <View style={styles.welcomeTextGroup}>
          <Text style={styles.kicker}>
            {authenticated && user
              ? `WELCOME, ${user.name.split(" ")[0].toUpperCase()}`
              : authenticated
              ? t.greeting.toUpperCase()
              : t.guestGreeting.toUpperCase()}
          </Text>
          <Text style={styles.heroGreetingTitle}>{t.discover}</Text>
        </View>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {user?.initials || (authenticated ? "AM" : "DG")}
          </Text>
        </View>
      </View>

      {/* Search Input Trigger */}
      <Pressable
        style={styles.searchBar}
        onPress={() => onNavigateSearch()}
      >
        <Search size={18} color={colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>{t.search}</Text>
      </Pressable>

      {/* Featured Editorial Hero Card */}
      <View style={styles.heroCard}>
        <Image
          source={{ uri: products[1]?.image || products[0].image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroCopy}>
          <View style={styles.heroBadge}>
            <Sparkles size={11} color={colors.accentAmber} />
            <Text style={styles.heroBadgeText}>{t.heroKicker}</Text>
          </View>
          <Text style={styles.heroHeading}>{t.heroTitle}</Text>
          <Text style={styles.heroParagraph}>{t.heroBody}</Text>

          <Pressable
            style={styles.heroActionButton}
            onPress={() => onNavigateSearch()}
          >
            <Text style={styles.heroActionText}>{t.shopNow}</Text>
            <ChevronRight size={15} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Categories Strip */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.shopByCategory}</Text>
        <Pressable onPress={() => onNavigateSearch()}>
          <Text style={styles.seeAllText}>{t.seeAll}</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map(({ name, icon: Icon, tint }) => (
          <Pressable
            key={name}
            style={[styles.categoryCard, { backgroundColor: tint.bg }]}
            onPress={() => onNavigateSearch(name)}
          >
            <View style={styles.categoryIconWrap}>
              <Icon size={24} color={tint.icon} />
            </View>
            <Text style={[styles.categoryTitle, { color: tint.icon }]}>
              {name}
            </Text>
            <Text style={styles.categorySubtitle}>{tint.sub}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Popular Products Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.popular}</Text>
        <Pressable onPress={() => onNavigateSearch()}>
          <Text style={styles.seeAllText}>{t.seeAll}</Text>
        </Pressable>
      </View>

      <View style={styles.productGrid}>
        {products.map((item) => (
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
    paddingBottom: 24,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  welcomeTextGroup: {
    flex: 1,
    paddingRight: 10,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroGreetingTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userAvatarText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  searchBar: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 18,
  },
  searchPlaceholder: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  heroCard: {
    height: 350,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.primaryDark,
    marginBottom: 24,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(22, 32, 26, 0.72)",
  },
  heroCopy: {
    flex: 1,
    padding: 22,
    justifyContent: "flex-end",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: colors.accentAmber,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroHeading: {
    color: "#FFF",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: 8,
  },
  heroParagraph: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    lineHeight: 18,
    maxWidth: "88%",
    marginBottom: 16,
  },
  heroActionButton: {
    backgroundColor: "#F7F1E8",
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  heroActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
  },
  categoryScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  categoryCard: {
    width: 125,
    height: 135,
    borderRadius: 18,
    padding: 14,
    justifyContent: "space-between",
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },
  categorySubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
})
