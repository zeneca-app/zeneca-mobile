import { AssetPrice, OrderQuote } from "@/client";
import { create } from "zustand";

type TransactionType = "BUY" | "SELL" | "NOT_SET";

interface TransactionState {
  asset: AssetPrice | null;
  amount: string;
  quote: OrderQuote | null;
  setAsset: (asset: AssetPrice) => void;
  setAmount: (amount: string) => void;
  setQuote: (quote: OrderQuote | null) => void;
  reset: () => void;
  transactionType: TransactionType;
  setTransactionType: (transactionType: TransactionType) => void;
  setData: (
    asset: AssetPrice,
    amount: string,
    quote: OrderQuote | null,
    transactionType: TransactionType,
  ) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  asset: null,
  amount: "0",
  quote: null,
  transactionType: "NOT_SET",
  setAsset: (asset) => set({ asset }),
  setAmount: (amount) => set({ amount }),
  setQuote: (quote) => set({ quote }),
  reset: () =>
    set({ asset: null, amount: "0", quote: null, transactionType: "NOT_SET" }),
  setTransactionType: (transactionType) => set({ transactionType }),
  setData: (asset, amount, quote, transactionType) =>
    set({ asset, amount, quote, transactionType }),
}));
