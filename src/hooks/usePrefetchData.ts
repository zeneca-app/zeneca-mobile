import { prefetchExploreAssetsData } from "@/utils/prefetchQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";

export const usePrefetchData = (
  onSuccess?: () => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();
  const hasPrefetched = useRef(false);

  useEffect(() => {
    if (hasPrefetched.current) return;

    const task = InteractionManager.runAfterInteractions(() => {
      prefetchExploreAssetsData(queryClient)
        .then(() => {
          hasPrefetched.current = true;
          onSuccess?.();
        })
        .catch((error) => {
          console.error("Prefetch failed:", error);
          onError?.(error);
        });
    });

    return () => task.cancel();
  }, [queryClient, onSuccess, onError]);

  return {
    isPrefetched: hasPrefetched.current,
    prefetchNow: () => {
      if (!hasPrefetched.current) {
        prefetchExploreAssetsData(queryClient)
          .then(() => {
            hasPrefetched.current = true;
            onSuccess?.();
          })
          .catch((error) => {
            console.error("Prefetch failed:", error);
            onError?.(error);
          });
      }
    },
  };
};
