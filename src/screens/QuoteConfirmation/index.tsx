import FaceIdIcon from "@/assets/face-id.svg";
import {
  Country,
  QuoteRead,
  quotesCreateQuote,
  TransferRead,
  transfersCreateTransfer,
} from "@/client";
import LoadingScreen from "@/components/Loading";
import useQuoteStore from "@/storage/quoteStore";
import useRecipientStore from "@/storage/recipientStore";
import useTransferStore from "@/storage/transferStore";
import {
  CURRENCY_BY_COUNTRY,
  CurrencyCode,
  formatCurrency,
} from "@/utils/currencyUtils";
import { formatQuoteToNumber } from "@/utils/quote";
import { capitalizeFirstLetter } from "@/utils/string_utils";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const QuoteConfirmationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { recipient } = useRecipientStore((state) => ({
    recipient: state.recipient,
  }));

  const { quote, setQuote } = useQuoteStore((state) => ({
    quote: state.quote,
    setQuote: state.setQuote,
  }));

  const { setTransfer } = useTransferStore((state) => ({
    transfer: state.transfer,
    setTransfer: state.setTransfer,
  }));

  const customerId = "0191ddc1-5791-7383-8647-e8b068c8af65"; // TODO: get from customer

  const calculateTimeLeft = () => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeLeft = quote.expires_at - now;
    return timeLeft > 0 ? timeLeft : 0;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  if (!recipient) {
    return null; // or some error UI
  }

  const currency = CURRENCY_BY_COUNTRY[recipient.country as Country].toUpperCase() as CurrencyCode;

  const { mutate: createTransaction, isPending: isTransactionPending } =
    useMutation({
      mutationFn: () =>
        transfersCreateTransfer({
          body: {
            quote_id: quote.id,
            customer_id: customerId,
            recipient_id: recipient.id,
          },
        }),
      onSuccess: async (data) => {
        console.log("transaction created", data.data);
        setTransfer(data.data as TransferRead);

        await new Promise((resolve) => setTimeout(resolve, 20000));
        navigation.navigate("SendSuccess");
      },
      onError: (error) => {
        console.log("error transaction", error);
      },
    });

  const { mutate: createQuote, isPending: isQuotePending } = useMutation({
    mutationFn: () =>
      quotesCreateQuote({
        body: {
          source: "usdc.polygon",
          destination: currency,
          amount_in: quote.amount_in,
          recipient_id: recipient.id,
          payment_rail: "ach",
        },
      }),
    onSuccess: (data) => {
      console.log("quote updated", data.data);
      const quoteRaw = formatQuoteToNumber(data.data as QuoteRead);
      setQuote(quoteRaw);
      setTimeLeft(quoteRaw.expires_at - Math.floor(Date.now() / 1000));
    },
    onError: (error) => {
      console.log("error quote", error);
    },
  });

  const handleCreateTransaction = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("faceId.prompt"),
        fallbackLabel: t("faceId.fallback"),
      });

      if (result.success) {
        createTransaction();
      } else {
        console.log("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      createQuote();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, createQuote]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 p-4">
        <View>
          <Text className="text-2xl font-bold text-white mb-2">
            {t("quoteConfirmation.title")}
          </Text>
          <Text className="text-3xl font-bold text-[#8E8EFF] mb-1">
            {formatCurrency(quote.amount_out, currency as CurrencyCode, true)}
          </Text>
          <Text className="text-2xl text-white mb-4">
            {t("quoteConfirmation.to")}{" "}
            <Text className="text-2xl font-bold text-white">
              {capitalizeFirstLetter(recipient.name)}
            </Text>
          </Text>
        </View>

        <View className="bg-[#1C1C1E] rounded-lg p-4 mb-5">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">
              {t("quoteConfirmation.accountNumber")}
            </Text>
            <Text className="text-white">
              {recipient.external_account?.account_number ?? ""}
            </Text>
          </View>
        </View>

        <View className="bg-[#1C1C1E] rounded-lg p-4 mb-5">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">
              {t("quoteConfirmation.amount")}
            </Text>
            <Text className="text-white">{quote.amount_in} USDC</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">{t("quoteConfirmation.fee")}</Text>
            <Text className="text-white">{quote.fee} USDC</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">
              {t("quoteConfirmation.total")}
            </Text>
            <Text className="text-white">
              {formatCurrency(quote.amount_out, currency as CurrencyCode)}{" "}
              {currency}{" "}
            </Text>
          </View>
        </View>

        <View className="items-center mb-5">
          {!isTransactionPending && (
            <Text className="text-gray-500 mb-4">
              {t("quoteConfirmation.timerDescription")} {formatTime(timeLeft)}
            </Text>
          )}
        </View>

        <View className="items-center">
          <Text className="text-gray-500 text-center mb-4 px-5">
            {t("quoteConfirmation.disclaimer")}
          </Text>
          {!isTransactionPending && (
            <TouchableOpacity
              disabled={isTransactionPending || isQuotePending}
              onPress={handleCreateTransaction}
              className="bg-white rounded-lg p-4 flex-row justify-center items-center w-full"
            >
              <FaceIdIcon width={24} height={24} />
              <Text className="text-black font-bold ml-2">
                {t("quoteConfirmation.confirm")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <LoadingScreen
        isVisible={isTransactionPending}
        text={t("quoteConfirmation.pending")}
      />
    </SafeAreaView>
  );
};

export default QuoteConfirmationScreen;
