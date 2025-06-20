import { currentEnv } from "@/config/by_stage";
import { Chain } from "viem";
import { create } from "zustand";

type ChainStore = {
  chain: Chain;
  setChain: (chain: Chain) => void;
};

export const useChainStore = create<ChainStore>((set, get) => ({
  chain: currentEnv.CHAIN,
  setChain: (chain) => set({ chain }),
}));
