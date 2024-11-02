import { useAssets } from "expo-asset";

type StockSymbol = "GOOGL" | "NVDA" | "TSLA" | "AAPL";

const useStockDetails = ({ symbol }: { symbol: StockSymbol }) => {
  const [assets, error] = useAssets([
    require("@/assets/stocks/GOOGL.png"),
    require("@/assets/stocks/NVDA.png"),
    require("@/assets/stocks/TSLA.png"),
    require("@/assets/stocks/Apple.png"),
  ]);

  const stocks: Record<StockSymbol, { name: string; logo: any }> = {
    GOOGL: {
      name: "Alphabet Inc.",
      logo: assets?.[0],
    },
    NVDA: {
      name: "NVIDIA Corporation",
      logo: assets?.[1],
    },
    TSLA: {
      name: "Tesla Inc.",
      logo: assets?.[2],
    },
    AAPL: {
      name: "Apple Inc.",
      logo: assets?.[3],
    },
  };

  const stock = stocks?.[symbol] || {};

  const isLoading = assets === undefined;

  return { isLoading, stock, stocks, assets, error };
};

export default useStockDetails;
