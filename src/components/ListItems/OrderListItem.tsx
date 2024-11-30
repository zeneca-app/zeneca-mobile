import { STOCKS } from "@/constants/stocks";
import { currencyFormatter, percentageFormatter, formatNumber } from "@/utils/currencyUtils";
import { Text, View } from "react-native";
import { MyAsset } from "@/client/";
import { SvgUri } from "react-native-svg";


export type OrderListItemProps = {
  order: MyAsset;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const Logo = STOCKS?.[order.symbol as keyof typeof STOCKS]?.logo || null;

  const equity = order.equity
    ? currencyFormatter(order.equity, 2, order.precision, true)
    : "0.00";

  return (
    <View className="flex-row gap-3 px-layout bg-dark-background-100">
      {/* Logo container with fixed dimensions */}
      <View className="w-12 h-12  rounded-full overflow-hidden flex-shrink-0">
        <Logo style={{ height: "100%", width: "100%" }} />
      </View>
      {/* Name container with flex but constrained */}
      <View className="flex-1 min-w-0 justify-center items-stretch">
        <Text className="text-gray-10 text-caption-xl">{order.display_name}</Text>
      </View>
      {/* Price container with fixed width */}
      <View className="flex-shrink-0 justify-center items-end">
        <Text className="text-gray-10 text-caption-xl"
          numberOfLines={1}>
          {equity}
        </Text>
      </View>
    </View>
  );
};

OrderListItem.displayName = "OrderListItem";

export default OrderListItem;
