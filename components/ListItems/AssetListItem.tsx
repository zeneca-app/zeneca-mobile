import { Text, TouchableOpacity, View } from "react-native";
import { AssetPrice } from "@/client/";
import AssetLogo from "@/components/AssetLogo";
import { useRouter } from "expo-router";

export type AssetListItemProps = {
  asset: AssetPrice;
};

const AssetListItem = ({ asset }: AssetListItemProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/asset/detail",
      params: { 
        asset_id: asset.id,
        serialized_asset: JSON.stringify(asset)
      },
    });
  };

  return (
    <TouchableOpacity className="flex-row gap-3" onPress={handlePress}>
      <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
        <AssetLogo symbol={asset.symbol} size="md" />
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 caption-xl">{asset.display_name}</Text>
        <Text className="text-gray-50 caption-xl">{asset.symbol}</Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
      </View>
    </TouchableOpacity>
  );
};

AssetListItem.displayName = "AssetListItem";

export default AssetListItem;
