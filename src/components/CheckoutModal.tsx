import React, { useState } from "react"
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  MapPin,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react-native"
import { PaymentMethod } from "../types"
import { colors } from "../theme/colors"
import { money } from "../data/mockData"

type CheckoutModalProps = {
  visible: boolean
  subtotal: number
  deliveryFee: number
  onClose: () => void
  onSuccess: (orderId: string) => void
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  subtotal,
  deliveryFee,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1)
  const [address, setAddress] = useState("KG 11 Ave, Gasabo")
  const [phone, setPhone] = useState("0788123456")
  const [notes, setNotes] = useState("")
  const [payment, setPayment] = useState<PaymentMethod>("momo")
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)

  const total = subtotal + deliveryFee

  const handleContinue = () => {
    setError("")
    if (address.trim().length < 5) {
      setError("Please enter a complete delivery address.")
      return
    }

    const cleanPhone = phone.replace(/[\s-]/g, "")
    if (!/^07\d{8}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Rwanda phone number (e.g., 0788123456).")
      return
    }

    setStep(2)
  }

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      const orderId = "DG-2084"
      Alert.alert(
        "Order Confirmed!",
        `Thank you! Order ${orderId} has been placed successfully and will be delivered to ${address} in 2–3 business days.`,
        [
          {
            text: "Track Order",
            onPress: () => {
              onClose()
              onSuccess(orderId)
            },
          },
        ],
      )
    }, 850)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>SECURE CHECKOUT</Text>
              <Text style={styles.headerTitle}>
                {step === 1 ? "Delivery details" : "Choose payment"}
              </Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Stepper Progress Indicator */}
          <View style={styles.stepperRow}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepCircleTextActive}>1</Text>
            </View>
            <View
              style={[
                styles.stepLine,
                step === 2 && styles.stepLineActive,
              ]}
            />
            <View
              style={[
                styles.stepCircle,
                step === 2 && styles.stepCircleActive,
              ]}
            >
              <Text
                style={
                  step === 2
                    ? styles.stepCircleTextActive
                    : styles.stepCircleText
                }
              >
                2
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {step === 1 ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Delivery address</Text>
                  <View style={styles.inputContainer}>
                    <MapPin size={18} color={colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="e.g. KG 11 Ave, Gasabo, Kigali"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Contact phone number</Text>
                  <View style={styles.inputContainer}>
                    <Smartphone size={18} color={colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      placeholder="0788123456"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Delivery notes (optional)</Text>
                  <TextInput
                    style={styles.textArea}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Gate code, landmark, or preferred delivery timing..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {error ? (
                  <View style={styles.errorBox}>
                    <AlertCircle size={16} color={colors.dangerText} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Pressable
                  style={styles.primaryButton}
                  onPress={handleContinue}
                >
                  <Text style={styles.primaryButtonText}>Continue to payment</Text>
                  <ChevronRight size={18} color="#FFF" />
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.label}>Select payment method</Text>

                {[
                  {
                    id: "momo" as PaymentMethod,
                    Icon: Smartphone,
                    title: "Mobile Money",
                    subtitle: "MTN MoMo or Airtel Money",
                  },
                  {
                    id: "visa" as PaymentMethod,
                    Icon: CreditCard,
                    title: "Visa Card",
                    subtitle: "Debit or Credit card",
                  },
                  {
                    id: "mastercard" as PaymentMethod,
                    Icon: Wallet,
                    title: "Mastercard",
                    subtitle: "Debit or Credit card",
                  },
                ].map(({ id, Icon, title, subtitle }) => {
                  const isSelected = payment === id
                  return (
                    <Pressable
                      key={id}
                      style={[
                        styles.paymentCard,
                        isSelected && styles.paymentCardSelected,
                      ]}
                      onPress={() => setPayment(id)}
                    >
                      <View
                        style={[
                          styles.paymentIconBox,
                          isSelected && styles.paymentIconBoxSelected,
                        ]}
                      >
                        <Icon size={20} color={colors.accentDark} />
                      </View>
                      <View style={styles.paymentInfo}>
                        <Text style={styles.paymentTitle}>{title}</Text>
                        <Text style={styles.paymentSub}>{subtitle}</Text>
                      </View>
                      <View
                        style={[
                          styles.radioDot,
                          isSelected && styles.radioDotSelected,
                        ]}
                      >
                        {isSelected && <Check size={11} color="#FFF" />}
                      </View>
                    </Pressable>
                  )
                })}

                {/* Total Summary */}
                <View style={styles.totalBox}>
                  <Text style={styles.totalLabel}>Total to pay</Text>
                  <Text style={styles.totalValue}>{money(total)}</Text>
                </View>

                <View style={styles.securityBanner}>
                  <ShieldCheck size={17} color={colors.success} />
                  <Text style={styles.securityText}>
                    Encrypted and protected. Zero stored card details.
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.backButton}
                    onPress={() => setStep(1)}
                  >
                    <ArrowLeft size={16} color={colors.textPrimary} />
                    <Text style={styles.backButtonText}>Back</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.primaryButton,
                      styles.payButton,
                      processing && styles.buttonDisabled,
                    ]}
                    onPress={handlePay}
                    disabled={processing}
                  >
                    {processing ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>
                          Pay {money(total)}
                        </Text>
                        <ChevronRight size={18} color="#FFF" />
                      </>
                    )}
                  </Pressable>
                </View>
              </>
            )}
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
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kicker: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.borderDark,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  stepCircleTextActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.borderDark,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  body: {
    paddingHorizontal: 22,
    paddingBottom: 40,
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
  textArea: {
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 13,
    backgroundColor: "#FFF",
    padding: 12,
    fontSize: 13,
    color: colors.textPrimary,
    textAlignVertical: "top",
    minHeight: 74,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerLight,
    padding: 11,
    borderRadius: 11,
    marginBottom: 12,
  },
  errorText: {
    color: colors.dangerText,
    fontSize: 11,
    fontWeight: "600",
  },
  primaryButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
    marginBottom: 10,
  },
  paymentCardSelected: {
    backgroundColor: "#F7F4ED",
    borderColor: colors.accent,
  },
  paymentIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.surfaceWarm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentIconBoxSelected: {
    backgroundColor: colors.accentLight,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  paymentSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceWarm,
    padding: 15,
    borderRadius: 14,
    marginTop: 6,
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  securityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.successLight,
    padding: 10,
    borderRadius: 11,
    marginBottom: 12,
  },
  securityText: {
    fontSize: 10,
    color: colors.successText,
    fontWeight: "600",
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  backButton: {
    flex: 0.7,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  payButton: {
    flex: 1.3,
  },
})
