import { useEffect } from "react";
import "@/i18n";
import {
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    useFonts,
} from "@expo-google-fonts/manrope";
import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from "react-native";
import { Slot } from 'expo-router';
import { PostHogProvider } from "posthog-react-native";
import { PrivyProvider } from "@privy-io/expo";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, base } from 'wagmi/chains';
import { isRunningInExpoGo } from "expo";


const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID!;
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID!;
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST!;


const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
});


Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    debug: false,
    integrations: [
        navigationIntegration,
        Sentry.reactNativeTracingIntegration({
        }),
    ],
    environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,
    enabled: !isRunningInExpoGo(),
});


LogBox.ignoreLogs([new RegExp("TypeError:.*")]);

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


const queryClient = new QueryClient();

const wagmiConfig = createConfig({
    chains: [baseSepolia, base],
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
});

const AppLayout = () => {
    const [loaded, error] = useFonts({
        Manrope_300Light,
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);


    return (
        <PostHogProvider
            apiKey={POSTHOG_API_KEY}
            options={{
                host: POSTHOG_HOST,
            }}
        >
            <PrivyProvider appId={APP_ID} clientId={CLIENT_ID}>
                <QueryClientProvider client={queryClient}>
                    <WagmiProvider config={wagmiConfig}>
                        <Slot />
                    </WagmiProvider>
                </QueryClientProvider>
            </PrivyProvider>
        </PostHogProvider>
    );
};

export default Sentry.wrap(AppLayout);