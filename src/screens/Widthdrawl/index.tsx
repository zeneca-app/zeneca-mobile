import { usersMyBalanceOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import Keypad from "@/components/KeypadOld";
import { useUserStore } from "@/storage/";
import useRecipientStore from "@/storage/recipientStore";
import useTransferStore from "@/storage/transferStore";
import { colors } from "@/styles/colors";
import { currencyFormatter, formatNumber } from "@/utils/currencyUtils";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Address } from "viem";

const WithdrawlScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setTransferCrypto } = useTransferStore((state) => ({
    transferCrypto: state.transferCrypto,
    setTransferCrypto: state.setTransferCrypto,
  }));
  const [amount, setAmount] = useState("0");
  const [fontSize, setFontSize] = useState(48);
  const { user: storedUser } = useUserStore((state) => state);

  const { recipientCrypto, setRecipientCrypto } = useRecipientStore((state) => ({
    recipientCrypto: state.recipientCrypto,
    setRecipientCrypto: state.setRecipientCrypto,
  }));

  const {
    isPending: isBalancePending,
    error,
    data: balance,
    refetch: refetchBalance,
  } = useQuery({
    ...usersMyBalanceOptions({
      client: client,
    }),
  });


  const zeneca_due_wallet = "0x152c6f25a14c37bee54daf2b99f804896c145e0e";

  const handleKeyPress = (key: string | number) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1) || "0");
    } else if (key === "." && amount.includes(".")) {
      // Prevent multiple decimal points
      return;
    } else {
      setAmount((prev) => (prev === "0" ? String(key) : prev + key));
    }
  };

  useEffect(() => {
    // Adjust font size based on amount length
    if (amount.length > 15) {
      setFontSize(25);
    } else if (amount.length > 10) {
      setFontSize(35);
    } else if (amount.length > 8) {
      setFontSize(48);
    } else {
      setFontSize(60);
    }
  }, [amount]);

  const handleContinue = () => {
   
    if (!canContinue) return;
    setRecipientCrypto({
      name: "Zeneca Wallet",
      address: zeneca_due_wallet as Address,
    });
    setTransferCrypto({
      name: "Zeneca Wallet",
      address: zeneca_due_wallet as Address,
      amount: parseFloat(amount),
      from_address: storedUser?.wallets[0].smart_account_address as Address,
      to_address: zeneca_due_wallet as Address,
    });
    navigation.navigate("WithdrawlConfirmation");
  };

  const available = balance?.available
    ? formatNumber(balance?.available, 2, balance?.precision || 6, true)
    : "0.00";

  const availableDisplayed = balance?.available
    ? currencyFormatter(balance?.available, 2, balance?.precision || 6, true)
    : "0.00";

  const hasNumber = Number(amount) > 0;
  const isLessThanAvailable = Number(amount) <= Number(available);
  const canContinue = !isBalancePending && hasNumber && isLessThanAvailable;

  return (
    <SafeAreaView className="flex-1 bg-[#0D0C0E]">
      <Text className="ml-6 text-3xl text-white mb-4 font-medium">{t("sendCrypto.title")}</Text>
      <View className="flex-1 px-5 justify-between">
        <View className="flex-1 justify-center items-center">
          <View className="flex-row justify-center items-center mb-3">
            <Text className="text-[#96939F] text-sm">
              {t("sendCrypto.availableLabel")}
            </Text>
            <Text className="text-[#96939F] text-sm">
              {" "}
              {availableDisplayed}
            </Text>
          </View>
          <View className="flex-row justify-center items-baseline mb-6 relative">
            <Text className="font-bold text-white absolute -left-5 top-1" style={{ fontSize: fontSize * 0.4 }}>
              $
            </Text>
            <Text className="text-white font-bold" style={{ fontSize }}>
              {amount}
            </Text>
          </View>
          <View className="items-center mb-6">
            <Text
              className={!isLessThanAvailable ? "text-red-500 text-sm" : "text-transparent text-sm"}
            >
              {t("sendCrypto.errorText")}
            </Text>
          </View>
        </View>

        <View className="mt-auto">
          <Keypad onKeyPress={handleKeyPress} />
          <TouchableOpacity
            className={`flex-row w-full h-14 rounded-3xl justify-center items-center mb-6 ${canContinue ? "bg-white" : "bg-[rgba(215,191,250,0.17)]"
              }`}
            onPress={handleContinue}
          >
            <Text
              className={`text-base font-medium ${canContinue
                ? "text-[#0D0C0E]"
                : "text-[rgba(233,220,251,0.45)]"
                }`}
              style={{ color: canContinue ? colors.darkHighlight : undefined }}
            >
              {t("sendCrypto.continueButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WithdrawlScreen;
