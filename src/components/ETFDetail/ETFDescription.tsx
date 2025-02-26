import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '@/components/Text';
import { AssetPrice } from '@/client';

interface ETFDescriptionProps {
  asset: AssetPrice;
}

const ETFDescription: React.FC<ETFDescriptionProps> = ({ asset }) => {
  const { t } = useTranslation();

  return (
    <View className="px-layout pt-layout-l pb-layout-l">
      <Text className="heading-s text-gray-10">
        {t("etfDetail.description")} {asset.display_name}
      </Text>
      <Text className="body-s text-gray-50">{asset.description}</Text>
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
    </View>
  );
};

export default ETFDescription; 