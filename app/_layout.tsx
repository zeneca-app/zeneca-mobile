import "@/lib/polyfills";
import "@/i18n";
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar, TouchableOpacity, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold
} from '@expo-google-fonts/manrope';
import { useUserStore } from '@/storage';
import { useCheckUpdate } from '@/hooks/useCheckUpdate';
import { onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
    QueryClient,
} from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, baseSepolia, sepolia } from "wagmi/chains";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import env from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import IntroAnimation from "@/components/IntroAnimation";
import * as Sentry from "@sentry/react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import tokenCache from "@/utils/token";
import clerkInstance from "@/utils/clerk";
import { UserInactivityProvider } from "@/context/UserInactivity";
// Sentry Configuration
const navigationIntegration = new Sentry.ReactNavigationInstrumentation({
    enableTimeToInitialDisplay: true,
});

Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    debug: false,
    integrations: [
        new Sentry.ReactNativeTracing({
            routingInstrumentation: navigationIntegration,
        }),
    ],
});

LogBox.ignoreLogs([new RegExp("TypeError:.*")]);

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

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
    const navigation = useNavigation();

    const [loaded, error] = useFonts({
        Manrope_300Light: Manrope_300Light,
        Manrope_400Regular: Manrope_400Regular,
        Manrope_500Medium: Manrope_500Medium,
        Manrope_600SemiBold: Manrope_600SemiBold,
        Manrope_700Bold: Manrope_700Bold,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    const { checkUpdate } = useCheckUpdate();

    useEffect(() => {
        if (__DEV__) return;
        checkUpdate();
    }, []);

    useEffect(() => {
        return NetInfo.addEventListener(state => {
            const status = !!state.isConnected;
            onlineManager.setOnline(status);
        });
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);


    const { user } = useUserStore();
    const { isLoaded, isSignedIn } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    console.log("isLoaded", isLoaded);
    console.log("isSignedIn", isSignedIn);
    console.log("user", user);
    console.log("segments", segments);

    useEffect(() => {
        if (!isLoaded) return;

        const inAuthGroup = segments[0] === '(authenticated)';
        const isAuthenticated = isSignedIn;
        console.log("isAuthenticated", isAuthenticated);
        console.log("inAuthGroup", inAuthGroup);

        if (isAuthenticated && !inAuthGroup) {
            router.replace('/(authenticated)/(tabs)/home');
        } else if (!isAuthenticated && inAuthGroup) {
            router.replace('/');
        }
    }, [isSignedIn]);

    console.log("isLoaded", isLoaded);
    console.log("isSignedIn", isSignedIn);
    console.log("user", user);
    console.log("segments", segments);

    const backButton = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>
    );

    // Common header options
    const defaultScreenOptions = {
        title: '',
        headerBackTitle: '',
        headerStyle: { backgroundColor: Colors.basicBlack },
        headerShadowVisible: false,
        headerTransparent: true,
        headerLeft: backButton,
    };

    if (!loaded || !isLoaded) {
        return (
            <IntroAnimation />
        );
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="(authenticated)/(tabs)"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="signup"
                options={defaultScreenOptions}
            />

            <Stack.Screen
                name="email-signup"
                options={defaultScreenOptions}
            />
            <Stack.Screen
                name="login"
                options={defaultScreenOptions}
            />
            <Stack.Screen
                name="verify/[email]"
                options={defaultScreenOptions}
            />
            <Stack.Screen
                name="etf"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="deposit"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(kyc)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(authenticated)/(modals)/lock"
                options={{ headerShown: false, animation: 'none' }}
            />
        </Stack>
    )
}

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={env.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <PersistQueryClientProvider client={queryClient}
                onSuccess={() => {
                    queryClient
                        .resumePausedMutations()
                        .then(() => queryClient.invalidateQueries());
                }}
                persistOptions={{ persister: asyncStoragePersister }}>
                <GestureHandlerRootView>
                    <SafeAreaProvider>
                        <BottomSheetModalProvider>

                            <UserInactivityProvider>
                                <WagmiProvider config={wagmiConfig}>
                                    <PostHogProvider
                                        apiKey={env.POSTHOG_API_KEY}
                                        options={{
                                            host: env.POSTHOG_HOST,
                                        }}
                                    >
                                        <StatusBar />
                                        <InitialLayout />
                                    </PostHogProvider>
                                </WagmiProvider>
                            </UserInactivityProvider>

                        </BottomSheetModalProvider>
                    </SafeAreaProvider>
                </GestureHandlerRootView>
            </PersistQueryClientProvider>
        </ClerkProvider>
    );
}

export default Sentry.wrap(RootLayout);