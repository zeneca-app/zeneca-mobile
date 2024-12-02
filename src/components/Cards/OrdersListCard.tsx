import { useState } from "react";
import ChartArrowUp from "@/assets/chart-arrow-up.svg";
import { usersMyAssetsOptions } from "@/client/@tanstack/react-query.gen";
import CardHeader from "@/components/CardHeader";
import OrderListItem from "@/components/ListItems/OrderListItem";
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
import CardFooter from "@/components/CardFooter";
import { MyAsset } from "@/client/";

const OrdersListCard = () => {
  const { t } = useTranslation();

  const { isPending, error, data: my_assets, refetch, isRefetching } = useQuery({
    ...usersMyAssetsOptions(),
    refetchInterval: Config.REFETCH_INTERVAL,
    staleTime: 0, // Consider data stale immediately
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const hasAssets = my_assets?.length && my_assets?.length > 0;

  // Component to render if no transactions
  const Empty = ({ canTrade = false }: { canTrade?: boolean }) => (
    <View className="flex-1 justify-center items-center bg-dark-background-100">
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

  const separator = () => <Separator className="bg-dark-background-100 pb-1" />;

  const renderItem = ({ item }: { item: MyAsset }) => {
    if (!item) {
      return null;
    }
    //console.log("orderlist item", item);
    return <OrderListItem order={item} />;
  };

  const ListHeader = () => (
    <View className="flex-1">
      <View className="pt-12 pb-6">
        <Balance isRefetching={isRefetching} />
      </View>
      <VerifyCtaCard />
      <CardHeader>
        <Text className="text-caption-xl text-gray-50">
          {t("ordersListCard.myAssets")}
        </Text>
      </CardHeader>
      {isPending && !my_assets && (
        <SkeletonLoadingView className="flex-1 flex bg-dark-background-100">
          <SkeletonOrderListItem />
          <SkeletonOrderListItem />
          <SkeletonOrderListItem />
        </SkeletonLoadingView>
      )}
      {!isPending && !hasAssets && <Empty canTrade={true} />}
    </View>
  )

  return (
    <View className="flex-1">
      <FlatList
        data={my_assets}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        ListHeaderComponent={<ListHeader />}
        ItemSeparatorComponent={separator}
        ListFooterComponent={
          <CardFooter>
            <Text className="text-caption-x"></Text>
            <Text className="text-caption-xl"></Text>
          </CardFooter>
        }
       /*  contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20 // Add bottom padding for better scroll experience
        }} */ // Ensure proper content spacing
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isPending}

        // Add these props for better update handling
        extraData={my_assets} // Re-render when my_assets changes
        maxToRenderPerBatch={10} // Limit batch rendering for better performance
        windowSize={5} // Reduce window size for better memory usage
      />
    </View>
  );
};

OrdersListCard.displayName = "OrdersListCard";

export default OrdersListCard;