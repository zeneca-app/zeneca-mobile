import Button from "@/components/Button";
import Keypad from "@/components/Keypad";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import { currencyFormatter } from "@/utils/currencyUtils";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const ETFPurchaseConfirmation = ({ route }) => {
  const { etf, amount = 0 } = route.params;

  const Logo = STOCKS?.[etf.symbol as keyof typeof STOCKS]?.logo || null;

  const { t } = useTranslation();

  return (
    <LoggedLayout>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
          <Logo style={{ height: "100%", width: "100%" }} />
        </View>
        <Text className="text-gray-50 text-caption-xl flex-1">
          {etf.symbol}
        </Text>
      </View>
      <Text className="text-heading-m text-gray-10 px-layout">{etf.name}</Text>
      <Text className="text-heading-m text-gray-10 px-layout">
        {currencyFormatter(amount)}
      </Text>
    </LoggedLayout>
  );
};

ETFPurchaseConfirmation.displayName = "ETFPurchaseConfirmation";

export default ETFPurchaseConfirmation;
