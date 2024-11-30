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
      <View className="w-12 h-12  rounded-full overflow-hidden">
        <Logo style={{ height: "100%", width: "100%" }} />
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 text-caption-xl">{order.display_name}</Text>
        {/*  <Text className="text-gray-50 text-caption-xl">{amount}</Text> */}
      </View>
      <View className="flex-1 flex justify-center items-end">
        <Text className="text-gray-10 text-caption-xl">
          {equity}
        </Text>
      </View>
    </View>
  );
};

OrderListItem.displayName = "OrderListItem";

export default OrderListItem;
