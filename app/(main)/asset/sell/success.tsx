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
import { router, useLocalSearchParams } from "expo-router";


const ETFSellSuccess = () => {
  const { asset, amount = 0, quote } = useLocalSearchParams();

  const { t } = useTranslation();

  const handleContinue = () => {
    //reset go back action
    router.replace({
      pathname: "/(main)/home",
    });
  };

  const amountToOrder = formatNumber(amount, 2, 6);

  const etfAmount = new BigNumber(amountToOrder)
    .dividedBy(asset.price)
    .precision(4)
    .toString();

  return (
    <LoggedLayout wrapperClasses=" h-24" navLeft={<></>}>
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
              {t("etfSell.success.title")}
            </Text>
            <Text className="body-s text-gray-50 text-center px-layout">
              <Trans
                i18nKey="etfSell.success.summary"
                values={{
                  etf_amount: etfAmount,
                  etf_symbol: asset.symbol,
                  display_name: asset.name,
                  symbol: asset.symbol,
                  amount: amountToOrder,
                  etf_price: quote.asset_price,
                }}
                components={[
                  <Text
                    className="body-s text-white font-bold"
                    numberOfLines={1}
                  ></Text>,
                  <Text
                    className="body-s text-white font-bold"
                    numberOfLines={1}
                  >
                    segment2
                  </Text>,
                  <Text
                    className="body-s text-white font-bold"
                    numberOfLines={1}
                  >
                    segment3
                  </Text>,
                  <Text
                    className="body-s text-white font-bold"
                    numberOfLines={1}
                  >
                    segment3
                  </Text>,
                ]}
              />
            </Text>
          </View>
        </View>

        <View className="px-layout">
          <Button className="" onPress={handleContinue}>
            <Text className="button-m">
              {t("etfSell.success.done_button")}
            </Text>
          </Button>
        </View>
      </View>
    </LoggedLayout>
  );
};

ETFSellSuccess.displayName = "ETFSellSuccess";

export default ETFSellSuccess;
