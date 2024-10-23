import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { TransferRead } from "@/client";
import { TransferCrypto } from "@/lib/types/transfer";
import zustandStorage from "@/storage/storage";

interface TransferState {
  transfer?: TransferRead;
  transferCrypto?: TransferCrypto;
  txHash: string;
  setTransfer: (transfer: TransferRead) => void;
  setTransferCrypto: (transfer: TransferCrypto) => void;
  setTxHash: (txHash: string) => void;
  resetAll: () => void;
}

const initialState = {
  transfer: {} as TransferRead,
  transferCrypto: {} as TransferCrypto,
  txHash: "" as string,
};

const useTransferStore = create<TransferState>()(
  devtools(
    persist(
      (set) => ({
        txHash: initialState.txHash,
        transfer: initialState.transfer,
        transferCrypto: initialState.transferCrypto,
        setTxHash: (data: string) => set(() => ({ txHash: data })),
        setTransfer: (data: TransferRead) => set(() => ({ transfer: data })),
        setTransferCrypto: (data: TransferCrypto) =>
          set(() => ({ transferCrypto: data })),
        resetAll: () => set(() => initialState),
      }),
      {
        name: "transfer-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useTransferStore;