import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { customersGetBalance } from "../../client";
import useTransactionStore from "../../storage/transactionStore";

const QuoteScreen = () => {
  const [amount, setAmount] = useState("");
  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: customersGetBalance,
  });
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { recipient } = useTransactionStore((state) => ({
    recipient: state.recipient,
  }));
  const copRate = 4183.13;

  const copAmount = useMemo(() => {
    const usdcAmount = parseFloat(amount) || 0;
    return (usdcAmount * copRate).toFixed(2);
  }, [amount, copRate]);

  const handleAmountChange = (text: string) => {
    // Remove any non-numeric characters except for the decimal point
    const cleanedText = text.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = cleanedText.split(".");
    if (parts.length > 2) {
      parts.pop();
    }
    const formattedAmount = parts.join(".");
    setAmount(formattedAmount);
  };

  const handleContinue = () => {
    navigation.navigate("QuoteConfirmation", {
      amount: copAmount,
      recipient: recipient,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.recipientInfo}>
          <View style={styles.recipientInitials}>
            <Text style={styles.initialsText}>
              {recipient.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.recipientName}>{recipient.name}</Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.currencyRow}>
          <View style={styles.currencyIconContainer}>
            <Text style={styles.currencyIcon}>$</Text>
          </View>
          <Text style={styles.currencyCode}>USDC</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#8E8E93"
          />
        </View>
        <View style={styles.availableBalanceContainer}>
          <Text style={styles.availableBalance}>
            {t("quote.available")}
            {`: $${Number(balance?.data?.balance).toFixed(2)}`}
          </Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.currencyRow}>
          <View style={styles.currencyIconContainer}>
            <Text style={styles.currencyIcon}>🇨🇴</Text>
          </View>
          <Text style={styles.currencyCode}>COP</Text>
          <Text style={styles.amount}>{copAmount}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>1 USDC = {copRate.toFixed(2)} COP</Text>
        <Text style={styles.infoText}>{t("quote.fee")} $USDC</Text>
      </View>

      <Text style={styles.arrivalText}>{t("quote.arrival")}</Text>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !amount && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
      //disabled={!amount}
      >
        <Text style={styles.continueButtonText}>{t("quote.continue")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  recipientInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  recipientInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  initialsText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
  },
  recipientName: {
    color: "white",
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    textTransform: "capitalize",
  },
  balanceCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  currencyIcon: {
    color: "white",
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
  },
  currencyCode: {
    color: "white",
    fontSize: 18,
    fontFamily: "Manrope_500Medium",
    marginRight: 8,
  },
  amountInput: {
    color: "white",
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    flex: 1,
    textAlign: "right",
  },
  amount: {
    color: "white",
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    flex: 1,
    textAlign: "right",
  },
  availableBalanceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  availableBalance: {
    color: "#95929F",
    fontSize: 14,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  arrivalText: {
    color: "#8E8E93",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#333",
  },
  continueButtonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
  },
});

export default QuoteScreen;
