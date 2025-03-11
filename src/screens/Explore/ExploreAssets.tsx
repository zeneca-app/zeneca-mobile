import CopyIcon from "@/assets/copy.svg";
import { assetsGetAssetsOptions, assetsGetMarketHoursOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import AssetListItem from "@/components/ListItems/AssetListItem";
import LoggedLayout from "@/components/LoggedLayout";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React, { useEffect, useCallback } from "react";
import { Trans } from "react-i18next";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import "@/client";
import Separator from "@/components/ListItems/Separator";
import SkeletonLoadingView, {
  SkeletonStockListItem,
} from "@/components/Loading/SkeletonLoadingView";
import { AssetPrice } from "@/client/";
import MarketHours from "@/components/MarketHours";
import useMarketHourStore from "@/storage/marketHourStore";
import BottomActions from "@/components/BottomActions";
import Config from "@/config";

const ITEMS_PER_PAGE = 20;

const ExploreAssets = () => {
  cssInterop(CopyIcon, { className: "style" });

  const { setIsMarketOpen } = useMarketHourStore((state) => state);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['assets'],
    queryFn: async ({ pageParam }) => {
      const { data } = await client.get<AssetPrice[]>({
        url: "/v0/assets/",
        query: {
          limit: ITEMS_PER_PAGE,
          skip: pageParam,
        },
      });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, we've reached the end
      if (!lastPage || lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }
      return allPages.length * ITEMS_PER_PAGE;
    },
    refetchInterval: Config.REFETCH_INTERVAL,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const {
    isPending: marketHoursPending,
    error: marketHoursError,
    data: marketHours,
  } = useQuery({
    ...assetsGetMarketHoursOptions(),
  });

  const isMarketOpen = marketHours?.is_market_open || false;

  const renderItem = ({ item }: { item: AssetPrice }) => {
    if (!item) {
      return null;
    }
    return <AssetListItem asset={item} />;
  };

  // Flatten all pages of data into a single array and filter out undefined values
  const assets: AssetPrice[] = data?.pages.flatMap(page => page || []).filter(Boolean) || [];

  const separator = () => <Separator />;

  const handleLoadMore = React.useCallback(() => {
    if (!isFetchingNextPage && hasNextPage && !isRefetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching]);

  const Footer = React.useCallback(() => (
    <View className="flex-1">
      {isFetchingNextPage && (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" />
        </View>
      )}
      {!hasNextPage && assets.length > 0 && (
        <View className="py-4 items-center">
          <Text className="text-gray-50 caption-l">No more assets to load</Text>
        </View>
      )}
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
    </View>
  ), [isFetchingNextPage, hasNextPage, assets.length]);

  useEffect(() => {
    if (marketHours) {
      setIsMarketOpen(marketHours.is_market_open || false);
    }
  }, [marketHours, setIsMarketOpen]);

  const isPending = status === 'pending';

  return (
    <LoggedLayout>
      <Text className="heading-s text-gray-10 px-layout pt-layout-s pb-layout-l">
        <Trans
          i18nKey="explore.title"
          components={[]}
        />
      </Text>
      <View className="flex-1 px-layout">
        {isPending ? (
          <SkeletonLoadingView>
            <SkeletonStockListItem />
            <SkeletonStockListItem />
            <SkeletonStockListItem />
            <SkeletonStockListItem />
            <SkeletonStockListItem />
          </SkeletonLoadingView>
        ) : (
          <FlatList
            data={assets}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={separator}
            ListFooterComponent={<Footer />}
            showsVerticalScrollIndicator={false}
            onRefresh={refetch}
            refreshing={isRefetching}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
      {!isMarketOpen && !marketHoursPending && (
        <BottomActions>
          <MarketHours />
        </BottomActions>
      )}
    </LoggedLayout>
  );
};

ExploreAssets.displayName = "ExploreAssets";

export default ExploreAssets;