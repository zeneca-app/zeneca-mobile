import ADBElogo from "@/assets/stocks/ADBE.svg";
import AMZNlogo from "@/assets/stocks/AMZN.svg";
import APPLlogo from "@/assets/stocks/APPL.svg";
import COINlogo from "@/assets/stocks/COIN.svg";
import CSCOlogo from "@/assets/stocks/CSCO.svg";
import DISlogo from "@/assets/stocks/DIS.svg";
import GBTClogo from "@/assets/stocks/GBTC.svg";
import GMElogo from "@/assets/stocks/GME.svg";
import GOOGLlogo from "@/assets/stocks/GOOGL.svg";
import JNJlogo from "@/assets/stocks/JNJ.svg";
import METAlogo from "@/assets/stocks/META.svg";
import MSFTlogo from "@/assets/stocks/MSFT.svg";
import NFLXlogo from "@/assets/stocks/NFLX.svg";
import NVDAlogo from "@/assets/stocks/NVDA.svg";
import PFElogo from "@/assets/stocks/PFE.svg";
import PYPLlogo from "@/assets/stocks/PYPL.svg";
import RDDTlogo from "@/assets/stocks/RDDT.svg";
import SPYlogo from "@/assets/stocks/SPY.svg";
import TSLAlogo from "@/assets/stocks/TSLA.svg";
import UBERlogo from "@/assets/stocks/UBER.svg";
import XOMlogo from "@/assets/stocks/XOM.svg";

type StockSymbol =
  | "GOOGL"
  | "NVDA"
  | "TSLA"
  | "AAPL"
  | "AMZN"
  | "PYPL"
  | "PFE"
  | "GBTC"
  | "MSFT"
  | "JNJ"
  | "META"
  | "RDDT"
  | "ADBE"
  | "UBER"
  | "NFLX"
  | "GME"
  | "CSCO"
  | "COIN"
  | "SPY"
  | "XOM"
  | "DIS";

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
  PYPL: {
    name: "PayPal Holdings Inc.",
    logo: PYPLlogo,
  },
  PFE: {
    name: "Pfizer Inc.",
    logo: PFElogo,
  },
  GBTC: {
    name: "Grayscale Bitcoin Trust",
    logo: GBTClogo,
  },
  MSFT: {
    name: "Microsoft Corporation",
    logo: MSFTlogo,
  },
  JNJ: {
    name: "Johnson & Johnson",
    logo: JNJlogo,
  },
  META: {
    name: "Meta Platforms Inc.",
    logo: METAlogo,
  },
  RDDT: {
    name: "Reddit Inc.",
    logo: RDDTlogo,
  },
  ADBE: {
    name: "Adobe Inc.",
    logo: ADBElogo,
  },
  UBER: {
    name: "Uber Technologies Inc.",
    logo: UBERlogo,
  },
  NFLX: {
    name: "Netflix Inc.",
    logo: NFLXlogo,
  },
  GME: {
    name: "GameStop Corp.",
    logo: GMElogo,
  },
  COIN: {
    name: "Coinbase Global Inc.",
    logo: COINlogo,
  },
  SPY: {
    name: "S&P 500 Index",
    logo: SPYlogo,
  },
  XOM: {
    name: "Exxon Mobil Corporation",
    logo: XOMlogo,
  },
  CSCO: {
    name: "Cisco Systems Inc.",
    logo: CSCOlogo,
  },
  DIS: {
    name: "The Walt Disney Company",
    logo: DISlogo,
  },
};

export const CHART_TIMEFRAMES: Record<string, string> = {
  "1D": "DAY",
  "1W": "WEEK",
  "1M": "MONTH",
  "1Y": "YEAR",
};

export const TIMEFRAME_DEFAULT = "1M";
