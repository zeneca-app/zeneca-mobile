import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { currencyFormatter, percentageFormatter } from '@/utils/currencyUtils';
import { SkeletonView } from '@/components/Loading/SkeletonLoadingView';
import COLORS from '@/constants/colors';
import AssetLogo from '@/components/AssetLogo';

interface ETFHeaderProps {
  symbol: string;
  display_name: string;
  price: string;
  chartLoading: boolean;
  change: {
    percentage: number;
    increase: boolean;
  };
  isCursorActive?: boolean;
}

const ETFHeader: React.FC<ETFHeaderProps> = ({
  symbol,
  display_name,
  price,
  chartLoading,
  change,
  isCursorActive = false
}) => {

  const priceDisplayed = price
    ? currencyFormatter(price, 2, 0, true)
    : "0.00";

  return (
    <>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
          <AssetLogo symbol={symbol} size="sm" />
        </View>
        <Text className="text-gray-50 caption-xl flex-1">
          {symbol}
        </Text>
      </View>
      <Text
        className="heading-m text-gray-10 px-layout"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {display_name}
      </Text>
      <Text className={`heading-m text-gray-10 px-layout ${isCursorActive ? "text-blue-50" : ""}`}>
        {priceDisplayed}
      </Text>
      <View className="flex-row gap-s pt-layout-s items-center justify-end px-layout">
        {chartLoading ? (
          <SkeletonView className="w-20 h-4" />
        ) : (
          <>
            <Ionicons
              name={change.increase ? "arrow-up" : "arrow-down"}
              size={16}
              color={change.increase ? COLORS.semantic.success : COLORS.gray[30]}
            />
            <Text
              className={`caption-xl ${change.increase ? "text-semantic-success" : "text-gray-30"}`}
            >
              {percentageFormatter(change.percentage)}
            </Text>
          </>
        )}
      </View>
    </>
  );
};

export default ETFHeader; 