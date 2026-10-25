import React, { useEffect, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { Sparkles } from "lucide-react-native"
import { colors } from "../theme/colors"

const { width } = Dimensions.get("window")

type SplashScreenProps = {
  onFinish?: () => void
  statusText?: string
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  statusText = "Loading D&G Market...",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.85)).current
  const pulseAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    // Fade & scale entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Gentle pulse animation loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    )
    pulseLoop.start()

    return () => {
      pulseLoop.stop()
    }
  }, [fadeAnim, scaleAnim, pulseAnim])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Decorative ambient background glows */}
      <View style={styles.ambientGlowTop} />
      <View style={styles.ambientGlowBottom} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo Graphic */}
        <Animated.View
          style={[
            styles.logoWrapper,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Image
            source={require("../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Brand Typography */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>
            D<Text style={styles.brandAmp}>&</Text>G
          </Text>
          <Text style={styles.brandSubtitle}>MARKET</Text>
        </View>

        {/* Location & Tagline */}
        <View style={styles.pillRow}>
          <Sparkles size={12} color={colors.accentAmber} />
          <Text style={styles.pillText}>Rwamagana, Rwanda</Text>
        </View>

        <Text style={styles.tagline}>
          Everyday essentials, beautifully simple.
        </Text>

        {/* Elegant Loader */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.accentAmber} />
          <Text style={styles.loaderText}>{statusText}</Text>
        </View>
      </Animated.View>

      {/* Footer copyright */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          D&G E-COMMERCE • RWANDA ONLINE RETAIL
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#101915",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
  },
  ambientGlowTop: {
    position: "absolute",
    top: -100,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: "rgba(217, 119, 6, 0.08)",
  },
  ambientGlowBottom: {
    position: "absolute",
    bottom: -150,
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: (width * 1.4) / 2,
    backgroundColor: "rgba(34, 197, 94, 0.05)",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1.5,
    borderColor: "rgba(217, 119, 6, 0.35)",
    marginBottom: 24,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
  },
  brandTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },
  brandAmp: {
    color: colors.accentAmber,
    fontStyle: "italic",
    fontWeight: "400",
  },
  brandSubtitle: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 4,
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.25)",
  },
  pillText: {
    color: colors.accentAmber,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tagline: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 36,
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  loaderText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 30,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
})
