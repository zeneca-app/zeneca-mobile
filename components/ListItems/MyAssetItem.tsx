import { Text, View } from "react-native";
import { MyAsset } from "@/client/";
import AssetLogo from '@/components/AssetLogo';


export type MyAssetItemProps = {
  asset: MyAsset;
};

const MyAssetItem = ({ asset }: MyAssetItemProps) => {
  return (
    <View className="flex-row gap-3 px-layout bg-dark-background-100">
      {/* Logo container with fixed dimensions */}
      <View className="w-12 h-12  rounded-full overflow-hidden flex-shrink-0">
        <AssetLogo symbol={asset.symbol} size="md" />
      </View>
      {/* Name container with flex but constrained */}
      <View className="flex-1 min-w-0 justify-center items-stretch">
        <Text className="text-gray-10 caption-xl">{asset.display_name}</Text>
      </View>
      {/* Price container with fixed width */}
      <View className="flex-shrink-0 justify-center items-end">
        <Text className="text-gray-10 caption-xl"
          numberOfLines={1}>
          ${asset.equity_in_usd}
        </Text>
      </View>
    </View>
  );
};

MyAssetItem.displayName = "MyAssetItem";

export default MyAssetItem;
