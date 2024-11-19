import CopyIcon from "@/assets/copy.svg";
import {
  assetsGetAssetDetailOptions,
  assetsGetAssetTicksOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import LoggedLayout from "@/components/LoggedLayout";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, View } from "react-native";
import { Timespan } from "@/client";
import Button from "@/components/Button";
import PillButtonProps from "@/components/Buttons/PillButton";
import LoaderSpinner from "@/components/LoaderSpinner";
import Text from "@/components/Text";
import {
  CHART_TIMEFRAMES,
  STOCKS,
  TIMEFRAME_DEFAULT,
} from "@/constants/stocks";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { LineChart } from "react-native-wagmi-charts";

const windowWidth = Dimensions.get("window").width;

const chartWidth = windowWidth - 48;
const chartHeight = chartWidth;

type Asset = {
  etf: {
    id: string;
    name: string;
    description: string;
    symbol: string;
    display_name: string;
    logo_url: string;
    external_id: string;
    price: string;
  };
};

const ETFDetail = ({ route }: Asset) => {
  const asset = route.params.etf as Asset["etf"];

  const navigation = useNavigation();

  const [timeframe, setTimeframe] =
    React.useState<keyof typeof CHART_TIMEFRAMES>(TIMEFRAME_DEFAULT);

  const { t } = useTranslation();

  const Logo = STOCKS?.[asset.symbol as keyof typeof STOCKS]?.logo || null;

  cssInterop(CopyIcon, { className: "style" });

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

  const normalizedStockPointsData = (data: any) => {
    return data.map((item: any) => {
      return {
        timestamp: item.timestamp * 1000,
        value: parseFloat(item.close),
      };
    });
  };

  const getChartChange = useCallback((datapoints: any) => {
    if (!datapoints || !datapoints.length) {
      return { change: 0, percentage: 0, increase: false };
    }
    const first = BigNumber(datapoints[0].value);
    const last = BigNumber(datapoints[datapoints.length - 1].value);
    const change = last.minus(first);
    const percentage = change.dividedBy(first);
    const increase = change.isGreaterThanOrEqualTo(0);
    return {
      change: change.toNumber(),
      percentage: percentage.toNumber(),
      increase,
    };
  }, [stockPointsData]);

  const chartData = normalizedStockPointsData(stockPointsData || []);

  const change = getChartChange(chartData);

  const price = assetDetailData?.price || asset.price;

  const lineColor = change.increase ? "#04AE92" : "#F58989";

  return (
    <LoggedLayout>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
          <Logo style={{ height: "100%", width: "100%" }} />
        </View>
        <Text className="text-gray-50 text-caption-xl flex-1">
          {asset.symbol}
        </Text>
      </View>
      <Text className="text-heading-m text-gray-10 px-layout">{asset.display_name}</Text>
      <Text className="text-heading-m text-gray-10 px-layout">${price}</Text>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <Text
          className={`text-caption-m ${change.increase ? "text-semantic-success" : "text-red-20"}`}
        >
          {change.increase && "+"}
          {currencyFormatter(change.change, 2, 0)} (
          {percentageFormatter(change.percentage)})
        </Text>
      </View>
      <View className="flex-1 flex gap-s">
        <Animated.View
          className="relative w-full"
          style={{ height: chartWidth + 24, width: chartHeight }}
        >
          {stockPointsData && stockPointsData.length > 0 ? (
            <LineChart.Provider data={chartData}>
              <LineChart height={chartHeight}>
                <LineChart.Path color={lineColor}>
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorCrosshair color={"#F7F7F8"}>
                  <LineChart.Tooltip
                    textStyle={{
                      backgroundColor: "#19181B",
                      borderRadius: 4,
                      color: "white",
                      fontSize: 18,
                      padding: 4,
                    }}
                  />
                </LineChart.CursorCrosshair>
              </LineChart>
            </LineChart.Provider>
          ) : (
            <View className="flex-1 flex justify-center items-center absolute w-full h-full">
              <LoaderSpinner />
            </View>
          )}
        </Animated.View>
        <View className="flex flex-row justify-between items-center px-layout-l w-full">
          {Object.entries(CHART_TIMEFRAMES).map(([key, value]) => (
            <PillButtonProps
              key={key}
              onPress={() => setTimeframe(key as keyof typeof CHART_TIMEFRAMES)}
              activeClasses="!bg-gray-90"
              isActive={timeframe === key}
            >
              <Text
                className={`text-caption-m ${timeframe === key ? "text-white" : "text-gray-50"}`}
              >
                {key}
              </Text>
            </PillButtonProps>
          ))}
        </View>
      </View>
      <View className="px-layout">
        <Button
          className=""
          onPress={() =>
            navigation.navigate("ETFPurchase", {
              etf: { ...asset, price: price },
            })
          }
        >
          <Text className="text-button-m">{t("etfDetail.buy")}</Text>
        </Button>
      </View>
    </LoggedLayout>
  );
};

ETFDetail.displayName = "ETFDetail";

export default ETFDetail;