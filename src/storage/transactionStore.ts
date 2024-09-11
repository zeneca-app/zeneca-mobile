import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { RecipientReadWithExternalAccount } from "../client";
import zustandStorage from "./storage";

interface TransactionState {
  recipient: RecipientReadWithExternalAccount;
  setRecipient: (recipient: RecipientReadWithExternalAccount) => void;
  resetAll: () => void;
}

const initialState = {
  recipient: {} as RecipientReadWithExternalAccount,
};

const useTransactionStore = create<TransactionState>()(
  devtools(
    persist(
      (set) => ({
        recipient: initialState.recipient,
        setRecipient: (data) => set(() => ({ recipient: data })),
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
