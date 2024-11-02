import useStockDetails from "@/hooks/useStockDetails";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export type OrderListItemProps = {
  order: {
    amount: string;
    change_percent: string;
    equity: string;
    symbol: string;
  };
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const { isLoading, stock } = useStockDetails({
    symbol: order.symbol,
  });

  const increased = !order.change_percent.includes("-");

  const symbolName = stock?.name || order.symbol;

  //console.log(stock?.logo);

  return (
    <View className="flex-row gap-3">
      <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
        {!isLoading && (
          <Image source={stock?.logo} contentFit="contain" transition={300} />
        )}
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 text-caption-xl">{symbolName}</Text>
        <Text className="text-gray-50 text-caption-xl">{order.amount}</Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
        <Text className="text-gray-10 text-caption-xl">
          {currencyFormatter(order.equity)}
        </Text>
        <Text
          className={`text-caption-xl ${increased ? "text-semantic-success" : "text-red-20"}`}
        >
          {percentageFormatter(order.change_percent)}
        </Text>
      </View>
    </View>
  );
};

OrderListItem.displayName = "OrderListItem";

export default OrderListItem;
