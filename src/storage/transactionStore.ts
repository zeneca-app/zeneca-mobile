import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { TransactionRead } from "../client/";
import zustandStorage from "./storage";

interface TransactionState {
  transaction: TransactionRead;
  setTransaction: (transaction: TransactionRead) => void;
  resetAll: () => void;
}

const initialState = {
  transaction: {} as TransactionRead,
};

const useTransactionStore = create<TransactionState>()(
  devtools(
    persist(
      (set) => ({
        transaction: initialState.transaction,
        setTransaction: (data: TransactionRead) =>
          set(() => ({ transaction: data })),
        resetAll: () => set(() => initialState),
      }),
      {
        name: "transaction-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useTransactionStore;
