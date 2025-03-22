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
import AssetLogo from '@/components/AssetLogo';
import { AssetPrice } from "@/client/";
import { router } from "expo-router";

type PurchaseScreenProps = {
  route: {
    params: {
      asset: AssetPrice;
    };
  };
};

const Purchase = ({ route }: PurchaseScreenProps) => {
  const { t } = useTranslation();
  const { asset } = route.params;
  const [amount, setAmount] = useState<string>("0");

  const {
    isPending: isBalancePending,
    error: balanceError,
    data: balance,
  } = useQuery({
    ...usersMyBalanceOptions(),
  });

  const available = balance?.available
    ? formatNumber(balance?.available, 2, balance?.precision || 6, true)
    : "0.00";

  const availableDisplayed = balance?.available
    ? currencyFormatter(balance?.available, 2, balance?.precision || 6, true)
    : "0.00";


  const amountInEtf = new BigNumber(amount)
    .dividedBy(asset.price)
    .precision(4)
    .toString();

  const hasNumber = Number(amount) > 0;
  const isLessThanAvailable = Number(amount) <= Number(available);
  const canContinue = !isBalancePending && hasNumber && isLessThanAvailable;

  const goToConfirmation = () => {
    const isMaxAmount = Number(amount) === Number(available);
    const amountToBuy = isMaxAmount
      ? new BigNumber(balance?.available || 0).toString()
      : new BigNumber(amount).multipliedBy(1_000_000).toString();

    router.push({
      pathname: "/assets/purchase-confirmation",
      params: {
        asset: asset.symbol,
        amount: amountToBuy,
      },
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
          {t("etfPurchase.available")}{" "}
          {isBalancePending ? (
            <SkeletonLoadingView className="flex-1">
              <SkeletonView className="w-20 h-4" />
            </SkeletonLoadingView>
          ) : (
            availableDisplayed
          )}
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
          {amountInEtf} {asset.symbol}
        </Text>
      </View>
      <Keypad
        value={amount}
        onChange={setAmount}
        maximun={Number(available)}
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

Purchase.displayName = "Purchase";

export default Purchase;