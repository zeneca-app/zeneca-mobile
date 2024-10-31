import USDC_ICON from "@/assets/usdc.svg";
import {
  Country,
  customersGetBalance,
  QuoteRead,
  quotesCreateQuote,
} from "@/client";
import useQuoteStore from "@/storage/quoteStore";
import useRecipientStore from "@/storage/recipientStore";
import { CURRENCY_BY_COUNTRY } from "@/utils/currencyUtils";
import {
  formatQuoteToCurrency,
  formatQuoteToNumber,
  Quote,
} from "@/utils/quote";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  convertIso3ToIso2,
  ISO3,
} from "@trustedshops-public/js-iso3166-converter";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

const QuoteScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [amount, setAmount] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [quoteRaw, setQuoteRaw] = useState<Quote | null>(null);
  const [quoteFormatted, setQuoteFormatted] = useState<Quote | null>(null);

  const { setQuote } = useQuoteStore((state) => ({
    setQuote: state.setQuote,
  }));

  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: customersGetBalance,
  });
  const customerBalance = balance?.data?.balance || 0;

  const { recipient } = useRecipientStore((state) => ({
    recipient: state.recipient,
  }));

  const currencySelected = CURRENCY_BY_COUNTRY[recipient?.country as Country];
  const currency =
    CURRENCY_BY_COUNTRY[recipient?.country as Country].toUpperCase();

  const mutation = useMutation({
    mutationFn: () =>
      quotesCreateQuote({
        body: {
          source: "usdc.polygon",
          destination: currencySelected,
          amount_in: amount,
          recipient_id: recipient?.id,
          payment_rail: "ach",
        },
      }),
    onSuccess: (data) => {
      const quoteRaw = formatQuoteToNumber(data.data as QuoteRead);
      const quoteFormatted = formatQuoteToCurrency(data.data as QuoteRead);

      setAmountOut(quoteFormatted.amount_out);
      setQuoteRaw(quoteRaw);
      setQuoteFormatted(quoteFormatted);
      setQuote(quoteRaw);
    },
    onError: (error) => {
      console.log("error quote", error);
    },
  });

  const debouncedMutation = useCallback(
    debounce((value: string) => {
      if (Number(value) > 10) {
        mutation.mutate();
      }
    }, 500), // 500ms delay
    [mutation],
  );

  const handleAmountChange = async (text: string) => {
    // Remove any non-numeric characters except for the decimal point
    const cleanedText = text.replace(/[^0-9.]/g, "");
    // Remove leading zeros
    const withoutLeadingZeros = cleanedText.replace(/^0+(?=\d)/, "");
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
    if (!canSend) return;
    navigation.navigate("QuoteConfirmation");
  };

  const enoughBalance = Number(amount) <= Number(customerBalance);
  const canSend =
    enoughBalance && Number(amount) > 0 && Number(quoteRaw?.amount_out) > 0;

  const flag = countryCodeToFlagEmoji(recipient?.country ?? "");
  const countryCode = convertIso3ToIso2(recipient?.country as ISO3);
  const flagImage = `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;

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
                  {recipient?.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.recipientName}>{recipient?.name}</Text>
            </View>
          </View>
          <View style={styles.balanceCard}>
            <View style={styles.currencyRow}>
              <View style={styles.currencyIconContainer}>
                <USDC_ICON width={30} height={30} />
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
                {`: $${Number(customerBalance).toFixed(2)}`}
              </Text>
            </View>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.currencyRow}>
              <View style={styles.currencyIconContainer}>
                <SvgUri width={30} height={30} uri={flagImage} />
              </View>
              <Text style={styles.currencyCode}>{currency}</Text>
              <Text style={styles.amount}>{amountOut}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              1 USDC = {quoteFormatted?.exchange_rate} {currency}
            </Text>
            <Text style={styles.infoText}>
              {quoteFormatted?.fee} USDC {t("quote.fee")}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {/*  <Text style={styles.arrivalText}>{t("quote.arrival")}</Text> */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canSend && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canSend}
          >
            <Text style={styles.continueButtonText}>{t("quote.continue")}</Text>
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
