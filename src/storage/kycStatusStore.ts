import { usersGetKycStatusOptions } from "@/client/@tanstack/react-query.gen";
import zustandStorage from "@/storage/storage";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type OBStatus = "pending" | "completed" | "failed" | undefined;
type KYCStatus = "pending" | "approved" | "rejected" | undefined;

interface KYCStatusState {
  ob_status?: OBStatus;
  kyc_status?: KYCStatus;
  isLoading: boolean;
  error?: string;
}

interface KYCStatusActions {
  updateObStatus: (status: OBStatus) => void;
  updateKycStatus: (status: KYCStatus) => void;
  refreshKycStatus: () => Promise<void>;
  clearError: () => void;
}

type KYCStatusStore = KYCStatusState & KYCStatusActions;

const initialState: KYCStatusState = {
  ob_status: undefined,
  kyc_status: undefined,
  isLoading: false,
  error: undefined,
};

// Inject queryClient as a dependency
export const createKYCStatusStore = (queryClient: QueryClient) =>
  create<KYCStatusStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initialState,

          updateObStatus: (status) => set({ ob_status: status }),

          updateKycStatus: (status) => set({ kyc_status: status }),

          clearError: () => set({ error: undefined }),

          refreshKycStatus: async () => {
            if (get().isLoading) return;

            set({ isLoading: true, error: undefined });

            try {
              const userData = await queryClient.ensureQueryData(
                usersGetKycStatusOptions(),
              );

              set({
                ob_status: userData?.ob_status as OBStatus,
                kyc_status: userData?.kyc_status?.status as KYCStatus,
                isLoading: false,
              });
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
                isLoading: false,
              });
            }
          },
        }),
        {
          name: "kyc-status-storage",
          storage: createJSONStorage(() => zustandStorage),
        },
      ),
    ),
  );
