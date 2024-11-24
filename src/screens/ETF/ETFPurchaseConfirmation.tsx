import { OrderQuote } from "@/client";
import { ordersCreateQuoteOrderMutation } from "@/client/@tanstack/react-query.gen";
import Button from "@/components/Button";
import { SkeletonView } from "@/components/Loading/SkeletonLoadingView";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import { createOrder } from "@/lib/dinari";
import { getPimlicoSmartAccountClient, publicClient } from "@/lib/pimlico";
import { useChainStore } from "@/storage/chainStore";
import { currencyFormatter, formatNumber } from "@/utils/currencyUtils";
import { useEmbeddedWallet } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { View } from "react-native";
import { Address } from "viem";

const ETFPurchaseConfirmation = ({ route }) => {
  
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const wallet = useEmbeddedWallet();
  const { chain } = useChainStore();
  const [transactionInitiated, setTransactionInitiated] = useState(false);

  const { etf, amount } = route.params;

  const amountDisplayed = amount
    ? currencyFormatter(amount, 2, 6, true)
    : "0.00";

  const amountToOrder = formatNumber(amount, 2, 6, true);

  const Logo = STOCKS?.[etf.symbol as keyof typeof STOCKS]?.logo || null;
  const [quote, setQuote] = useState<OrderQuote | null>(null);

  const { mutate: createQuote, isPending: isQuotePending } = useMutation({
    ...ordersCreateQuoteOrderMutation(),
    onError: (error) => {
      console.error("Error creating quote:", error);
    },
    onSuccess: (data) => {
      setQuote(data);
    },
  });

  const executeTransaction = async () => {
    try {
      setTransactionInitiated(true);

      const signerAddress = wallet?.account?.address as Address;
      const smartAccountClient = await getPimlicoSmartAccountClient(
        signerAddress,
        chain,
        wallet,
      );
      const transactions = await createOrder(quote!, smartAccountClient);
      const tx = await smartAccountClient.sendTransactions({
        transactions: transactions,
      });
      if (tx) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        queryClient.invalidateQueries({ queryKey: ["usersMyBalance"] });
        queryClient.invalidateQueries({ queryKey: ["usersMyAssets"] });

        navigation.navigate("ETFPurchaseSuccess", {
          etf,
          amount,
          quote,
        });
      }
    } catch (error) {
      console.error("Error during transaction:", error);
    } finally {
      /* navigation.navigate("ETFPurchaseSuccess", {
        etf,
        amount,
      }); */
    }
  };

  useEffect(() => {
    createQuote({
      body: {
        asset_id: etf.id,
        side: "BUY",
        order_type: "MARKET",
        amount: amount.toString(),
      },
    });
  }, [createQuote]);

  const etfAmount = new BigNumber(amountToOrder)
    .dividedBy(etf.price)
    .precision(4)
    .toString();

  const isLoading = isQuotePending || transactionInitiated;
  const isDisabled = isQuotePending || !quote || transactionInitiated;
  const showButtonConfirmation = !isQuotePending && quote;

  const feeDisplayed = quote?.fee
    ? currencyFormatter(quote?.fee, 2, 6, true)
    : "0.00";

  const totalDisplayed = quote?.total
    ? currencyFormatter(quote?.total, 2, 6, true)
    : "0.00";

  return (
    <LoggedLayout>
      <View className="flex pb-layout">
        <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
          <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
            <Logo style={{ height: "100%", width: "100%" }} />
          </View>
          <Text className="text-gray-50 text-caption-xl flex-1">
            {etf.symbol}
          </Text>
        </View>
        <Text className="text-heading-l text-gray-10 px-layout">
          {amountDisplayed}
        </Text>
        <View className="flex flex-row items-center justify-start gap-s px-layout">
          <Text className="text-caption-xl text-gray-50">{etfAmount}</Text>
          <Text className="text-caption-xl text-gray-50">{etf.symbol}</Text>
        </View>
      </View>
      <View className="px-layout pb-layout flex justify-start items-stretch gap flex-1">
        <View className="flex-row items-center justify-between gap-s">
          <Text className="text-caption-l text-gray-50">
            {t("etfPurchase.price")}
          </Text>
          <Text className="text-caption-xl text-dark-content-white">
            ${etf.price}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-s">
          <Text className="text-caption-l text-gray-50">
            {t("etfPurchase.fee")}
          </Text>
          <Text className="text-caption-xl text-dark-content-white">
            {isQuotePending ? (
              <SkeletonView className="w-20 h-4" />
            ) : (
              feeDisplayed
            )}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-s">
          <Text className="text-caption-l text-gray-50">
            {t("etfPurchase.total")}
          </Text>
          <Text className="text-caption-xl text-dark-content-white">
            {isQuotePending ? (
              <SkeletonView className="w-20 h-4" />
            ) : (
              totalDisplayed
            )}
          </Text>
        </View>
        <View className="h-px rounded-full bg-dark-background-100" />
        <Text className="text-caption-l text-gray-50">
          <Trans
            i18nKey="etfPurchase.disclaimer"
            values={{
              etf_amount: etfAmount,
              etf_symbol: etf.symbol,
              display_name: etf.name,
              symbol: etf.symbol,
              amount: amountToOrder,
              etf_price: etf.price,
            }}
            components={[
              <Text className="text-caption-l-bold text-white">segment1</Text>,
              <Text className="text-caption-l-bold text-white">segment2</Text>,
              <Text className="text-caption-l-bold text-white">segment3</Text>,
              <Text className="text-caption-l-bold text-white">segment3</Text>,
            ]}
          />
        </Text>
      </View>
      <View className="px-layout">
        {showButtonConfirmation && (
          <Button
            className=""
            onPress={executeTransaction}
            disabled={isDisabled}
            isLoading={isLoading}
          >
            <Text className="text-button-m">{t("etfPurchase.confirm")}</Text>
          </Button>
        )}
      </View>
    </LoggedLayout>
  );
};

ETFPurchaseConfirmation.displayName = "ETFPurchaseConfirmation";

export default ETFPurchaseConfirmation;
