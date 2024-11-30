import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/storage/userStore";

export const useUser = () => {
    const setUser = useUserStore((state) => state.setUser);

    const { data, isLoading, error, refetch } = useQuery({
        ...usersMeOptions({
            client,
        }),
        select: (user) => {
            setUser(user);
        },
        // Add stale time to prevent unnecessary refetches
        staleTime: 2 * 60 * 1000, // 2 minutes
        // Add cache time
        gcTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        user: useUserStore((state) => state.user),
        isLoading,
        error,
        refetch,
    };
};
