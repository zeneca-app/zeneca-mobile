import CopyIcon from "@/assets/copy.svg";
import { assetsGetAssetsOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import StockListItem from "@/components/ListItems/StockListItem";
import LoggedLayout from "@/components/LoggedLayout";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";
import { Trans } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import "@/client";
import Separator from "@/components/ListItems/Separator";
import SkeletonLoadingView, {
  SkeletonStockListItem,
} from "@/components/Loading/SkeletonLoadingView";

const ExploreETFs = () => {
  cssInterop(CopyIcon, { className: "style" });

  const { isPending, error, data, refetch } = useQuery({
    ...assetsGetAssetsOptions({
      client: client,
    }),
  });

  const renderItem = ({ item }) => {
    return <StockListItem etf={item} />;
  };

  const etfs = data || [];

  const separator = () => <Separator />;

  return (
    <LoggedLayout>
      <Text className="text-heading-s text-gray-10 px-layout pt-layout-s pb-layout-l">
        <Trans
          i18nKey="explore.title"
          components={[<Text className="text-gray-50">segment0</Text>]}
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
            data={etfs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={separator}
            onRefresh={refetch}
            refreshing={isPending}
          />
        )}
      </View>
    </LoggedLayout>
  );
};

ExploreETFs.displayName = "ExploreETFs";

export default ExploreETFs;