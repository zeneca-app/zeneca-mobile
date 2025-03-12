import { KYCStatus, OnboardingStatus } from "@/client";
import { queryClient } from "@/storage";
import zustandStorage from "@/storage/storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface KYCStatusState {
  obStatus?: OnboardingStatus;
  kycStatus?: KYCStatus;
  isVerifying: boolean;
  isVerified: boolean;
}

interface KYCStatusActions {
  setObStatus: (status: OnboardingStatus) => void;
  setKycStatus: (status: KYCStatus) => void;
  reset: () => void;
}

type KYCStatusStore = KYCStatusState & KYCStatusActions;

const initialState: KYCStatusState = {
  obStatus: undefined,
  kycStatus: undefined,
  isVerifying: false,
  isVerified: false,
};

export const useKYCStatusStore = create<KYCStatusStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setObStatus: (status: OnboardingStatus) =>
          set(() => ({
            obStatus: status,
            isVerifying: status === "KYC_PROVIDER_STEP",
          })),
        setKycStatus: (status: KYCStatus) =>
          set(() => ({
            kycStatus: status,
            isVerified: status !== "NOT_STARTED",
          })),
        reset: () => set(initialState),
      }),
      {
        name: "kyc-status-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);
