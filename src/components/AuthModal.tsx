import React, { useState } from "react"
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react-native"
import { AuthMode, Language } from "../types"
import { colors } from "../theme/colors"

type AuthModalProps = {
  visible: boolean
  language: Language
  checkoutPrompt?: boolean
  onClose: () => void
  onAuthenticate: (params: {
    email: string
    password?: string
    name?: string
    mode: AuthMode
  }) => Promise<void> | void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  language,
  checkoutPrompt,
  onClose,
  onAuthenticate,
}) => {
  const [mode, setMode] = useState<AuthMode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("owner@dgmarket.rw")
  const [password, setPassword] = useState("market123")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // Password Recovery Demo States
  const [recoverStep, setRecoverStep] = useState<1 | 2 | 3>(1)
  const [otpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    const cleanEmail = email.trim()
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.")
      return
    }

    if (mode === "recover") {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        if (recoverStep === 1) {
          setRecoverStep(2)
          setSuccess("Verification code sent to " + cleanEmail + "! (Demo OTP: 8492)")
        } else if (recoverStep === 2) {
          if (otpCode.trim() !== "8492" && otpCode.trim().length !== 4) {
            setError("Invalid code. Please enter the 4-digit code (8492).")
            return
          }
          setRecoverStep(3)
          setSuccess("Code verified successfully! Now enter your new password.")
        } else if (recoverStep === 3) {
          if (newPassword.length < 4) {
            setError("New password must be at least 4 characters.")
            return
          }
          if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please try again.")
            return
          }
          setPassword(newPassword)
          setSuccess("Password updated successfully! Switching to sign in...")
          setTimeout(() => {
            setMode("login")
            setRecoverStep(1)
            setOtpCode("")
            setNewPassword("")
            setConfirmPassword("")
            setSuccess("")
          }, 1500)
        }
      }, 600)
      return
    }

    if (password.length < 4) {
      setError("Password must contain at least 4 characters.")
      return
    }

    if (mode === "register" && name.trim().length < 2) {
      setError("Please enter your full name.")
      return
    }

    setLoading(true)
    try {
      await onAuthenticate({
        email: cleanEmail,
        password,
        name: name.trim(),
        mode,
      })
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Hero Banner */}
          <View style={styles.heroBanner}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={18} color="#FFF" />
            </Pressable>

            <View style={styles.brandRow}>
              <Text style={styles.heroBrand}>
                D<Text style={styles.heroAmp}>&</Text>G{" "}
                <Text style={styles.heroSubBrand}>MARKET</Text>
              </Text>
              <View style={styles.pillBadge}>
                <Sparkles size={11} color={colors.accentAmber} />
                <Text style={styles.pillBadgeText}>Rwanda</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>
              {mode === "register"
                ? "Create your\naccount."
                : mode === "recover"
                ? recoverStep === 1
                  ? "Recover your\naccount."
                  : recoverStep === 2
                  ? "Verify OTP\ncode."
                  : "Set your new\npassword."
                : "Welcome back,\nplease sign in."}
            </Text>
            <Text style={styles.heroSub}>
              {mode === "recover"
                ? "Secure password recovery demo with verification code & instant password update."
                : "Access your saved favorites, track orders, and manage your account seamlessly."}
            </Text>
          </View>

          {/* Form Panel */}
          <ScrollView
            contentContainerStyle={styles.formPanel}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {checkoutPrompt && (
              <View style={styles.promptBox}>
                <Sparkles size={16} color={colors.primary} />
                <Text style={styles.promptText}>
                  Please sign in to proceed with your order checkout.
                </Text>
              </View>
            )}

            <Text style={styles.kicker}>
              {mode === "register"
                ? "NEW ACCOUNT"
                : mode === "recover"
                ? `PASSWORD RECOVERY • STEP ${recoverStep} OF 3`
                : "CREDENTIALS"}
            </Text>

            <Text style={styles.formTitle}>
              {mode === "register"
                ? "Create Account"
                : mode === "recover"
                ? recoverStep === 1
                  ? "Find Account"
                  : recoverStep === 2
                  ? "Enter Verification Code"
                  : "New Password"
                : "Sign In"}
            </Text>

            {mode === "register" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full name</Text>
                <View style={styles.inputContainer}>
                  <UserPlus size={18} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Diane Gasana"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            {/* Email Field (Visible in login, register, and recover Step 1) */}
            {(mode !== "recover" || recoverStep === 1) && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputContainer}>
                  <Mail size={18} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>
            )}

            {/* Password Field (Visible in login and register) */}
            {mode !== "recover" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <LockKeyhole size={18} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>
            )}

            {/* Password Recovery Step 2: OTP Code */}
            {mode === "recover" && recoverStep === 2 && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>4-Digit Verification Code</Text>
                <View style={styles.inputContainer}>
                  <ShieldCheck size={18} color={colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter code (e.g. 8492)"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otpCode}
                    onChangeText={setOtpCode}
                  />
                </View>
                <Text style={styles.hintText}>
                  💡 Demo Hint: Type code <Text style={{ fontWeight: "800" }}>8492</Text> to verify.
                </Text>
              </View>
            )}

            {/* Password Recovery Step 3: New Password */}
            {mode === "recover" && recoverStep === 3 && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputContainer}>
                    <KeyRound size={18} color={colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter new password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View style={styles.inputContainer}>
                    <LockKeyhole size={18} color={colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm new password"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>
                </View>
              </>
            )}

            {error ? (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={colors.dangerText} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {success ? (
              <View style={styles.successBox}>
                <CheckCircle2 size={16} color={colors.successText} />
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            {mode === "login" && (
              <Pressable
                onPress={() => {
                  setError("")
                  setSuccess("")
                  setMode("recover")
                  setRecoverStep(1)
                }}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            )}

            {mode === "recover" && (
              <Pressable
                onPress={() => {
                  setError("")
                  setSuccess("")
                  setMode("login")
                  setRecoverStep(1)
                }}
                style={styles.backToLoginButton}
              >
                <ArrowLeft size={14} color={colors.primary} />
                <Text style={styles.backToLoginText}>Back to Sign In</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === "recover"
                    ? recoverStep === 1
                      ? "Send Verification Code (OTP)"
                      : recoverStep === 2
                      ? "Verify Code"
                      : "Save New Password"
                    : mode === "register"
                    ? "Create account"
                    : "Sign in"}
                </Text>
              )}
            </Pressable>

            {mode !== "recover" && (
              <View style={styles.switchModeRow}>
                <Text style={styles.switchModeText}>
                  {mode === "register"
                    ? "Already have an account?"
                    : "New to D&G Market?"}
                </Text>
                <Pressable
                  onPress={() => {
                    setError("")
                    setSuccess("")
                    setMode(mode === "register" ? "login" : "register")
                  }}
                >
                  <Text style={styles.switchModeLink}>
                    {mode === "register" ? " Sign in" : " Create account"}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 26,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingRight: 40,
  },
  heroBrand: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroAmp: {
    color: colors.accentAmber,
    fontStyle: "italic",
    fontWeight: "400",
  },
  heroSubBrand: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginLeft: 6,
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillBadgeText: {
    color: colors.accentAmber,
    fontSize: 9,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  heroSub: {
    color: "rgba(255, 255, 255, 0.76)",
    fontSize: 12,
    lineHeight: 18,
    maxWidth: "92%",
  },
  formPanel: {
    padding: 22,
    paddingBottom: 40,
  },
  promptBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surfaceWarm,
    padding: 13,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  promptText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    lineHeight: 17,
  },
  kicker: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 13,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerLight,
    padding: 11,
    borderRadius: 11,
    marginTop: 6,
    marginBottom: 8,
  },
  errorText: {
    color: colors.dangerText,
    fontSize: 11,
    fontWeight: "600",
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.successLight,
    padding: 11,
    borderRadius: 11,
    marginTop: 6,
    marginBottom: 8,
  },
  successText: {
    color: colors.successText,
    fontSize: 11,
    fontWeight: "600",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 12,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
  },
  hintText: {
    fontSize: 11,
    color: colors.accent,
    marginTop: 6,
    fontWeight: "600",
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 12,
  },
  backToLoginText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  submitButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  switchModeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  switchModeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  switchModeLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
  },
})
