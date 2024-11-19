import React, { ReactNode, useEffect, useState } from "react";
import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import { useUserStore } from "@/storage/userStore";
import { useEmbeddedWallet, usePrivy } from "@privy-io/expo";
import * as SplashScreen from "expo-splash-screen";
import { useQuery } from "@tanstack/react-query";

export function AwaitPrivyProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState<boolean>(false);
    const { isReady: isPrivyReady, user: privyUser, logout } = usePrivy();
    const wallet = useEmbeddedWallet();
    const { setUser } = useUserStore((state) => state);

    const {
        data: userData,
        isPending: isUserPending,
        error,
    } = useQuery({
        ...usersMeOptions({
            client,
        }),
        enabled: (!!privyUser && isPrivyReady) || !isReady,
    });

    useEffect(() => {
        const asyncLogout = async () => {
            await logout();
        };

        if (!isReady) {
            if (isPrivyReady && userData) {
                setUser(userData);
                setIsReady(true);
            }

            if (isPrivyReady && privyUser && error) {
                console.error(
                    "Error fetching user data from backend",
                    privyUser.id,
                    "\nPerforming Privy Logout\n",
                    error,
                );
                asyncLogout();
            }

            if (isPrivyReady && !privyUser) {
                setIsReady(true);
            }
        }
    }, [
        userData,
        privyUser,
        isPrivyReady,
        wallet,
        isReady,
        error,
        logout,
        setUser,
    ]);

    if (isReady) {
        SplashScreen.hideAsync();
        return <>{children}</>;
    }

    return null;
}