import GradientCircle from "@/assets/green-gradient-circle.svg";
import Button from "@/components/Button";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import { formatNumber } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import BigNumber from "bignumber.js";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { View } from "react-native";
import AssetLogo from '@/components/AssetLogo';

const ETFPurchaseSuccess = ({ route }) => {
  const { etf, amount = 0, quote } = route.params;

  const navigation = useNavigation();

  const { t } = useTranslation();

  const handleContinue = () => {
    //reset go back action
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const amountToOrder = formatNumber(amount, 2, 6);

  const etfAmount = new BigNumber(amountToOrder)
    .dividedBy(etf.price)
    .precision(4)
    .toString();

  return (
    <LoggedLayout wrapperClasses=" h-24" navLeft={<></>}>
      <View className="flex-1 gap justify-between">
        <View className="relative flex justify-center items-center w-full">
          <GradientCircle className="relative" />
          <View className="absolute flex justify-center items-center">
            <View className="w-16 h-16 bg-gray-90 rounded-full overflow-hidden">
              <AssetLogo symbol={etf.symbol} size="lg" />
            </View>
          </View>
          <View className="absolute flex flex-1 bottom-1 pt-24">
            <Text className="heading-s text-gray-10 px-layout text-center">
              {t("etfPurchase.success.title")}
            </Text>
            <Text className="body-s text-gray-50 text-center px-layout">
              <Trans
                i18nKey="etfPurchase.success.summary"
                values={{
                  etf_amount: etfAmount,
                  etf_symbol: etf.symbol,
                  display_name: etf.name,
                  symbol: etf.symbol,
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
              {t("etfPurchase.success.done_button")}
            </Text>
          </Button>
        </View>
      </View>
    </LoggedLayout>
  );
};

ETFPurchaseSuccess.displayName = "ETFPurchaseSuccess";

export default ETFPurchaseSuccess;
