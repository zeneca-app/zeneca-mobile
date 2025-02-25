import { useChainStore } from "@/storage/chainStore";
import { useKYCStatusStore } from "@/storage/kycStatusStore";
import useQuoteStore from "@/storage/quoteStore";
import useRecipientStore from "@/storage/recipientStore";
import useTransferStore from "@/storage/transferStore";
import { createUserStore } from "@/storage/userStore";
import usePositionsStore from "@/storage/positionsStore";
import { QueryClient } from "@tanstack/react-query";

// Create a singleton QueryClient instance
const queryClient = new QueryClient();

// Export all stores

export const useUserStore = createUserStore(queryClient);
export { useQuoteStore, useRecipientStore, useTransferStore, useChainStore, useKYCStatusStore, usePositionsStore };

// Export queryClient for use in other parts of the app
export { queryClient };
