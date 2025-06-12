import { AssetPrice } from "@/client";
import BottomActions from "@/components/BottomActions";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface ETFActionsProps {
  asset: AssetPrice;
  price: string;
  isMarketOpen: boolean;
  isSellAvailable: boolean;
}

const ETFActions: React.FC<ETFActionsProps> = ({
  asset,
  price,
  isMarketOpen,
  isSellAvailable,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <BottomActions>
      <View className="flex-row gap-s px-layout">
        <Button
          className="flex-1"
          onPress={() =>
            navigation.navigate("ETFPurchase", {
              asset,
            })
          }
        >
          <Text className="button-m">{t("etfDetail.buy")}</Text>
        </Button>
        {isSellAvailable && (
          <Button
            className="flex-1"
            onPress={() =>
              navigation.navigate("ETFSell", {
                asset,
              })
            }
          >
            <Text className="button-m">{t("etfDetail.sell")}</Text>
          </Button>
        )}
      </View>
    </BottomActions>
  );
};

export default ETFActions;
