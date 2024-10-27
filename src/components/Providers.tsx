import "./polyfills";
import { BalanceProvider } from "@/context/BalanceContext";
import { MyPermissiveSecureStorageAdapter } from "@/lib/storage-adapter";
import { PrivyProvider } from "@privy-io/expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import React from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
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
        supportedChains={[baseSepolia, base]}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <BalanceProvider>{children}</BalanceProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </PostHogProvider>
  );
};
