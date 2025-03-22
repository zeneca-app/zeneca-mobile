import CopyIcon from "@/assets/copy.svg";
import { Timespan } from "@/client";
import {
  assetsGetAssetDetailOptions,
  assetsGetAssetTicksOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import LoggedLayout from "@/components/LoggedLayout";
import {
  CHART_TIMEFRAMES,
  TIMEFRAME_DEFAULT,
} from "@/constants/stocks";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { AssetPrice } from "@/client/";
import useMarketHourStore from "@/storage/marketHourStore";
import { useQuery } from "@tanstack/react-query";
import ETFHeader from "@/components/ETFDetail/ETFHeader";
import ETFChart from "@/components/ETFDetail/ETFChart";
import ETFActions from "@/components/ETFDetail/ETFActions";
import ETFDescription from "@/components/ETFDetail/ETFDescription";
import { normalizeStockPointsData, getChartChange } from "@/components/ETFDetail/ETFChartUtils";
import { router, useLocalSearchParams } from "expo-router";


const Detail = () => {
  cssInterop(CopyIcon, { className: "style" });

  const { asset_id, serialized_asset } = useLocalSearchParams();
  const asset = JSON.parse(serialized_asset as string) as AssetPrice;

  const [timeframe, setTimeframe] =
    useState<keyof typeof CHART_TIMEFRAMES>(TIMEFRAME_DEFAULT);

  // Add state for cursor price
  const [cursorPrice, setCursorPrice] = useState<string | null>(null);

  const { isMarketOpen } = useMarketHourStore((state) => state);

  // Fetch asset details
  const {
    isPending: assetDetailLoading,
    error: assetDetailError,
    data: assetDetailData,
    refetch: assetDetailRefetch,
  } = useQuery({
    ...assetsGetAssetDetailOptions({
      client: client,
      path: {
        asset_id: asset_id as string,
      },
    }),
    enabled: Boolean(asset_id),
  });

  // Fetch chart data
  const {
    isPending: chartLoading,
    error: chartError,
    data: stockPointsData,
    refetch: stockPointsRefetch,
  } = useQuery({
    ...assetsGetAssetTicksOptions({
      client: client,
      path: {
        asset_id: asset_id as string,
      },
      query: {
        timespan: CHART_TIMEFRAMES[timeframe] as Timespan,
      },
    }),
    enabled: Boolean(asset_id),
  });

  // Process chart data
  const chartData = normalizeStockPointsData(stockPointsData || []);
  const change = getChartChange(chartData);
  const price = assetDetailData?.price || asset.price;

  const greenColor = "#04AE92";
  const grayColor = "#d5deec"; // oklch(0.707 0.022 261.325)

  const lineColor = change.increase ? greenColor : grayColor;


  // Handle cursor movement on chart
  const handleCursorChange = (value: string | null) => {
    setCursorPrice(value);
  };

  // Determine which price to display
  const displayPrice = cursorPrice || price;

  return (
    <LoggedLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ETFHeader
          asset={asset}
          price={displayPrice}
          chartLoading={chartLoading}
          change={change}
          isCursorActive={Boolean(cursorPrice)}
        />
        <ETFChart
          chartData={chartData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          lineColor={lineColor}
          stockPointsData={stockPointsData}
          onCursorChange={handleCursorChange}
        />
        <ETFDescription
          displayName={asset.display_name}
          description={asset.description || ""}
        />
      </ScrollView>
      <ETFActions
        asset={asset}
        price={price}
        isMarketOpen={isMarketOpen}
        isSellAvailable={true}
        onBuyPress={() => {
          router.push({
            pathname: "/assets/purchase",
            params: { asset: asset.symbol },
          });
        }}
        onSellPress={() => {
          router.push({
            pathname: "/assets/sell",
            params: { asset: asset.symbol },
          });
        }}
      />
    </LoggedLayout>
  );
};

Detail.displayName = "Detail";

export default Detail;
