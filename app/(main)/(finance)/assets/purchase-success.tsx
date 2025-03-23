import GradientCircle from "@/assets/green-gradient-circle.svg";
import Button from "@/components/Button";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { formatNumber } from "@/utils/currencyUtils";
import BigNumber from "bignumber.js";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { View } from "react-native";
import AssetLogo from '@/components/AssetLogo';
import { router } from "expo-router";
import { useTransactionStore } from "@/storage/transactionStore";

// Extracted calculation utilities
export const calculateAmount = (amount: number, price: number) => {
  return new BigNumber(amount)
    .dividedBy(price)
    .precision(4)
    .toString();
};

// Extracted SuccessSummary component
const SuccessSummary = ({
  amount,
  symbol,
  name,
  price,
  t
}: {
  amount: string;
  symbol: string;
  name: string;
  price: string;
  t: (key: string) => string;
}) => (
  <Text className="body-s text-gray-50 text-center px-layout">
    <Trans
      i18nKey="etfPurchase.success.summary"
      values={{
        etf_amount: amount,
        etf_symbol: symbol,
        display_name: name,
        symbol: symbol,
        amount: amount,
        etf_price: price,
      }}
      components={[
        <Text className="body-s text-white font-bold" numberOfLines={1} />,
        <Text className="body-s text-white font-bold" numberOfLines={1} />,
        <Text className="body-s text-white font-bold" numberOfLines={1} />,
        <Text className="body-s text-white font-bold" numberOfLines={1} />,
      ]}
    />
  </Text>
);

// Main component with props for testing
const PurchaseSuccess = ({
  transactionStore = useTransactionStore,
  navigator = router,
  formatNumberFn = formatNumber,
  calculateAmountFn = calculateAmount,
}) => {
  const { asset, amount = 0, quote } = transactionStore((state) => state);
  const { t } = useTranslation();

  const goToHome = () => {
    console.log('goToHome');
    router.replace('/(main)/home');
  }

  const handleContinue = () => {
    goToHome();
  };

  const formattedAmount = formatNumberFn(amount, 2, 6);
  const effectivePrice = quote?.asset_price || asset?.price;
  const etfAmount = calculateAmountFn(Number(formattedAmount), Number(effectivePrice));

  // Early return if required data is missing
  if (!asset) {
    return null;
  }

  return (
    <LoggedLayout wrapperClasses="h-24" navLeft={<></>}>
      <View className="flex-1 gap justify-between">
        <View className="relative flex justify-center items-center w-full">
          <GradientCircle className="relative" />
          <View className="absolute flex justify-center items-center">
            <View className="w-16 h-16 bg-gray-90 rounded-full overflow-hidden">
              <AssetLogo symbol={asset.symbol} size="lg" />
            </View>
          </View>
          <View className="absolute flex flex-1 bottom-1 pt-24">
            <Text className="heading-s text-gray-10 px-layout text-center">
              {t("etfPurchase.success.title")}
            </Text>
            <SuccessSummary
              amount={etfAmount}
              symbol={asset.symbol}
              name={asset.name}
              price={effectivePrice || '0'}
              t={t}
            />
          </View>
        </View>

        <View className="px-layout">
          <Button className="" onPress={handleContinue}>
            <Text className="button-m">
              {t("etfPurchase.success.done_button")}
            </Text>
          </Button>
        </View>
      </View>
    </LoggedLayout>
  );
};

PurchaseSuccess.displayName = "PurchaseSuccess";

export default PurchaseSuccess;