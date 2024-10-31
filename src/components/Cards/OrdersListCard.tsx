import ChartArrowUp from "@/assets/chart-arrow-up.svg";
import Card from "@/components/Card";
import { useBalance } from "@/context/BalanceContext";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";

const OrdersListCard = () => {
  const { t } = useTranslation();

  const balance = BigNumber();

  const canTrade = true;

  const hasOrders = false;

  // Component to render if no transactions
  const Empty = ({ canTrade = false }: { canTrade?: boolean }) => (
    <View className="flex-1 justify-center items-center">
      <View className="pb-6">
        <ChartArrowUp className="h-40 w-40" />
      </View>
      <Text className="text-center text-caption-xl text-gray-50">
        {t("ordersListCard.empty_transactions")}
      </Text>
      {canTrade ? (
        <Text className="text-center text-caption-xl text-gray-50">
          {t("ordersListCard.empty_transactions_no_assets")}
        </Text>
      ) : (
        <Text className="text-center text-caption-xl text-gray-50">
          {t("ordersListCard.empty_transactions_no_funds")}
        </Text>
      )}
    </View>
  );

  const OrdersList = () => {};

  return (
    <Card className="flex-1">
      <View className="">
        <Text className="text-caption-xl text-gray-50">
          {t("ordersListCard.myAssets")}
        </Text>
      </View>
      {hasOrders ? <FlatList /> : <Empty canTrade={canTrade} />}
    </Card>
  );
};

OrdersListCard.displayName = "OrdersListCard";

export default OrdersListCard;
