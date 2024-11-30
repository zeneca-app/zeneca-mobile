import { STOCKS } from "@/constants/stocks";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export type StockListItemProps = {
  etf: {
    id: string;
    price: string;
    display_name: string;
    logo_url: string;
    symbol: string;
    name: string;
    external_id: string;
    description: string;
  };
};

const StockListItem = ({ etf }: StockListItemProps) => {

  const navigation = useNavigation();

  const Logo = STOCKS?.[etf.symbol as keyof typeof STOCKS]?.logo;


  const handlePress = () => {
    navigation.navigate("ETFDetail", { etf });
  };

  return (
    <TouchableOpacity className="flex-row gap-3" onPress={handlePress}>
      <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
        <Logo style={{ height: "100%", width: "100%" }} />
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 text-caption-xl">{etf.display_name}</Text>
        <Text className="text-gray-50 text-caption-xl">{etf.symbol}</Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
        <Text className="text-gray-10 text-caption-xl">
          {currencyFormatter(etf.price)}
        </Text>
        {/*         <Text
          className={`text-caption-xl ${increased ? "text-semantic-success" : "text-red-20"}`}
        >
          {percentageFormatter(etf.change_percent)}
        </Text> */}
      </View>
    </TouchableOpacity>
  );
};

StockListItem.displayName = "StockListItem";

export default StockListItem;
