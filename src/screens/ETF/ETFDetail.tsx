import CopyIcon from "@/assets/copy.svg";
import { Timespan } from "@/client";
import { AssetPrice } from "@/client/";
import {
  assetsGetAssetDetailOptions,
  assetsGetAssetTicksOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import ETFActions from "@/components/ETFDetail/ETFActions";
import ETFChart from "@/components/ETFDetail/ETFChart";
import {
  getChartChange,
  normalizeStockPointsData,
} from "@/components/ETFDetail/ETFChartUtils";
import ETFDescription from "@/components/ETFDetail/ETFDescription";
import ETFHeader from "@/components/ETFDetail/ETFHeader";
import LoggedLayout from "@/components/LoggedLayout";
import { CHART_TIMEFRAMES, TIMEFRAME_DEFAULT } from "@/constants/stocks";
import useMarketHourStore from "@/storage/marketHourStore";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";
import { ScrollView } from "react-native";

type ETFDetailScreenProps = {
  route: {
    params: {
      asset: AssetPrice;
    };
  };
};

const ETFDetail = ({ route }: ETFDetailScreenProps) => {
  const asset = route.params.asset;
  const [timeframe, setTimeframe] =
    React.useState<keyof typeof CHART_TIMEFRAMES>(TIMEFRAME_DEFAULT);
  // Add state for cursor price
  const [cursorPrice, setCursorPrice] = React.useState<string | null>(null);

  cssInterop(CopyIcon, { className: "style" });

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
        asset_id: asset.id,
      },
    }),
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
        asset_id: asset.id,
      },
      query: {
        timespan: CHART_TIMEFRAMES[timeframe] as Timespan,
      },
    }),
    enabled: Boolean(asset?.id),
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
      />
    </LoggedLayout>
  );
};

ETFDetail.displayName = "ETFDetail";

export default ETFDetail;
