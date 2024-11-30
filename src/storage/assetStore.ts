import { AssetPrice } from "@/client";
import { assetsGetAssetsOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

interface AssetState {
  assets: AssetPrice[];
  setAssets: (assets: AssetPrice[]) => void;
  resetAll: () => void;
}

const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  setAssets: (assets) => set({ assets }),
  resetAll: () => set({ assets: [] }),
}));

export const useAssets = () => {
  const setAssets = useAssetStore((state) => state.setAssets);

  const { data, isLoading, error, refetch } = useQuery({
    ...assetsGetAssetsOptions(),
    select: (data) => {
      setAssets(data);
    },
  });

  return {
    assets: useAssetStore((state) => state.assets),
    isLoading,
    error,
    refetch,
  };
};

export default useAssetStore;
