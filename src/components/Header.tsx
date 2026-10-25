import React from "react"
import { StyleSheet, Text, View, Pressable } from "react-native"
import {
  Bell,
  CircleUserRound,
  Languages,
  LayoutDashboard,
  LogIn,
  ShoppingBag,
} from "lucide-react-native"
import { Role, Language, User } from "../types"
import { colors } from "../theme/colors"

type HeaderProps = {
  authenticated: boolean
  role: Role
  user?: User | null
  language: Language
  cartCount: number
  onToggleLanguage: () => void
  onOpenAuth: () => void
  onOpenCart: () => void
  onGoHome: () => void
  onGoToProfile?: () => void
  onGoToAdmin?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  authenticated,
  role,
  user,
  language,
  cartCount,
  onToggleLanguage,
  onOpenAuth,
  onOpenCart,
  onGoHome,
  onGoToProfile,
  onGoToAdmin,
}) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onGoHome} hitSlop={8} style={styles.brand}>
        <Text style={styles.logo}>
          D<Text style={styles.amp}>&</Text>G
        </Text>
      </Pressable>

      <View style={styles.actions}>
        {authenticated ? (
          role === "owner" ? (
            <Pressable
              style={styles.adminHeaderButton}
              onPress={onGoToAdmin || onGoHome}
              accessibilityLabel="Admin Dashboard"
            >
              <LayoutDashboard size={14} color="#FFF" />
              <Text style={styles.adminHeaderText}>Dashboard</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.userHeaderButton}
              onPress={onGoToProfile}
              accessibilityLabel="User profile"
            >
              <CircleUserRound size={15} color={colors.primary} />
              <Text style={styles.userHeaderText}>
                {user?.initials || "AM"}
              </Text>
            </Pressable>
          )
        ) : (
          <Pressable style={styles.signInButton} onPress={onOpenAuth}>
            <LogIn size={14} color="#FFF" />
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.iconButtonWithText}
          onPress={onToggleLanguage}
          accessibilityLabel="Toggle language"
        >
          <Languages size={15} color={colors.primary} />
          <Text style={styles.languageText}>{language.toUpperCase()}</Text>
        </Pressable>

        <Pressable
          style={styles.iconButton}
          accessibilityLabel="Notifications"
        >
          <Bell size={17} color={colors.primary} />
          <View style={styles.notificationDot} />
        </Pressable>

        {role !== "owner" && (
          <Pressable
            style={[styles.iconButton, styles.cartButton]}
            onPress={onOpenCart}
            accessibilityLabel="Shopping cart"
          >
            <ShoppingBag size={17} color={colors.primary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    paddingVertical: 4,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  amp: {
    color: colors.accent,
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "400",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adminHeaderButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  adminHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  userHeaderButton: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userHeaderText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  signInButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  signInText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  iconButtonWithText: {
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  languageText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartButton: {
    backgroundColor: colors.surfaceAlt,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  cartBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
})
