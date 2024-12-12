import { KYCStatus, OnboardingStatus } from "@/client";
import zustandStorage from "@/storage/storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface KYCStatusState {
  ob_status?: OnboardingStatus;
  kyc_status?: KYCStatus;
}

interface KYCStatusActions {
  setObStatus: (status: OnboardingStatus) => void;
  setKycStatus: (status: KYCStatus) => void;
}

type KYCStatusStore = KYCStatusState & KYCStatusActions;

const initialState: KYCStatusState = {
  ob_status: undefined,
  kyc_status: undefined,
};

export const useKYCStatusStore = create<KYCStatusStore>()(
  devtools(
    persist(
      (set, get) => ({
        ob_status: initialState.ob_status,
        kyc_status: initialState.kyc_status,
        setObStatus: (data: OnboardingStatus) =>
          set(() => ({ ob_status: data })),
        setKycStatus: (data: KYCStatus) => set(() => ({ kyc_status: data })),
        resetAll: () => set(() => initialState),
      }),
      {
        name: "kyc-status-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);
