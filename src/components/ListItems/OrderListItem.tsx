import { STOCKS } from "@/constants/stocks";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { Text, View } from "react-native";
import BigNumber from "bignumber.js";
export type OrderListItemProps = {
  order: {
    amount: string;
    change_percent: string;
    equity: string;
    symbol: string;
  };
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const Logo = STOCKS?.[order.symbol as keyof typeof STOCKS]?.logo || null;

  const increased = !order.change_percent.includes("-");

  const symbolName =
    STOCKS?.[order.symbol as keyof typeof STOCKS]?.name || order.symbol;

  return (
    <View className="flex-row gap-3">
      <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
        <Logo style={{ height: "100%", width: "100%" }} />
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 text-caption-xl">{symbolName}</Text>
        <Text className="text-gray-50 text-caption-xl">{new BigNumber(order.amount).dividedBy(1_000_000).toString()}</Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
        <Text className="text-gray-10 text-caption-xl">
          {currencyFormatter(
            new BigNumber(order.equity)
              .dividedBy(1_000_000)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toString()
          )}
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
