import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import { useUserStore } from "@/storage/userStore";
import { usePrivy } from "@privy-io/expo";
import { useQuery } from "@tanstack/react-query";
import ZenecaLogoAnimation from "@/components/IntroAnimation";


export function AwaitPrivyProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState<boolean>(false);
    const { isReady: isPrivyReady, user: privyUser, logout } = usePrivy();
    const { user, setUser } = useUserStore((state) => ({
        user: state.user,
        setUser: state.setUser
    }));

    // Only fetch user data if we have a privyUser but no user in store
    const shouldFetchUser = !!privyUser && !user && isPrivyReady;

    const {
        data: userData,
        error,
        refetch
    } = useQuery({
        ...usersMeOptions({ client }),
        enabled: shouldFetchUser,
        retry: 1
    });

    const handleLogout = useCallback(async () => {
        console.error(
            "Error fetching user data from backend",
            privyUser?.id,
            "\nPerforming Privy Logout\n",
            error
        );
        await logout();
    }, [privyUser?.id, error, logout]);


    useEffect(() => {
        if (!isPrivyReady) return;

        // Not authenticated if no privyUser
        if (!privyUser) {
            setUser(undefined);
            setIsReady(true);
            return;
        }

        // Already authenticated if both exist
        if (privyUser && user) {
            setIsReady(true);
            return;
        }

        // fetch user again if we are authenticated
        if (userData) {
            setUser(userData);
            setIsReady(true);
            return;
        }

        // Handle error case - clear user and logout
        if (error) {
            setUser(undefined);
            handleLogout()
            setIsReady(true);
            return;
        }

        // If we have privyUser but no user data, trigger fetch
        if (shouldFetchUser) {
            refetch();
        }

    }, [
        isPrivyReady,
        privyUser,
        user,
        userData,
        error,
        shouldFetchUser,
        setUser,
        logout
    ]);

    // Only render children when ready and both auth states exist
    if (isReady) {
        return <>{children}</>;
    }


    return <ZenecaLogoAnimation />;
}
