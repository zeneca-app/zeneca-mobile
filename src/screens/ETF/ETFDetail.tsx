import CopyIcon from "@/assets/copy.svg";
import { Timespan } from "@/client";
import {
  assetsGetAssetDetailOptions,
  assetsGetAssetTicksOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import Button from "@/components/Button";
import PillButtonProps from "@/components/Buttons/PillButton";
import LoaderSpinner from "@/components/LoaderSpinner";
import LoggedLayout from "@/components/LoggedLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "@/components/Text";
import {
  CHART_TIMEFRAMES,
  STOCKS,
  TIMEFRAME_DEFAULT,
} from "@/constants/stocks";
import { currencyFormatter, percentageFormatter, formatNumber } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { cssInterop } from "nativewind";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, ScrollView, View } from "react-native";
import { LineChart } from "react-native-wagmi-charts";
import { AssetPrice } from "@/client/";
import useMarketHourStore from "@/storage/marketHourStore";
import MarketHours from "@/components/MarketHours";
import BottomActions from "@/components/BottomActions";
import COLORS from "@/constants/colors";
import { SkeletonView } from "@/components/Loading/SkeletonLoadingView";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const chartWidth = windowWidth - 48;
const chartHeight = windowHeight * 0.24;


type ETFDetailScreenProps = {
  route: {
    params: {
      asset: AssetPrice;
    };
  };
};

const ETFDetail = ({ route }: ETFDetailScreenProps) => {
  const asset = route.params.asset;

  const navigation = useNavigation();

  const [timeframe, setTimeframe] =
    React.useState<keyof typeof CHART_TIMEFRAMES>(TIMEFRAME_DEFAULT);

  const { t } = useTranslation();

  cssInterop(CopyIcon, { className: "style" });

  const { isMarketOpen } = useMarketHourStore((state) => state);

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

  const getChartChange = useCallback(
    (datapoints: any) => {
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
    },
    [stockPointsData],
  );

  const chartData = normalizedStockPointsData(stockPointsData || []);

  const change = getChartChange(chartData);

  const price = assetDetailData?.price || asset.price;

  const lineColor = change.increase ? "#04AE92" : "#F58989";

  const ChartView = () => (
    <View className="flex flex-1 gap-l ">
      <View className="flex-1 flex gap-s justify-end ">
        <Animated.View
          className="relative w-full"
          style={{ height: chartHeight + 24, width: chartWidth }}
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
            <View className="flex-1 flex justify-center items-center absolute w-full h-full mx-layout">
              <LoaderSpinner />
            </View>
          )}
        </Animated.View>
        <View className="flex flex-row justify-between items-center px-layout-l w-full pb-layout-s">
          {Object.entries(CHART_TIMEFRAMES).map(([key, value]) => (
            <PillButtonProps
              key={key}
              onPress={() =>
                setTimeframe(key as keyof typeof CHART_TIMEFRAMES)
              }
              activeClasses="!bg-gray-90"
              isActive={timeframe === key}
            >
              <Text
                className={`caption-m ${timeframe === key ? "text-white" : "text-gray-50"}`}
              >
                {key}
              </Text>
            </PillButtonProps>
          ))}
        </View>
      </View>

    </View>
  )

  const HeaderView = () => {
    const Logo = STOCKS?.[asset.symbol as keyof typeof STOCKS]?.logo || null;
    const priceDisplayed = price
      ? currencyFormatter(price, 2, 0, true)
      : "0.00";

    return (
      <>
        <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
          <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
            <Logo style={{ height: "100%", width: "100%" }} />
          </View>
          <Text className="text-gray-50 caption-xl flex-1">
            {asset.symbol}
          </Text>
        </View>
        <Text
          className="heading-m text-gray-10 px-layout"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {asset.display_name}
        </Text>
        <Text className="heading-m text-gray-10 px-layout">{priceDisplayed}</Text>
        <View className="flex-row gap-s pt-layout-s items-center justify-end px-layout">
          {chartLoading ? (
            <SkeletonView className="w-20 h-4" />
          ) : (
            <>
              <Ionicons name={change.increase ? "arrow-up" : "arrow-down"} size={16} color={change.increase ?
                COLORS.semantic.success : COLORS.red[20]} />
              <Text
                className={`caption-xl ${change.increase ? "text-semantic-success" : "text-red-20"}`}
              >
                {percentageFormatter(change.percentage)}
              </Text>
            </>
          )
          }
        </View>
      </>
    )
  }

  const BottomView = () => {
    return (
      <BottomActions>
        {/* {!isMarketOpen ? (
          <MarketHours />) : (
          
        )} */}
        <View className="flex-row gap-s px-layout">
          <Button
            className="flex-1"
            onPress={() =>
              navigation.navigate("ETFPurchase", {
                etf: { ...asset, price: price },
              })
            }
          >
            <Text className="button-m">{t("etfDetail.buy")}</Text>
          </Button>
          <Button
            className="flex-1"
            onPress={() =>
              navigation.navigate("ETFSell", {
                etf: { ...asset, price: price },
              })
            }
          >
            <Text className="button-m">{t("etfDetail.sell")}</Text>
          </Button>
        </View>
      </BottomActions>
    )
  }

  return (
    <LoggedLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <HeaderView />
        <ChartView />
        <View className="px-layout pt-layout-l pb-layout-l">
          <Text className="heading-s text-gray-10">{t("etfDetail.description")} {asset.display_name}</Text>
          <Text className="body-s text-gray-50">{asset.description}</Text>
          <View className="pb-layout-l" />
          <View className="pb-layout-l" />
          <View className="pb-layout-l" />
        </View>
      </ScrollView>
      <BottomView />
    </LoggedLayout>
  );
};

ETFDetail.displayName = "ETFDetail";

export default ETFDetail;
