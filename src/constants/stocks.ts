import AMZNlogo from "@/assets/stocks/AMZN.svg";
import APPLlogo from "@/assets/stocks/Apple.svg";
import GOOGLlogo from "@/assets/stocks/GOOGL.svg";
import NVDAlogo from "@/assets/stocks/NVDA.svg";
import TSLAlogo from "@/assets/stocks/TSLA.svg";

type StockSymbol = "GOOGL" | "NVDA" | "TSLA" | "AAPL" | "AMZN";

export const STOCKS: Record<StockSymbol, { name: string; logo: any }> = {
  GOOGL: {
    name: "Alphabet Inc.",
    logo: GOOGLlogo,
  },
  NVDA: {
    name: "NVIDIA Corporation",
    logo: NVDAlogo,
  },
  TSLA: {
    name: "Tesla Inc.",
    logo: TSLAlogo,
  },
  AAPL: {
    name: "Apple Inc.",
    logo: APPLlogo,
  },
  AMZN: {
    name: "Amazon.com Inc.",
    logo: AMZNlogo,
  },
};

export const CHART_TIMEFRAMES: Record<string, string> = {
  "1D": "1D",
  "1M": "1M",
  "3M": "3M",
  "1Y": "1Y",
};

export const TIMEFRAME_DEFAULT = "1M";
