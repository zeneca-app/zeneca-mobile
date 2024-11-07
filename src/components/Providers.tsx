import "./polyfills";
import { BalanceProvider } from "@/context/BalanceContext";
import { MyPermissiveSecureStorageAdapter } from "@/lib/storage-adapter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PrivyProvider, usePrivy } from "@privy-io/expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import React, { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia, sepolia } from "wagmi/chains";

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
                  <BalanceProvider>
                    <AwaitPrivyProvider>{children}</AwaitPrivyProvider>
                  </BalanceProvider>
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
  const { isReady } = usePrivy();

  if (!isReady) {
    return null;
  }
  return <>{children}</>;
}
