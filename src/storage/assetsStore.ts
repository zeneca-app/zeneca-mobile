import { MyAsset } from "@/client";
import { create } from "zustand";

interface AssetsState {
  assets: MyAsset[];
  setAssets: (assets: MyAsset[]) => void;
  clearAssets: () => void;
}

const useAssetsStore = create<AssetsState>((set) => ({
  assets: [],
  setAssets: (assets) => set({ assets }),
  clearAssets: () => set({ assets: [] }),
}));

export default useAssetsStore;
