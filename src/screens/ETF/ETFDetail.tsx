import CopyIcon from "@/assets/copy.svg";
import {
  assetsGetAssetDetailOptions,
  assetsGetAssetTicksOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import StockListItem from "@/components/ListItems/StockListItem";
import LoggedLayout from "@/components/LoggedLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Animated, Dimensions, View } from "react-native";
import "@/client";
import Button from "@/components/Button";
import PillButtonProps from "@/components/Buttons/PillButton";
import LoaderSpinner from "@/components/LoaderSpinner";
import Text from "@/components/Text";
import {
  CHART_TIMEFRAMES,
  STOCKS,
  TIMEFRAME_DEFAULT,
} from "@/constants/stocks";
import { useUserStore } from "@/storage/userStore";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import BigNumber from "bignumber.js";
import { useCallback, useRef } from "react";
import { LineChart } from "react-native-wagmi-charts";

const windowWidth = Dimensions.get("window").width;

const chartWidth = windowWidth - 48;
const chartHeight = chartWidth;

type Stock = {
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

const ETFDetail = ({ route }: Stock) => {
  const etf = route.params.etf as Stock["etf"];

  const navigation = useNavigation();

  const [timeframe, setTimeframe] =
    React.useState<keyof typeof CHART_TIMEFRAMES>(TIMEFRAME_DEFAULT);

  const { t } = useTranslation();

  const Logo = STOCKS?.[etf.symbol as keyof typeof STOCKS]?.logo || null;

  cssInterop(CopyIcon, { className: "style" });

  const {
    isPending: assetLoading,
    error: assetError,
    data: assetData,
    refetch: assetRefetch,
  } = useQuery({
    ...assetsGetAssetDetailOptions({
      client: client,
      path: {
        asset_id: etf.id,
      },
    }),
  });

  const {
    isPending: chartLoading,
    error,
    data,
    refetch,
  } = useQuery({
    ...assetsGetAssetTicksOptions({
      client: client,
      path: {
        asset_id: etf.id,
        timespan: timeframe,
      },
    }),
    enabled: Boolean(etf?.id),
  });

  const normalizedData = (data) => {
    return data.map((item) => {
      return {
        timestamp: item.timestamp * 1000,
        value: parseFloat(item.close),
      };
    });
  };

  const getChartChange = useCallback((data) => {
    if (!data || !data.length) {
      return { change: 0, percentage: 0, increase: false };
    }
    const first = BigNumber(data[0].value);
    const last = BigNumber(data[data.length - 1].value);
    const change = last.minus(first);
    const percentage = change.dividedBy(first);
    const increase = change.isGreaterThanOrEqualTo(0);
    return {
      change: change.toNumber(),
      percentage: percentage.toNumber(),
      increase,
    };
  });

  const chartData = normalizedData(data || []);

  const change = getChartChange(chartData);

  const price = assetData?.price || etf.price;

  const lineColor = change.increase ? "#04AE92" : "#F58989";

  return (
    <LoggedLayout>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
          <Logo style={{ height: "100%", width: "100%" }} />
        </View>
        <Text className="text-gray-50 text-caption-xl flex-1">
          {etf.symbol}
        </Text>
      </View>
      <Text className="text-heading-m text-gray-10 px-layout">{etf.name}</Text>
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
          {data && data.length > 0 ? (
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
              etf: { ...etf, price: price },
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
