import { MyPermissiveSecureStorageAdapter } from "@/lib/storage-adapter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PrivyProvider } from "@privy-io/expo";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia, sepolia } from "wagmi/chains";
import { AwaitPrivyProvider } from "@/components/AwaitPrivyProvider";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import env from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryClient = new QueryClient();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

const wagmiConfig = createConfig({
  chains: [sepolia, baseSepolia, base],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});


export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView className="flex-1 text-white font-sans">
      <PrivyProvider
        storage={MyPermissiveSecureStorageAdapter}
        appId={env.PRIVY_APP_ID}
        clientId={env.PRIVY_CLIENT_ID}
        supportedChains={[sepolia, baseSepolia, base]}
      >
        <PostHogProvider
          apiKey={env.POSTHOG_API_KEY}
          options={{
            host: env.POSTHOG_HOST,
          }}
        >
          <SafeAreaProvider>
            <BottomSheetModalProvider>
              <WagmiProvider config={wagmiConfig}>
                <PersistQueryClientProvider client={queryClient}
                  onSuccess={() => {
                    queryClient
                      .resumePausedMutations()
                      .then(() => queryClient.invalidateQueries());
                  }}
                  persistOptions={{ persister: asyncStoragePersister }}>
                  <AwaitPrivyProvider>
                    {children}
                  </AwaitPrivyProvider>
                </PersistQueryClientProvider>
              </WagmiProvider>
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </PostHogProvider>
      </PrivyProvider>
    </GestureHandlerRootView>
  );
};
