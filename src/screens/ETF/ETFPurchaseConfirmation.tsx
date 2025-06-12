import { AssetPrice, OrderQuote } from "@/client";
import { ordersCreateQuoteOrderMutation } from "@/client/@tanstack/react-query.gen";
import AssetLogo from "@/components/AssetLogo";
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
import * as Sentry from "@sentry/react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { View } from "react-native";
import { Address } from "viem";

type ETFPurchaseConfirmationScreenProps = {
  route: {
    params: {
      asset: AssetPrice;
      amount: string;
    };
  };
};
const ETFPurchaseConfirmation = ({
  route,
}: ETFPurchaseConfirmationScreenProps) => {
  const { asset, amount } = route.params;

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const wallet = useEmbeddedWallet();
  const { chain } = useChainStore();
  const [transactionInitiated, setTransactionInitiated] = useState(false);

  const [quote, setQuote] = useState<OrderQuote | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);

  const amountDisplayed = amount
    ? currencyFormatter(amount, 2, 6, true)
    : "0.00";

  const amountToOrder = formatNumber(amount, 2, 6, true);

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
      if (!signerAddress) throw new Error("No wallet address found");
      if (!quote) throw new Error("No quote available");

      const smartAccountClient = await getPimlicoSmartAccountClient(
        signerAddress,
        chain,
        wallet,
      );

      const tx = await smartAccountClient.sendTransactions({
        transactions: quote.transactions,
      });

      if (!tx) throw new Error("Transaction failed to send");

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      if (receipt.status !== "success") {
        throw new Error("Transaction failed");
      }

      // Invalidate queries after successful transaction
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["usersMyBalance"] }),
        queryClient.invalidateQueries({ queryKey: ["usersMyAssets"] }),
      ]);

      navigation.navigate("ETFPurchaseSuccess", {
        asset,
        amount,
        quote,
      });
    } catch (error) {
      console.error("Error during transaction:", error);
      Sentry.captureException(error, {
        extra: {
          symbol: asset.symbol,
          amount,
          quoteId: quote?.id,
        },
      });
    } finally {
      /* navigation.navigate("ETFPurchaseSuccess", {
        etf,
        amount,
      }); */
    }
  };

  const calculateTimeLeft = () => {
    if (!quote) return 0;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeLeft = quote.deadline - now;
    return timeLeft > 0 ? timeLeft : 0;
  };

  const fetchQuote = React.useCallback(() => {
    createQuote({
      body: {
        asset_id: asset.id,
        side: "BUY",
        order_type: "MARKET",
        amount: amount.toString(),
      },
    });
  }, [createQuote, asset.id, amount]);

  // Initial quote fetch
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]); // Add fetchQuote to dependencies

  // Timer management
  useEffect(() => {
    if (!quote) return;

    setTimeLeft(calculateTimeLeft());

    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        fetchQuote();
      }
    };

    const timerId = setInterval(updateTimer, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [quote, fetchQuote]);

  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const minLeft = formatTimeLeft(timeLeft);

  const etfAmount = new BigNumber(amountToOrder)
    .dividedBy(asset.price)
    .precision(4)
    .toString();

  const isLoading = isQuotePending || transactionInitiated;
  const isDisabled = isQuotePending || !quote || transactionInitiated;
  const showButtonConfirmation = !isQuotePending && quote;

  const feeDisplayed = quote?.fee
    ? currencyFormatter(quote?.fee, 2, 6, true)
    : "0.00";

  const totalDisplayed = quote?.total_amount
    ? currencyFormatter(quote?.total_amount, 2, 6, true)
    : "0.00";

  return (
    <LoggedLayout>
      <View className="flex pb-layout">
        <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
          <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
            <AssetLogo symbol={asset.symbol} size="md" />
          </View>
          <Text className="text-gray-50 caption-xl flex-1">{asset.symbol}</Text>
        </View>
        <Text className="heading-l text-gray-10 px-layout">
          {amountDisplayed}
        </Text>
        <View className="flex flex-row items-center justify-start gap-s px-layout">
          <Text className="caption-xl text-gray-50">{etfAmount}</Text>
          <Text className="caption-xl text-gray-50">{asset.symbol}</Text>
        </View>
      </View>
      <View className="px-layout pb-layout flex justify-start items-stretch gap flex-1">
        <View className="flex-row items-center justify-between gap-s">
          <Text className="caption-l text-gray-50">
            {t("etfPurchase.price")}
          </Text>
          <Text className="caption-xl text-dark-content-white">
            {isQuotePending ? (
              <SkeletonView className="w-20 h-4" />
            ) : (
              <>${quote?.asset_price}</>
            )}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-s">
          <Text className="caption-l text-gray-50">{t("etfPurchase.fee")}</Text>
          <Text className="caption-xl text-dark-content-white">
            {isQuotePending ? (
              <SkeletonView className="w-20 h-4" />
            ) : (
              feeDisplayed
            )}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-s">
          <Text className="caption-l text-gray-50">
            {t("etfPurchase.total")}
          </Text>
          <Text className="caption-xl text-dark-content-white">
            {isQuotePending ? (
              <SkeletonView className="w-20 h-4" />
            ) : (
              totalDisplayed
            )}
          </Text>
        </View>
        <View className="h-px rounded-full bg-dark-background-100" />
        <Text className="caption-l text-gray-50">
          <Trans
            i18nKey="etfPurchase.disclaimer"
            values={{
              etf_amount: etfAmount,
              etf_symbol: asset.symbol,
              display_name: asset.name,
              symbol: asset.symbol,
              amount: amountToOrder,
              etf_price: asset.price,
            }}
            components={[
              <Text className="caption-l text-white font-bold"></Text>,
              <Text className="caption-l text-white font-bold">segment2</Text>,
              <Text className="caption-l text-white font-bold">segment3</Text>,
              <Text className="caption-l text-white font-bold">segment3</Text>,
            ]}
          />
        </Text>

        {isQuotePending ? (
          <SkeletonView className="w-20 h-4" />
        ) : (
          <Text className="caption-l text-gray-50">
            {t("etfPurchase.timeLeft", { time: minLeft })}
          </Text>
        )}
      </View>
      <View className="px-layout">
        {showButtonConfirmation ? (
          <Button
            className=""
            onPress={executeTransaction}
            disabled={isDisabled}
            isLoading={isLoading}
          >
            <Text className="button-m">{t("etfPurchase.confirm")}</Text>
          </Button>
        ) : (
          <SkeletonView className="w-full h-12" />
        )}
      </View>
    </LoggedLayout>
  );
};

ETFPurchaseConfirmation.displayName = "ETFPurchaseConfirmation";

export default ETFPurchaseConfirmation;
