import ChartArrowUp from "@/assets/chart-arrow-up.svg";
import { usersMyAssetsOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import Card from "@/components/Card";
import OrderListItem from "@/components/ListItems/OrderListItem"; // Import OrderListItem
import Separator from "@/components/ListItems/Separator";
import { useUserStore } from "@/storage/userStore";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";

const OrdersListCard = () => {
  const { t } = useTranslation();

  const { isPending, error, data, refetch } = useQuery({
    ...usersMyAssetsOptions({
      client: client,
    }),
  });

  const canTrade = true;

  console.log("data", data);

  const hasOrders = data?.length && data?.length > 0;

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

  const separator = () => <Separator />;

  const renderItem = ({ item }) => {
    console.log("orderlist item", item);
    return <OrderListItem order={item} />;
  };

  return (
    <Card className="flex-1">
      <View className="pb-4">
        <Text className="text-caption-xl text-gray-50">
          {t("ordersListCard.myAssets")}
        </Text>
      </View>
      {hasOrders ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={separator}
          onRefresh={refetch}
          refreshing={isPending}
        />
      ) : (
        <Empty canTrade={canTrade} />
      )}
    </Card>
  );
};

OrdersListCard.displayName = "OrdersListCard";

export default OrdersListCard;
