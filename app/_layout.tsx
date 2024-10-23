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
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { Suspense, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link, Stack, useRouter, useSegments } from 'expo-router';

import { Providers } from "@/components/Providers";


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
});

LogBox.ignoreLogs([new RegExp("TypeError:.*")]);

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


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


    //const { logged } = useAuthStore((state) => ({ logged: state.logged }));

    return (
        <Stack>

        </Stack>
    );
};

export default Sentry.wrap(AppLayout);