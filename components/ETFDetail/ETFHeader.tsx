import React from 'react';
import { View } from 'react-native';
import Text from '@/components/Text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { STOCKS } from '@/constants/stocks';
import { currencyFormatter, percentageFormatter } from '@/utils/currencyUtils';
import { SkeletonView } from '@/components/Loading/SkeletonLoadingView';
import COLORS from '@/constants/colors';
import { AssetPrice } from '@/client';

interface ETFHeaderProps {
  asset: AssetPrice;
  price: string;
  chartLoading: boolean;
  change: {
    percentage: number;
    increase: boolean;
  };
  isCursorActive?: boolean;
}

const ETFHeader: React.FC<ETFHeaderProps> = ({
  asset,
  price,
  chartLoading,
  change,
  isCursorActive = false
}) => {
  const stockLogoExists = asset?.symbol &&
    STOCKS &&
    STOCKS[asset.symbol as keyof typeof STOCKS]?.logo;
  const renderLogo = () => {
    if (stockLogoExists) {
      // Use the stock logo from constants
      const Logo = STOCKS[asset.symbol as keyof typeof STOCKS].logo;
      return <Logo style={{ height: "100%", width: "100%" }} />;
    } /* else if (hasLogoUrl) {
      // Use the logo URL from the asset
      return (
        <Image
          source={{ uri: asset.logo_url }}
          style={{ height: "100%", width: "100%" }}
          resizeMode="contain"
          // Add error handling for image loading failures
          onError={() => console.log(`Failed to load image for ${asset.symbol}`)}
        />
      );
    } */ else {
      // Fallback when no logo is available
      return (
        <View className="items-center justify-center w-full h-full bg-gray-80">
          <Text className="text-gray-40 text-lg font-bold">
            {asset.symbol?.[0] || "?"}
          </Text>
        </View>
      );
    }
  };

  const priceDisplayed = price
    ? currencyFormatter(price, 2, 0, true)
    : "0.00";

  return (
    <>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
          {renderLogo()}
        </View>
        <Text className="text-gray-50 caption-xl flex-1">
          {asset.symbol}
        </Text>
      </View>
      <Text
        className="heading-m text-gray-10 px-layout"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {asset.display_name}
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