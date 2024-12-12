import { Chain } from "viem";
import { base, sepolia } from "viem/chains";
import { create } from "zustand";

type ChainStore = {
  chain: Chain;
  setChain: (chain: Chain) => void;
};

export const useChainStore = create<ChainStore>((set, get) => ({
  chain: base,
  setChain: (chain) => set({ chain }),
}));
