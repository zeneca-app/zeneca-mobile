import Button from "@/components/Button";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import BigNumber from "bignumber.js";
import { cssInterop } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const ETFPurchaseSuccess = ({ route }) => {
  const { etf, amount = 0 } = route.params;

  const navigation = useNavigation();

  const { t } = useTranslation();

  const handleContinue = () => {
    //reset go back action
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <LoggedLayout
      wrapperClasses=" h-24"
      navLeft={
        <View className="w-14 h-14 border border-solid border-semantic-success rounded-full flex justify-center items-center">
          <Ionicons name="checkmark" size={24} color="#04AE92" />
        </View>
      }
    >
      <View className="flex flex-1 pb-layout">
        <Text className="text-heading-s text-gray-10 px-layout">
          {t("etfPurchase.success.title")}
        </Text>
        <View className="flex flex-row items-center justify-start gap-s px-layout">
          <Text className="text-body-s text-gray-50">
            {t("etfPurchase.success.subtitle")}
          </Text>
        </View>
      </View>
      <View className="px-layout">
        <Button className="" onPress={handleContinue}>
          <Text className="text-button-m">
            {t("etfPurchase.success.done_button")}
          </Text>
        </Button>
      </View>
    </LoggedLayout>
  );
};

ETFPurchaseSuccess.displayName = "ETFPurchaseSuccess";

export default ETFPurchaseSuccess;
