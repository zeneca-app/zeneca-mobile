import { useEffect, useState } from "react";
import ChartArrowUp from "@/assets/chart-arrow-up.svg";
import { usersMyAssetsOptions } from "@/client/@tanstack/react-query.gen";
import CardHeader from "@/components/CardHeader";
import MyAssetItem from "@/components/ListItems/MyAssetItem";
import Separator from "@/components/ListItems/Separator";
import Config from "@/config";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import SkeletonLoadingView, {
  SkeletonOrderListItem,
} from "@/components/Loading/SkeletonLoadingView";
import Balance from "@/screens/HomeScreen/components/Balance";
import VerifyCtaCard from "@/screens/HomeScreen/components/VerifyCtaCard";
import CardFooter from "@/components/CardFooter";
import { MyAsset, MyAssets } from "@/client/";
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { use$ } from '@legendapp/state/react';
import { observe } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv"
import { syncState } from "@legendapp/state";


const MyPositionsList = () => {
  const { t } = useTranslation();

  const positionsStore$ = useObservableSyncedQuery({
    query: {
      ...usersMyAssetsOptions(),
      refetchInterval: Config.REFETCH_INTERVAL,
    }
  });

  syncObservable(positionsStore$, {
    persist: {
      name: 'positions',
      retrySync: true, // Retry sync after reload
      plugin: ObservablePersistMMKV
    }
  })

  const positions = use$(positionsStore$)
  const positionsState$ = syncState(positionsStore$)
  const isLoaded = positionsState$.isLoaded.get()
  console.log("positions", positions)

  // Component to render if no transactions
  const Empty = ({ canTrade = false }: { canTrade?: boolean }) => (
    <View className="flex-1 justify-center items-center bg-dark-background-100">
      <View className="pb-6">
        <ChartArrowUp className="h-40 w-40" />
      </View>
      <Text className="text-center caption-xl text-gray-50">
        {t("ordersListCard.empty_transactions")}
      </Text>
      {canTrade ? (
        <Text className="text-center caption-xl text-gray-50">
          {t("ordersListCard.empty_transactions_no_assets")}
        </Text>
      ) : (
        <Text className="text-center caption-xl text-gray-50">
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
    return <MyAssetItem asset={item} />;
  };

  const LoadingMyAssets = () => (
    <View className="flex-1 flex bg-dark-background-100">
      <SkeletonLoadingView className="flex-1 flex ">
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
      </SkeletonLoadingView>
    </View>
  )

  const HomeHeader = () => (
    <View className="flex-1">
      <View className="pt-12 pb-6">
        <Balance isRefetching={false} />
      </View>
      <VerifyCtaCard />
      <CardHeader>
        <Text className="caption-xl-bold text-gray-50">
          {t("ordersListCard.myAssets")}
        </Text>
      </CardHeader>
      {!isLoaded && !positions && <LoadingMyAssets />}
      {!isLoaded && !positions && <Empty canTrade={true} />}
    </View>
  )

  const HomeFooter = () => (
    <CardFooter>
      <Text className="caption-xl"></Text>
      <Text className="caption-xl"></Text>
      <Text className="caption-xl"></Text>
    </CardFooter>
  )

  return (
    <View className="flex-1">
      <FlatList
        data={positions}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        ListHeaderComponent={<HomeHeader />}
        ItemSeparatorComponent={separator}
        ListFooterComponent={<HomeFooter />}
        showsVerticalScrollIndicator={false}
        //onRefresh={refetch}
        //refreshing={myAssetsPending}

        // Add these props for better update handling
        extraData={positions} // Re-render when my_assets changes
        maxToRenderPerBatch={10} // Limit batch rendering for better performance
        windowSize={5} // Reduce window size for better memory usage
      />
    </View>
  );
};

MyPositionsList.displayName = "MyPositionsList";

export default MyPositionsList;