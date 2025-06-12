import { AssetPrice } from "@/client";
import {
  assetsGetAssetDetailOptions,
  usersMyBalanceOptions,
} from "@/client/@tanstack/react-query.gen";
import AssetLogo from "@/components/AssetLogo";
import Button from "@/components/Button";
import Keypad from "@/components/Keypad";
import SkeletonLoadingView, {
  SkeletonView,
} from "@/components/Loading/SkeletonLoadingView";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import Config from "@/config";
import { STOCKS } from "@/constants/stocks";
import useAssetsStore from "@/storage/assetsStore";
import { currencyFormatter, formatNumber } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type ETFSellScreenProps = {
  route: {
    params: {
      asset: AssetPrice;
    };
  };
};

const ETFSell = ({ route }: ETFSellScreenProps) => {
  const { t } = useTranslation();

  const { asset } = route.params;

  const navigation = useNavigation();

  const [amount, setAmount] = useState<string>("0");

  const { assets } = useAssetsStore((state) => state);

  const currentAsset = assets?.find(
    (currentAsset) => currentAsset.symbol === asset.symbol,
  );

  const assetPrice = asset.price;

  const quantity = currentAsset?.quantity_in_wei
    ? formatNumber(currentAsset?.quantity_in_wei, 9, 18, true)
    : "0.00";

  const totalAmount = quantity
    ? new BigNumber(quantity)
        .multipliedBy(assetPrice)
        .decimalPlaces(2, BigNumber.ROUND_DOWN)
        .toString()
    : "0";

  const hasNumber = Number(amount) > 0;
  const isLessThanAvailable = Number(amount) <= Number(totalAmount);
  const canContinue = hasNumber && isLessThanAvailable;

  const goToConfirmation = () => {
    const adjustedPrice = formatNumber(assetPrice, 2, 0, true);

    const quantityToSell = new BigNumber(amount)
      .dividedBy(adjustedPrice) // Convert dollar amount to ETF units
      .multipliedBy("1000000000000000000") // Convert to wei (18 decimals)
      .decimalPlaces(0, BigNumber.ROUND_DOWN) // Round down to ensure it's a whole number
      .toString();

    navigation.navigate("ETFSellConfirmation", {
      asset,
      amount,
      quantity: quantityToSell,
    });
  };

  return (
    <LoggedLayout
      navCenter={
        <View className="flex-row items-center justify-center gap-s p-2 bg-gray-100 rounded-full">
          <View className="w-6 h-6 bg-gray-90 rounded-full overflow-hidden">
            <AssetLogo symbol={asset.symbol} size="sm" />
          </View>
          <Text className="text-gray-50 caption-xl">{asset.symbol}</Text>
        </View>
      }
    >
      <View className="px-layout flex justify-center items-stretch gap-s flex-1">
        <Text className="caption-l text-center text-gray-50">
          {t("etfPurchase.available")} {totalAmount}
        </Text>
        <View className="flex-row items-center justify-center gap-s">
          <Text className="body-l text-center text-gray-10 leading-tight">
            $
          </Text>
          <Text className="heading-l text-center text-gray-10">{amount}</Text>
        </View>
        <Text className="caption-l text-center text-gray-50">
          {quantity} {asset.symbol}
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
