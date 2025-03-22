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
import React, { useState, useCallback, useMemo, memo } from "react";
import { ScrollView } from "react-native";
import { AssetPrice } from "@/client/";
import { useQuery } from "@tanstack/react-query";
import ETFHeader from "@/components/ETFDetail/ETFHeader";
import ETFChart from "@/components/ETFDetail/ETFChart";
import ETFActions from "@/components/ETFDetail/ETFActions";
import ETFDescription from "@/components/ETFDetail/ETFDescription";
import { normalizeStockPointsData, getChartChange, ChartDataPoint } from "@/components/ETFDetail/ETFChartUtils";
import { router, useLocalSearchParams } from "expo-router";


const AssetDetail = () => {
  cssInterop(CopyIcon, { className: "style" });

  const { id, serialized_asset } = useLocalSearchParams();
  const asset = JSON.parse(serialized_asset as string) as AssetPrice;

  const [timeframe, setTimeframe] =
    useState<keyof typeof CHART_TIMEFRAMES>(TIMEFRAME_DEFAULT);

  // Add state for cursor price
  const [cursorPrice, setCursorPrice] = useState<string | null>(null);

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
        asset_id: id as string,
      },
    }),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch chart data
  const { data: rawChartData, isPending: chartLoading } = useQuery({
    ...assetsGetAssetTicksOptions({
      client,
      path: { asset_id: id as string },
      query: { timespan: CHART_TIMEFRAMES[timeframe] as Timespan },
    }),
    enabled: Boolean(id),
    select: (data) => normalizeStockPointsData(data || []),
    staleTime: 5 * 60 * 1000,
  });


  const chartData: ChartDataPoint[] = rawChartData || [];
  // Process chart data
  const change = useMemo(() => getChartChange(chartData || []), [chartData]);
  const price = assetDetailData?.price || asset.price;

  const lineColor = change.increase ? "#04AE92" : "#d5deec";


  // Handle cursor movement on chart
  const handleCursorChange = (value: string | null) => {
    setCursorPrice(value);
  };

  // Determine which price to display
  const displayPrice = cursorPrice || price;

  // Add haptic feedback

  // Memoize child components
  const MemoizedETFChart = memo(ETFChart);
  const MemoizedETFHeader = memo(ETFHeader);
  const MemoizedETFDescription = memo(ETFDescription);

  return (
    <LoggedLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <MemoizedETFHeader
          symbol={asset.symbol}
          display_name={asset.display_name}
          price={displayPrice}
          chartLoading={chartLoading}
          change={change}
          isCursorActive={Boolean(cursorPrice)}
        />
        <MemoizedETFChart
          chartData={chartData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          lineColor={lineColor}
          onCursorChange={handleCursorChange}
        />
        <MemoizedETFDescription
          displayName={asset.display_name}
          description={asset.description || ""}
        />
      </ScrollView>
      <ETFActions
        isSellAvailable={true}
        onBuyPress={() => {
          router.push({
            pathname: "/assets/purchase",
            params: { symbol: asset.symbol, price: asset.price },
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

AssetDetail.displayName = "AssetDetail";

export default AssetDetail;
