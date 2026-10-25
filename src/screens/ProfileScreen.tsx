import React from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native"
import {
  Boxes,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Heart,
  Languages,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react-native"
import { Language, Tab, User } from "../types"
import { colors } from "../theme/colors"
import { copy } from "../data/mockData"

type ProfileScreenProps = {
  authenticated: boolean
  user?: User | null
  favoritesCount: number
  language: Language
  onOpenAuth: () => void
  onSignOut: () => void
  onNavigateTab: (tab: Tab) => void
  onToggleLanguage: () => void
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  authenticated,
  user,
  favoritesCount,
  language,
  onOpenAuth,
  onSignOut,
  onNavigateTab,
  onToggleLanguage,
}) => {
  const t = copy[language]
  const isOwner = user?.role === "owner"

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {authenticated ? (
        <>
          {/* User Profile Card */}
          <View style={[styles.profileCard, isOwner && styles.profileCardOwner]}>
            <View style={[styles.avatar, isOwner && styles.avatarOwner]}>
              <Text style={[styles.avatarText, isOwner && styles.avatarTextOwner]}>
                {user?.initials || (isOwner ? "DG" : "AM")}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeKicker}>
                {isOwner ? "STORE ADMINISTRATOR" : t.welcomeBack.toUpperCase()}
              </Text>
              <Text style={styles.profileName}>
                {user?.name || (isOwner ? "Diane Gasana" : "Aline Mukamana")}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || (isOwner ? "owner@dgmarket.rw" : "aline.m@example.com")}
              </Text>
            </View>
          </View>

          {/* Account Menu */}
          <View style={styles.menuContainer}>
            {isOwner ? (
              <>
                <Pressable
                  style={styles.menuRow}
                  onPress={() => onNavigateTab("admin")}
                >
                  <View style={styles.menuIconBox}>
                    <LayoutDashboard size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>Store Dashboard</Text>
                    <Text style={styles.menuSub}>Overview, inventory, and revenue stats</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </Pressable>

                <Pressable
                  style={styles.menuRow}
                  onPress={() => onNavigateTab("orders")}
                >
                  <View style={styles.menuIconBox}>
                    <PackageCheck size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>Fulfillment & Orders</Text>
                    <Text style={styles.menuSub}>Manage customer orders and shipments</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </Pressable>

                <Pressable
                  style={styles.menuRow}
                  onPress={() => onNavigateTab("search")}
                >
                  <View style={styles.menuIconBox}>
                    <Boxes size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>Product Catalog</Text>
                    <Text style={styles.menuSub}>Inspect active store catalog items</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={styles.menuRow}
                  onPress={() => onNavigateTab("orders")}
                >
                  <View style={styles.menuIconBox}>
                    <ShoppingBag size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{t.orders}</Text>
                    <Text style={styles.menuSub}>Track and manage purchases</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </Pressable>

                <Pressable
                  style={styles.menuRow}
                  onPress={() => onNavigateTab("search")}
                >
                  <View style={styles.menuIconBox}>
                    <Heart size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{t.savedItems}</Text>
                    <Text style={styles.menuSub}>
                      {favoritesCount} products saved
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </Pressable>

                <View style={styles.menuRow}>
                  <View style={styles.menuIconBox}>
                    <MapPin size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{t.deliveryAddresses}</Text>
                    <Text style={styles.menuSub}>Kigali, Gasabo</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </View>

                <View style={styles.menuRow}>
                  <View style={styles.menuIconBox}>
                    <CreditCard size={20} color={colors.accentDark} />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{t.paymentMethods}</Text>
                    <Text style={styles.menuSub}>Mobile Money & Cards</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSecondary} />
                </View>
              </>
            )}

            <Pressable style={styles.menuRow} onPress={onToggleLanguage}>
              <View style={styles.menuIconBox}>
                <Languages size={20} color={colors.accentDark} />
              </View>
              <View style={styles.menuTextGroup}>
                <Text style={styles.menuTitle}>{t.languageLabel}</Text>
                <Text style={styles.menuSub}>
                  {language === "en" ? "English (EN)" : "Kinyarwanda (RW)"}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Sign Out Button */}
          <Pressable style={styles.signOutButton} onPress={onSignOut}>
            <LogOut size={16} color={colors.danger} />
            <Text style={styles.signOutText}>{t.signOut}</Text>
          </Pressable>
        </>
      ) : (
        /* Guest State */
        <View style={styles.guestContainer}>
          <View style={styles.guestIconCircle}>
            <CircleUserRound size={36} color={colors.accent} />
          </View>
          <Text style={styles.guestTitle}>Your Account</Text>
          <Text style={styles.guestSub}>
            Sign in to view your orders, saved payment methods, and delivery addresses.
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
  profileCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  profileCardOwner: {
    backgroundColor: "#16231d",
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.3)",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOwner: {
    backgroundColor: colors.accentAmber,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  avatarTextOwner: {
    color: "#16231d",
  },
  profileInfo: {
    flex: 1,
  },
  welcomeKicker: {
    color: colors.accentAmber,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  profileName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  profileEmail: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 12,
  },
  menuContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    gap: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.dangerLight,
  },
  signOutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800",
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
