import { usersMyBalanceOptions } from "@/client/@tanstack/react-query.gen";
import Button from "@/components/Button";
import Keypad from "@/components/Keypad";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import { currencyFormatter, formatNumber } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import SkeletonLoadingView, {
  SkeletonView,
} from "@/components/Loading/SkeletonLoadingView";
import useAssetsStore from "@/storage/assetsStore";


const ETFSell = ({ route }) => {
  const { t } = useTranslation();

  const { etf } = route.params;

  const navigation = useNavigation();

  const [amount, setAmount] = useState<string>("0");

  const Logo = STOCKS?.[etf.symbol as keyof typeof STOCKS]?.logo || null;

  const { assets } = useAssetsStore((state) => state);
  const asset = assets?.find((asset) => asset.symbol === etf.symbol);

  const quantity = asset?.quantity_in_wei
    ? formatNumber(asset?.quantity_in_wei, 9, 18, true)
    : "0.00";

  const totalAmount = quantity
    ? new BigNumber(quantity)
      .multipliedBy(etf.price)
      .decimalPlaces(2, BigNumber.ROUND_DOWN)
      .toString()
    : "0";

  const amountInEtf = new BigNumber(amount)
    .dividedBy(etf.price)
    .precision(4)
    .toString();

  const hasNumber = Number(amount) > 0;
  const isLessThanAvailable = Number(amount) <= Number(totalAmount);
  const canContinue = hasNumber && isLessThanAvailable;

  const goToConfirmation = () => {
    // const isMaxAmount = Number(amount) === Number(available);
    // const amountToBuy = isMaxAmount
    //   ? new BigNumber(balance?.available || 0).toString()
    //   : new BigNumber(amount).multipliedBy(1_000_000).toString();

    const quantityToSell = new BigNumber(amount)
      .dividedBy(etf.price)  // Convert dollar amount to ETF units
      .multipliedBy('1000000000000000000')  // Convert to wei (18 decimals) using string to maintain precision
      .integerValue(BigNumber.ROUND_DOWN)  // Remove decimals, round down to whole number
      .toString();


    navigation.navigate("ETFSellConfirmation", {
      etf,
      amount,
      quantity: quantityToSell,

    });
  };

  return (
    <LoggedLayout
      navCenter={
        <View className="flex-row items-center justify-center gap-s p-2 bg-gray-100 rounded-full">
          <View className="w-6 h-6 bg-gray-90 rounded-full overflow-hidden">
            <Logo style={{ height: "100%", width: "100%" }} />
          </View>
          <Text className="text-gray-50 caption-xl">{etf.symbol}</Text>
        </View>
      }
    >
      <View className="px-layout flex justify-center items-stretch gap-s flex-1">
        <Text className="caption-l text-center text-gray-50">
          {t("etfPurchase.available")}{" "}
          {totalAmount}
        </Text>
        <View className="flex-row items-center justify-center gap-s">
          <Text className="body-l text-center text-gray-10 leading-tight">
            $
          </Text>
          <Text className="heading-l text-center text-gray-10">
            {amount}
          </Text>
        </View>
        <Text className="caption-l text-center text-gray-50">
          {quantity} {etf.symbol}
        </Text>
      </View>
      <Keypad
        value={amount}
        onChange={setAmount}
        maximun={Number(totalAmount)}
      />
      <View className="px-layout">

        <Button className="" disabled={!canContinue} onPress={goToConfirmation}>
          <Text
            className={`button-m ${!canContinue ? "text-dark-content-30" : "text-dark-content-dark"}`}
          >
            {t("etfPurchase.continue")}
          </Text>
        </Button>

      </View>
    </LoggedLayout>
  );
};

ETFSell.displayName = "ETFSell";

export default ETFSell;