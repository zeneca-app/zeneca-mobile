import ChartArrowUp from "@/assets/chart-arrow-up.svg";
import { usersMyAssetsOptions } from "@/client/@tanstack/react-query.gen";
import Card from "@/components/Card";
import OrderListItem from "@/components/ListItems/OrderListItem"; // Import OrderListItem
import Separator from "@/components/ListItems/Separator";
import Config from "@/config";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import SkeletonLoadingView, {
  SkeletonOrderListItem,
} from "@/components/Loading/SkeletonLoadingView";
import Balance from "@/components/Balance";
import VerifyCtaCard from "@/components/Cards/VerifyCtaCard";

const OrdersListCard = () => {
  const { t } = useTranslation();

  const { isPending, error, data: my_assets, refetch } = useQuery({
    ...usersMyAssetsOptions(),
    refetchInterval: Config.REFETCH_INTERVAL,
  });

  const canTrade = true;

  const hasOrders = my_assets?.length && my_assets?.length > 0;

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
    //console.log("orderlist item", item);
    return <OrderListItem order={item} />;
  };

  return (
    <View className="flex-1">
      <FlatList
        data={my_assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View className="flex-1">
            <View className="pt-12 pb-6">
              <Balance />
            </View>
            <VerifyCtaCard />
            <View className="flex-1 px-layout py-2 m-px">
              <View className="pb-4">
                <Text className="text-caption-xl text-gray-50">
                  {t("ordersListCard.myAssets")}
                </Text>
              </View>
            </View>
            {isPending && !my_assets && (
              <SkeletonLoadingView className="flex-1 flex">
                <SkeletonOrderListItem />
                <SkeletonOrderListItem />
                <SkeletonOrderListItem />
                <SkeletonOrderListItem />
              </SkeletonLoadingView>
            )}
          </View>
        }
        ItemSeparatorComponent={separator}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isPending}
      />
    </View>
  );
};

OrdersListCard.displayName = "OrdersListCard";

export default OrdersListCard;