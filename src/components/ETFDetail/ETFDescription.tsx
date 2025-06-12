import Text from "@/components/Text";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface ETFDescriptionProps {
  displayName: string;
  description: string;
}

const ETFDescription: React.FC<ETFDescriptionProps> = ({
  displayName,
  description,
}) => {
  const { t } = useTranslation();

  return (
    <View className="px-layout pt-layout-l pb-layout-l">
      <Text className="heading-s text-gray-10">
        {t("etfDetail.description")} {displayName}
      </Text>
      <Text className="body-s text-gray-50">{description}</Text>
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
    </View>
  );
};

ETFDescription.displayName = "ETFDescription";
export default ETFDescription;
