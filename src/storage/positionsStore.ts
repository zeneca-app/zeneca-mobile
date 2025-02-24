import { MyAsset } from "@/client";
import { create } from "zustand";

interface PositionsState {
  positions: MyAsset[];
  setPositions: (positions: MyAsset[]) => void;
  clearPositions: () => void;
}

const usePositionsStore = create<PositionsState>((set) => ({
  positions: [],
  setPositions: (positions) => set({ positions }),
  clearPositions: () => set({ positions: [] }),
}));

export default usePositionsStore; 