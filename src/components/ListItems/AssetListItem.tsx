import { STOCKS } from "@/constants/stocks";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { AssetPrice } from "@/client/";


export type AssetListItemProps = {
  asset: AssetPrice;
};

const AssetListItem = ({ asset }: AssetListItemProps) => {
  const navigation = useNavigation();

  const Logo = STOCKS?.[asset.symbol as keyof typeof STOCKS]?.logo;

  const handlePress = () => {
    navigation.navigate("ETFDetail", { asset });
  };

  return (
    <TouchableOpacity className="flex-row gap-3" onPress={handlePress}>
      <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
        <Logo style={{ height: "100%", width: "100%" }} />
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 caption-xl">{asset.display_name}</Text>
        <Text className="text-gray-50 caption-xl">{asset.symbol}</Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
        <Text className="text-gray-10 caption-xl">
          {currencyFormatter(asset.price)}
        </Text>
        {/*         <Text
          className={`caption-xl ${increased ? "text-semantic-success" : "text-red-20"}`}
        >
          {percentageFormatter(etf.change_percent)}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
};

AssetListItem.displayName = "AssetListItem";

export default AssetListItem;
