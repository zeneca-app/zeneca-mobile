import CopyIcon from "@/assets/copy.svg";
import { assetsGetAssetsOptions, assetsGetMarketHoursOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import AssetListItem from "@/components/ListItems/AssetListItem";
import LoggedLayout from "@/components/LoggedLayout";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import { FlatList, Text, View } from "react-native";
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
import { router } from "expo-router";
import { useTransactionStore } from "@/storage/transactionStore";

const Explore = () => {
  cssInterop(CopyIcon, { className: "style" });

  const { setIsMarketOpen } = useMarketHourStore((state) => state);
  const { setData } = useTransactionStore((state) => state);

  const {
    isPending,
    error: allAssetsError,
    data: allAssets,
    refetch,
  } = useQuery({
    ...assetsGetAssetsOptions({
      client: client,
    }),
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
    return (
      <AssetListItem
        asset={item}
        handlePress={() => {
          setData(item, "0", null, "NOT_SET");
          router.push({
            pathname: "/assets/[id]",
            params: { id: item.id },
          });
        }}
      />
    );
  };

  const assets = allAssets || [];

  const separator = () => <Separator />;

  const Footer = () => (
    <View className="flex-1">
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
      <View className="pb-layout-l" />
    </View>
  )

  useEffect(() => {
    if (marketHours) {
      setIsMarketOpen(marketHours.is_market_open || false);
    }
  }, [marketHours, setIsMarketOpen]);

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
            refreshing={isPending}
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

Explore.displayName = "Explore";

export default Explore;