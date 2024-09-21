import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState, useCallback } from "react";
import { debounce } from 'lodash';
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { customersGetBalance, quotesCreateQuote } from "../../client";

import useTransactionStore from "../../storage/transactionStore";

const QuoteScreen = () => {
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [amountOut, setAmountOut] = useState("0");
  const [fee, setFee] = useState("");

  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: customersGetBalance,
  });

  const navigation = useNavigation();
  const { t } = useTranslation();

  const { recipient } = useTransactionStore((state) => ({
    recipient: state.recipient,
  }));

  const mutation = useMutation({
    mutationFn: () =>
      quotesCreateQuote({
        body: {
          recipient_id: recipient.id,
          amount_in: amount,
          source: "usdc.polygon",
          destination: "cop",
        },
      }),
    onSuccess: (data) => {
      const quote = data.data
      setExchangeRate(((quote?.exchange_rate || 0) / 10000).toFixed(4));
      setAmountOut(((quote?.amount_out || 0) / 100).toFixed(2));
      setFee(((quote?.fee || 0) / 100).toFixed(2));
    },
    onError: (error) => {
      console.log("error", error)
      console.log(error);
    },
  });

  const debouncedMutation = useCallback(
    debounce((value: string) => {
      if (Number(value) > 0) {
        mutation.mutate();
      }
    }, 500), // 500ms delay
    [mutation]
  );

  const handleAmountChange = async (text: string) => {
    // Remove any non-numeric characters except for the decimal point
    const cleanedText = text.replace(/[^0-9.]/g, "");
    // Remove leading zeros
    const withoutLeadingZeros = cleanedText.replace(/^0+(?=\d)/, '');
    // Ensure only one decimal point
    const parts = withoutLeadingZeros.split(".");
    if (parts.length > 2) {
      parts.pop();
    }
    const formattedAmount = parts.join(".");
    const finalAmount = formattedAmount === "" ? "0" : formattedAmount;
    setAmount(finalAmount);

    debouncedMutation(finalAmount);
  };

  const handleContinue = () => {
    navigation.navigate("QuoteConfirmation", {
      amount_in: amount,
      amount_out: amountOut,
      recipient: recipient,
      fee: fee,
    });
  };

  const formattedAmountOut = (currency: string, amount: string) => {
    const currencies: Record<string, string> = {
      "COP": "es-CO",
      "USD": "en-US",
    }
    return new Intl.NumberFormat(currencies[currency], {
      style: 'currency',
      currency: currency, currencyDisplay: "code"
    }).format(
      parseFloat(amount)).replace(currency, '').trim()
  }

  const canSend = Number(amount) <= Number(balance?.data?.balance)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
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
                returnKeyType="done"
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
              <Text style={styles.amount}>
                {formattedAmountOut("COP", amountOut)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>1 USDC = {exchangeRate} COP</Text>
            <Text style={styles.infoText}>{fee} USDC {t("quote.fee")}</Text>
          </View>

        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.arrivalText}>{t("quote.arrival")}</Text>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canSend && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canSend}
          >
            <Text style={styles.continueButtonText}>{canSend ? t("quote.continue") : "not enough balance"}</Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
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
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
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
