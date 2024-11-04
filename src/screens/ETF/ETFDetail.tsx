import CopyIcon from "@/assets/copy.svg";
import { assetsGetAssets, usersMyAssets } from "@/client";
import StockListItem from "@/components/ListItems/StockListItem";
import LoggedLayout from "@/components/LoggedLayout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Dimensions, Text, View } from "react-native";
import "@/client";
import Button from "@/components/Button";
import PillButtonProps from "@/components/Buttons/PillButton";
import {
  CHART_TIMEFRAMES,
  STOCKS,
  TIMEFRAME_DEFAULT,
} from "@/constants/stocks";
import { useUserStore } from "@/storage/userStore";
import { currencyFormatter, percentageFormatter } from "@/utils/currencyUtils";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { LineChart } from "react-native-wagmi-charts";

const windowWidth = Dimensions.get("window").width;

const chartWidth = windowWidth - 48;
const chartHeight = chartWidth;

const mockData = [
  {
    close: "225.67",
    high: "226.805",
    low: "223.32",
    open: "225.14",
    timestamp: 1727928000,
  },
  {
    close: "226.8",
    high: "228.0",
    low: "224.13",
    open: "227.9",
    timestamp: 1728014400,
  },
  {
    close: "221.69",
    high: "225.69",
    low: "221.33",
    open: "224.5",
    timestamp: 1728273600,
  },
  {
    close: "225.77",
    high: "225.98",
    low: "223.25",
    open: "224.3",
    timestamp: 1728360000,
  },
  {
    close: "229.54",
    high: "229.75",
    low: "224.83",
    open: "225.23",
    timestamp: 1728446400,
  },
  {
    close: "229.04",
    high: "229.5",
    low: "227.17",
    open: "227.78",
    timestamp: 1728532800,
  },
  {
    close: "227.55",
    high: "229.41",
    low: "227.34",
    open: "229.3",
    timestamp: 1728619200,
  },
  {
    close: "231.3",
    high: "231.73",
    low: "228.6",
    open: "228.7",
    timestamp: 1728878400,
  },
  {
    close: "233.85",
    high: "237.49",
    low: "232.37",
    open: "233.61",
    timestamp: 1728964800,
  },
  {
    close: "231.78",
    high: "232.12",
    low: "229.84",
    open: "231.6",
    timestamp: 1729051200,
  },
  {
    close: "232.15",
    high: "233.85",
    low: "230.52",
    open: "233.43",
    timestamp: 1729137600,
  },
  {
    close: "235.0",
    high: "236.18",
    low: "234.01",
    open: "236.18",
    timestamp: 1729224000,
  },
  {
    close: "236.48",
    high: "236.85",
    low: "234.45",
    open: "234.45",
    timestamp: 1729483200,
  },
  {
    close: "235.86",
    high: "236.22",
    low: "232.6",
    open: "233.885",
    timestamp: 1729569600,
  },
  {
    close: "230.76",
    high: "235.144",
    low: "227.76",
    open: "234.08",
    timestamp: 1729656000,
  },
  {
    close: "230.57",
    high: "230.82",
    low: "228.41",
    open: "229.98",
    timestamp: 1729742400,
  },
  {
    close: "231.41",
    high: "233.22",
    low: "229.57",
    open: "229.74",
    timestamp: 1729828800,
  },
  {
    close: "233.4",
    high: "234.73",
    low: "232.55",
    open: "233.32",
    timestamp: 1730088000,
  },
  {
    close: "233.67",
    high: "234.325",
    low: "232.32",
    open: "233.1",
    timestamp: 1730174400,
  },
  {
    close: "230.1",
    high: "233.2299",
    low: "229.55",
    open: "232.61",
    timestamp: 1730260800,
  },
  {
    close: "225.91",
    high: "229.83",
    low: "225.37",
    open: "229.34",
    timestamp: 1730347200,
  },
  {
    close: "222.91",
    high: "225.35",
    low: "220.27",
    open: "220.965",
    timestamp: 1730433600,
  },
];

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

  /*   const { isPending, error, data, refetch } = useQuery({
    queryKey: ["etfs"],
    queryFn: () =>
      assetsGetAssets({
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }).then((res) => res),
  }); */

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
    const first = data[0].value;
    const last = data[data.length - 1].value;
    const change = last - first;
    const percentage = change / first;
    return { change, percentage, increase: change >= 0 };
  });

  const chartData = normalizedData(mockData);

  const change = getChartChange(chartData);

  const price = etf.price;

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
      <Text className="text-heading-m text-gray-10 px-layout">
        {currencyFormatter(price)}
      </Text>
      <View className="flex-row gap-s pt-layout-s pb-layout-s items-center justify-start px-layout">
        <Text
          className={`text-caption-m ${change.increase ? "text-semantic-success" : "text-red-20"}`}
        >
          {change.increase && "+"}
          {currencyFormatter(change.change)} (
          {percentageFormatter(change.percentage)})
        </Text>
      </View>
      <View className="flex-1 flex gap-s">
        <View
          className="relative w-full"
          style={{ height: chartWidth + 24, width: chartHeight }}
        >
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
        </View>
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
          onPress={() => navigation.navigate("ETFPurchase", { etf })}
        >
          <Text className="text-button-m">{t("etfDetail.buy")}</Text>
        </Button>
      </View>
    </LoggedLayout>
  );
};

ETFDetail.displayName = "ETFDetail";

export default ETFDetail;
