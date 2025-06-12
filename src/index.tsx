import "@/lib/polyfills";
import "@/i18n";
import { Providers } from "@/components/Providers";
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { AppState, LogBox, Platform, StatusBar } from "react-native";
import "./styles/global.css";
import MainNavigation from "@/screens/MainNavigation";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const routingInstrumentation = Sentry.reactNavigationIntegration();

// Prevent splash screen from auto hiding
// will be shown after checking current session state
SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  integrations: [
    routingInstrumentation,
  ],
});

LogBox.ignoreLogs([new RegExp("TypeError:.*")]);

const AppIndex = () => {
  const [loaded] = useFonts({
    Manrope_300Light: Manrope_300Light,
    Manrope_400Regular: Manrope_400Regular,
    Manrope_500Medium: Manrope_500Medium,
    Manrope_600SemiBold: Manrope_600SemiBold,
    Manrope_700Bold: Manrope_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <NavigationContainer>
      <Providers>
        <StatusBar />
        <MainNavigation />
      </Providers>
    </NavigationContainer>
  );
};

export default Sentry.wrap(AppIndex);
