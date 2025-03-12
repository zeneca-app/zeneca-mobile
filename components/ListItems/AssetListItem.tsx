import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { AssetPrice } from "@/client/";
import AssetLogo from "@/components/AssetLogo";

export type AssetListItemProps = {
  asset: AssetPrice;
};


const AssetListItem = ({ asset }: AssetListItemProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ETFDetail", { asset });
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
