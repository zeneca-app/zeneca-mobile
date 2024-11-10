import { STOCKS } from "@/constants/stocks";
import {
  currencyFormatter,
  formatNumber,
  percentageFormatter,
} from "@/utils/currencyUtils";
import BigNumber from "bignumber.js";
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
        <Text className="text-gray-50 text-caption-xl">
          {formatNumber(order.amount, 6, order.precision || 6)}
        </Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
        <Text className="text-gray-10 text-caption-xl">
          {currencyFormatter(order.equity, 2, order.precision || 6)}
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
