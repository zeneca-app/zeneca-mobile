import { useEffect } from "react";
import Button from "@/components/Button";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import { currencyFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { View } from "react-native";
import { ordersCreateQuoteOrderMutation } from "@/client/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEmbeddedWallet } from "@privy-io/expo";
import { Address } from "viem";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { useChainStore } from "@/storage/chainStore";
import { createOrder } from "@/lib/dinari";
import { OrderQuote } from "@/client";



const ETFPurchaseConfirmation = ({ route }) => {
  const { etf, amount = 0 } = route.params;

  const { t } = useTranslation();
  const wallet = useEmbeddedWallet();
  const { chain } = useChainStore();
  const navigation = useNavigation();

  const Logo = STOCKS?.[etf.symbol as keyof typeof STOCKS]?.logo || null;
  const [quote, setQuote] = useState<OrderQuote | null>(null);

  const { mutate: createQuote, isPending } = useMutation({
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
      if (!quote) {
        throw new Error("Quote not found");
      }

      const signerAddress = wallet?.account?.address as Address;
      const smartAccountClient = await getPimlicoSmartAccountClient(
        signerAddress,
        chain,
        wallet,
      );
      const transactions = await createOrder(quote, smartAccountClient);
      const tx = await smartAccountClient.sendTransactions({ transactions: transactions });
      console.log("tx", tx);
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
      }
    });
  }, [createQuote]);

  const etfAmount = new BigNumber(amount)
    .dividedBy(etf.price)
    .precision(4)
    .toString();


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
          {currencyFormatter(amount)}
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
            {currencyFormatter(etf.price)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-s">
          <Text className="text-caption-l text-gray-50">
            {t("etfPurchase.fee")}
          </Text>
          <Text className="text-caption-xl text-dark-content-white">
            {currencyFormatter(quote?.fee ?? 0)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-s">
          <Text className="text-caption-l text-gray-50">
            {t("etfPurchase.total")}
          </Text>
          <Text className="text-caption-xl text-dark-content-white">
            {currencyFormatter(quote?.total ?? 0)}
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
              amount: amount,
              etf_price: etf.price,
            }}
            components={[
              <Text className="text-caption-l text-white font-bold">

              </Text>,
              <Text className="text-caption-l text-white font-bold">
                segment2
              </Text>,
              <Text className="text-caption-l text-white font-bold">
                segment3
              </Text>,
              <Text className="text-caption-l text-white font-bold">
                segment3
              </Text>,
            ]}
          />
        </Text>
      </View>
      <View className="px-layout">
        <Button className="" onPress={executeTransaction} disabled={isPending || !quote} >
          <Text className="text-button-m">{t("etfPurchase.confirm")}</Text>
        </Button>
      </View>
    </LoggedLayout>
  );
};

ETFPurchaseConfirmation.displayName = "ETFPurchaseConfirmation";

export default ETFPurchaseConfirmation;
