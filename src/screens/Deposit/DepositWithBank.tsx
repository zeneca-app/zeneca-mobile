import CopyIcon from "@/assets/copy.svg";
import LoggedLayout from "@/components/LoggedLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DepositWithBank = () => {
  const { t } = useTranslation();

  cssInterop(CopyIcon, { className: "style" });

  return (
    <LoggedLayout>
      <Text className="text-heading-s text-gray-10 px-layout pb-layout-l pt-layout-s">
        {t("depositWithBank.title")}
      </Text>

      <ScrollView className="flex-1 px-layout">
        <View className="text-center flex gap items-center pt-layout-l px-layout-l">
          <Ionicons name="construct" size={48} color="white" />
          <Text className="text-body-s text-dark-content-white text-center">
            {t("comingSoon.title")}
          </Text>

          <Text className="text-caption-xl text-gray-50 text-center">
            {t("comingSoon.subtitle")}
          </Text>
        </View>
      </ScrollView>
    </LoggedLayout>
  );
};

DepositWithBank.displayName = "DepositWithBank";

export default DepositWithBank;
