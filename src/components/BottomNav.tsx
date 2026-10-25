import React from "react"
import { StyleSheet, Text, View, Pressable } from "react-native"
import {
  Boxes,
  CircleUserRound,
  Home,
  LayoutDashboard,
  PackageCheck,
  Search,
  ShoppingBag,
} from "lucide-react-native"
import { Role, Tab } from "../types"
import { colors } from "../theme/colors"

type BottomNavProps = {
  currentTab: Tab
  role: Role
  cartCount: number
  onSelectTab: (tab: Tab) => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  role,
  cartCount,
  onSelectTab,
}) => {
  const customerTabs = [
    { id: "home" as Tab, Icon: Home, label: "Home" },
    { id: "search" as Tab, Icon: Search, label: "Explore" },
    { id: "cart" as Tab, Icon: ShoppingBag, label: "Bag" },
    { id: "orders" as Tab, Icon: PackageCheck, label: "Orders" },
    { id: "profile" as Tab, Icon: CircleUserRound, label: "Profile" },
  ]

  const ownerTabs = [
    { id: "admin" as Tab, Icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders" as Tab, Icon: PackageCheck, label: "Orders" },
    { id: "search" as Tab, Icon: Boxes, label: "Products" },
    { id: "profile" as Tab, Icon: CircleUserRound, label: "Account" },
  ]

  const tabs = role === "owner" ? ownerTabs : customerTabs

  return (
    <View style={styles.navBar}>
      {tabs.map(({ id, Icon, label }) => {
        const isActive = currentTab === id
        return (
          <Pressable
            key={id}
            style={styles.navItem}
            onPress={() => onSelectTab(id)}
            hitSlop={6}
          >
            {isActive && <View style={styles.activeBar} />}
            <View style={styles.iconWrapper}>
              <Icon
                size={22}
                color={isActive ? colors.primary : colors.textSubtle}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              {id === "cart" && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  navBar: {
    height: 72,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    position: "relative",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
  },
  activeBar: {
    position: "absolute",
    top: 0,
    width: 28,
    height: 3,
    backgroundColor: colors.accent,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSubtle,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: "800",
  },
})
