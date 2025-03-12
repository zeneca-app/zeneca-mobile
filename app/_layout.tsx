import '../ReactotronConfig';
import './config';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { PrivyProvider, usePrivy } from '@privy-io/expo';
import Constants from 'expo-constants';
import { StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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

    const { isReady, user: privyUser } = usePrivy();
    const { user } = useUserStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === '(auth)';
        const isAuthenticated = privyUser && user;

        if (isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/home');
        } else if (!isAuthenticated && inAuthGroup) {
            router.replace('/');
        }
    }, [isReady, privyUser, user, segments]);

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

    return (
        <Stack
            screenOptions={defaultScreenOptions}
            initialRouteName="home"
        >
            <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(public)"
                options={{ headerShown: false }}
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
                name="kyc"
                options={{ headerShown: false }}
            />
        </Stack>
    )
}
const RootLayout = () => {
    return (
        <NavigationContainer>
            <PrivyProvider appId={Constants.expoConfig?.extra?.PRIVY_APP_ID}>
                <StatusBar />
                <InitialLayout />
            </PrivyProvider>
        </NavigationContainer>
    );
}

export default RootLayout;