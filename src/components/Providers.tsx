import "./polyfills";
import { MyPermissiveSecureStorageAdapter } from "@/lib/storage-adapter";
import { useUserStore } from "@/storage/userStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PrivyProvider, useEmbeddedWallet, usePrivy } from "@privy-io/expo";
import { SmartWalletsProvider } from "@privy-io/expo/smart-wallets";
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
import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";


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
      <PostHogProvider
        apiKey={POSTHOG_API_KEY}
        options={{
          host: POSTHOG_HOST,
        }}
      >
        <PrivyProvider
          storage={MyPermissiveSecureStorageAdapter}
          appId={APP_ID}
          clientId={CLIENT_ID}
          supportedChains={[sepolia, baseSepolia, base]}
        >
          <SmartWalletsProvider>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <QueryClientProvider client={queryClient}>

                  <WagmiProvider config={wagmiConfig}>
                    {children}
                  </WagmiProvider>

                </QueryClientProvider>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </SmartWalletsProvider>
        </PrivyProvider>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
};
