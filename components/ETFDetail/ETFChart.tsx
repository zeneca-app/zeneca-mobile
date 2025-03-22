import React from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import Text from '@/components/Text';
import PillButtonProps from '@/components/Buttons/PillButton';
import { CHART_TIMEFRAMES } from '@/constants/stocks';
import AnimatedWavyLine from '@/components/Loading/AnimatedWavyLine';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const chartWidth = windowWidth - 48;
const chartHeight = windowHeight * 0.24;

interface ChartDataPoint {
  timestamp: number;
  value: number;
}

interface ETFChartProps {
  chartData: ChartDataPoint[];
  timeframe: keyof typeof CHART_TIMEFRAMES;
  setTimeframe: (timeframe: keyof typeof CHART_TIMEFRAMES) => void;
  lineColor: string;
  onCursorChange?: (value: string | null) => void;
}

const ETFChart: React.FC<ETFChartProps> = ({
  timeframe,
  setTimeframe,
  lineColor,
  chartData,
  onCursorChange
}) => {
  return (
    <View className="flex flex-1 gap-l">
      <View className="flex-1 flex gap-s justify-end">
        <Animated.View
          className="relative w-full"
          style={{ height: chartHeight + 24, width: chartWidth }}
        >
          {chartData && chartData.length > 0 ? (
            <LineChart.Provider data={chartData}>
              <LineChart height={chartHeight}>
                <LineChart.Path
                  color={lineColor}
                  width={2}
                >
                  <LineChart.Gradient />
                </LineChart.Path>
                <LineChart.CursorLine />
                <LineChart.CursorCrosshair color={"#F7F7F8"}>
                  <LineChart.Tooltip
                    textStyle={{
                      backgroundColor: "#19181B",
                      borderRadius: 0,
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
              <AnimatedWavyLine
                height={80}
                color="gray"
                strokeWidth={4}
                duration={2000}
                direction="right"
              />
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
  );
};

ETFChart.displayName = "ETFChart";

export default ETFChart;