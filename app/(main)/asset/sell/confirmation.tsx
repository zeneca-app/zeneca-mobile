import { OrderQuote } from "@/client";
import { ordersCreateQuoteOrderMutation } from "@/client/@tanstack/react-query.gen";
import Button from "@/components/Button";
import { SkeletonView } from "@/components/Loading/SkeletonLoadingView";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { useChainStore } from "@/storage/chainStore";
import { currencyFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from '@sentry/react-native';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { View } from "react-native";
import AssetLogo from '@/components/AssetLogo';
import { router, useLocalSearchParams } from "expo-router";



const ETFSellConfirmation = () => {
  const { asset, quantity, amount  } = useLocalSearchParams();
  
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const { chain } = useChainStore();
  const [transactionInitiated, setTransactionInitiated] = useState(false);

  const [quote, setQuote] = useState<OrderQuote | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);

  const amountDisplayed = amount
    ? currencyFormatter(amount, 2, 0, true)
    : "0.00";

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


      router.push({
        pathname: "/asset/sell/success",
        params: {
          asset: asset.symbol,
          amount: quote?.total_amount.toString(),
          quote,
        },
      });

    } catch (error) {
      console.error("Error during transaction:", error);
      Sentry.captureException(error, {
        extra: {
          etfSymbol: asset.symbol,
          quantity,
          quoteId: quote?.id,
        },
      });
    } finally {
      setTransactionInitiated(false);
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
        side: "SELL",
        order_type: "MARKET",
        quantity: Number(quantity),
      },
    });
  }, [createQuote, asset.id, quantity]);

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
    if (seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const minLeft = formatTimeLeft(timeLeft);

  const etfAmount = new BigNumber(quantity)
    .dividedBy('1000000000000000000')  // Divide by 10^18 to get to base units
    .toFormat(9)  // Format to exactly 9 decimal places
    .toString();

  const isLoading = isQuotePending || transactionInitiated;
  const isDisabled = isQuotePending || !quote || transactionInitiated;
  const showButtonConfirmation = !isQuotePending && quote;

  const feeDisplayed = quote?.fee
    ? currencyFormatter(quote?.fee, 3, 6, true)
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
          <Text className="text-gray-50 caption-xl flex-1">
            {asset.symbol}
          </Text>
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
            {t("etfSell.price")}
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
          <Text className="caption-l text-gray-50">
            {t("etfSell.fee")}
          </Text>
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
            {t("etfSell.total")}
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
            i18nKey="etfSell.disclaimer"
            values={{
              etf_amount: etfAmount,
              etf_symbol: asset.symbol,
              display_name: asset.name,
              symbol: asset.symbol,
              amount: amount,
              etf_price: asset.price,
            }}
            components={[
              <Text className="caption-l text-white font-bold"></Text>,
              <Text className="caption-l text-white font-bold">
                segment2
              </Text>,
              <Text className="caption-l text-white font-bold">
                segment3
              </Text>,
              <Text className="caption-l text-white font-bold">
                segment3
              </Text>,
            ]}
          />
        </Text>

        {isQuotePending ? (
          <SkeletonView className="w-20 h-4" />
        ) : (
          <Text className="caption-l text-gray-50">
            {t("etfSell.timeLeft", { time: minLeft })}
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
            <Text className="button-m">{t("etfSell.confirm")}</Text>
          </Button>
        ) : (
          <SkeletonView className="w-full h-12" />
        )}
      </View>
    </LoggedLayout>
  );
};

ETFSellConfirmation.displayName = "ETFSellConfirmation";

export default ETFSellConfirmation;
