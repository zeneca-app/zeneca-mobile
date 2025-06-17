import BaseIcon from "@/assets/base-logo.svg";
import FaceIdIcon from "@/assets/face-id.svg";
import USDCIcon from "@/assets/usdc.svg";
import { usersMyBalanceOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import LoadingScreen from "@/components/Loading";
import { getPimlicoSmartAccountClient, transferUSDC } from "@/lib/pimlico";
import { useChainStore } from "@/storage/chainStore";
import useRecipientStore from "@/storage/recipientStore";
import useTransferStore from "@/storage/transferStore";
import { colors } from "@/styles/colors";
import { shortenAddress } from "@/utils/address";
import { formatCurrency } from "@/utils/currencyUtils";
import { Ionicons } from "@expo/vector-icons";
import { useEmbeddedWallet } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as LocalAuthentication from "expo-local-authentication";
import * as Sentry from "@sentry/react-native";
import { cssInterop } from "nativewind";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Address } from "viem";

const WithdrawlConfirmationScreen = () => {
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
  const [transactionInitiated, setTransactionInitiated] = useState(false);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { recipientCrypto } = useRecipientStore((state) => ({
    recipientCrypto: state.recipientCrypto,
  }));

  const { transferCrypto, setTxHash } = useTransferStore((state) => ({
    transferCrypto: state.transferCrypto,
    setTxHash: state.setTxHash,
  }));

  const {
    isPending,
    error,
    data: balance,
    refetch: refetchBalance,
  } = useQuery({
    ...usersMyBalanceOptions({
      client: client,
    }),
  });

  const chain = useChainStore((state) => state.chain);
  const wallet = useEmbeddedWallet();

  const amount = transferCrypto?.amount!;
  const recipientAddress = recipientCrypto?.address as Address;

  const executeTransaction = async () => {
    try {
      setTransactionInitiated(true);
      setIsLoadingTransfer(true);

      const signerAddress = wallet?.account?.address as Address;
      if (!signerAddress) throw new Error("No wallet address found");

      const smartAccountClient = await getPimlicoSmartAccountClient(
        signerAddress,
        chain,
        wallet,
      );
      
      const tx = await transferUSDC(
        smartAccountClient,
        amount,
        chain,
        recipientAddress,
      );
      
      setTxHash(tx);

      // Invalidate queries after successful transaction
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["usersMyBalance"] }),
        refetchBalance(),
      ]);

      // Navigate to success screen only on successful transaction
      navigation.navigate("WithdrawlSuccess");
    } catch (error) {
      console.error("Error during transaction:", error);
      Sentry.captureException(error, {
        extra: {
          amount,
          recipientAddress,
          chain: chain.name,
        },
      });
      // TODO: Show error message to user
    } finally {
      setIsLoadingTransfer(false);
      setTransactionInitiated(false);
    }
  };

  const handleCreateTransaction = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("faceId.prompt"),
        fallbackLabel: t("faceId.fallback"),
      });

      if (result.success) {
        executeTransaction();
      } else {
        // Handle authentication failure
        console.log("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const canContinue = !transactionInitiated && !isLoadingTransfer;
  const isLoading = isLoadingTransfer || transactionInitiated;

  return (
    <SafeAreaView className="flex-1 bg-[#0D0C0E]">
      <View className="flex-1 p-4 justify-between">
        <View>
          <Text className="text-[32px] text-white font-[Manrope_500Medium] mb-2">
            {t("sendConfirmation.title")}
          </Text>
          <Text className="text-[32px] font-bold text-[#8E8EFF] mb-1">
            {formatCurrency(amount, "USD")} USDC
          </Text>
          <View className="flex-row items-end">


          </View>
        </View>

        <View className="bg-[#19181B] rounded-[25px] py-[25px] px-5">
          <View className="flex-row justify-between mb-[15px]">
            <Text className="text-[#96939F] font-[Manrope_400Regular] text-[14px]">
              {t("sendConfirmation.total")}
            </Text>
            <Text className="text-base font-[Manrope_700Bold] text-white">
              ${formatCurrency(amount, "USD")}
            </Text>
          </View>
          <View className="flex-row justify-between mb-[15px]">
            <Text className="text-[#96939F] font-[Manrope_400Regular] text-[14px]">
              {t("sendConfirmation.send")} USDC
            </Text>
            <View className="flex-row items-center">
              <USDCIcon width={20} height={20} style={{ marginRight: 8 }} />
              <Text className="text-base font-[Manrope_700Bold] text-white">
                {amount}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-[15px]">
            <Text className="text-[#96939F] font-[Manrope_400Regular] text-[14px]">
              {t("sendConfirmation.fee")}
            </Text>
            <Text className="text-base font-[Manrope_700Bold] text-white">
              0 USDC
            </Text>
          </View>
        </View>

        <View className="items-center">
          <Text className="text-[#666] text-center mb-4 px-5">
            {t("sendConfirmation.disclaimer")}
          </Text>
          <TouchableOpacity
            disabled={!canContinue}
            onPress={handleCreateTransaction}
            className={`flex-row w-full h-[55px] rounded-[25px] justify-center items-center ${canContinue ? "bg-white" : "bg-[rgba(215,191,250,0.17)]"
              }`}
          >
            <FaceIdIcon width={24} height={24} />
            <Text
              className={`ml-2 font-bold ${canContinue
                  ? ""
                  : "text-[rgba(233,220,251,0.45)] text-[18px] font-[Manrope_500Medium]"
                }`}
              style={canContinue ? { color: colors.darkHighlight } : {}}
            >
              {t("sendConfirmation.confirmButtonText")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingScreen
        isVisible={isLoading}
        text={t("sendConfirmation.pendingStatus")}
      />
    </SafeAreaView>
  );
};

export default WithdrawlConfirmationScreen;
