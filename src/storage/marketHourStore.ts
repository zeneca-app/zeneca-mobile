import { create } from "zustand";

interface MarketHourState {
  isMarketOpen: boolean;
  setIsMarketOpen: (isOpen: boolean) => void;
}

const useMarketHourStore = create<MarketHourState>((set) => ({
  isMarketOpen: false,
  setIsMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),
}));

export default useMarketHourStore;
