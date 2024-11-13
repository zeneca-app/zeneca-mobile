import "./polyfills";
import { MyPermissiveSecureStorageAdapter } from "@/lib/storage-adapter";
import { useUserStore } from "@/storage/userStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PrivyProvider, useEmbeddedWallet, usePrivy } from "@privy-io/expo";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import React, { ReactNode, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia, sepolia } from "wagmi/chains";
import { usersMeOptions } from "../client/@tanstack/react-query.gen";
import client from "../client/client";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia, base],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID!;
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID!;
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST!;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView className="flex-1 text-white font-sans">
      <PrivyProvider
        storage={MyPermissiveSecureStorageAdapter}
        appId={APP_ID}
        clientId={CLIENT_ID}
        supportedChains={[sepolia, baseSepolia, base]}
      >
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <PostHogProvider
              apiKey={POSTHOG_API_KEY}
              options={{
                host: POSTHOG_HOST,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                  <AwaitPrivyProvider>{children}</AwaitPrivyProvider>
                </WagmiProvider>
              </QueryClientProvider>
            </PostHogProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </PrivyProvider>
    </GestureHandlerRootView>
  );
};

function AwaitPrivyProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const { isReady: isPrivyReady, user: privyUser, logout } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { setUser } = useUserStore((state) => state);

  const {
    data: userData,
    isPending,
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
