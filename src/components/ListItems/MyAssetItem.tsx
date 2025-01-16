import { STOCKS } from "@/constants/stocks";
import { currencyFormatter, percentageFormatter, formatNumber } from "@/utils/currencyUtils";
import { Text, View } from "react-native";
import { MyAsset } from "@/client/";
import { SvgUri } from "react-native-svg";


export type MyAssetItemProps = {
  asset: MyAsset;
};

const MyAssetItem = ({ asset }: MyAssetItemProps) => {
  const Logo = STOCKS?.[asset.symbol as keyof typeof STOCKS]?.logo || null;

  
  return (
    <View className="flex-row gap-3 px-layout bg-dark-background-100">
      {/* Logo container with fixed dimensions */}
      <View className="w-12 h-12  rounded-full overflow-hidden flex-shrink-0">
        <Logo style={{ height: "100%", width: "100%" }} />
      </View>
      {/* Name container with flex but constrained */}
      <View className="flex-1 min-w-0 justify-center items-stretch">
        <Text className="text-gray-10 caption-xl">{asset.display_name}</Text>
      </View>
      {/* Price container with fixed width */}
      <View className="flex-shrink-0 justify-center items-end">
        <Text className="text-gray-10 caption-xl"
          numberOfLines={1}>
          {asset.equity_in_usd}
        </Text>
      </View>
    </View>
  );
};

MyAssetItem.displayName = "MyAssetItem";

export default MyAssetItem;
