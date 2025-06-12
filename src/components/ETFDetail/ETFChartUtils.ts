import BigNumber from "bignumber.js";

export interface ChartDataPoint {
  timestamp: number;
  value: number;
}

export interface ChartChange {
  change: number;
  percentage: number;
  increase: boolean;
}

/**
 * Normalizes stock points data for chart display
 */
export const normalizeStockPointsData = (data: any): ChartDataPoint[] => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item: any) => {
    return {
      timestamp: item.timestamp * 1000,
      value: parseFloat(item.close),
    };
  });
};

/**
 * Calculates the change in chart values
 */
export const getChartChange = (datapoints: ChartDataPoint[]): ChartChange => {
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
};
