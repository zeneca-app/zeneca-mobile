import {
  assetsGetAssetsOptions,
  assetsGetMarketHoursOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import { QueryClient } from "@tanstack/react-query";

/**
 * Prefetches data for the ExploreAssets screen
 * @param queryClient The React Query client instance
 * @param background Whether to prefetch in the background with longer intervals
 * @returns A promise that resolves when all prefetching is complete
 */
export const prefetchExploreAssetsData = async (
  queryClient: QueryClient,
  background = false,
): Promise<void> => {
  // Prefetch assets data
  await queryClient.prefetchQuery({
    ...assetsGetAssetsOptions({
      client: client,
    }),
    staleTime: background ? 5 * 60 * 1000 : Infinity, // 5 minutes in background mode
    gcTime: Infinity,
  });

  // Prefetch market hours data
  await queryClient.prefetchQuery({
    ...assetsGetMarketHoursOptions(),
    staleTime: background ? 5 * 60 * 1000 : Infinity, // 5 minutes in background mode
  });
};
