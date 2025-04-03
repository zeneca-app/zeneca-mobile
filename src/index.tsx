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
import { AppState, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { LogBox } from "react-native";
import "./styles/global.css";
import MainNavigation from "@/screens/MainNavigation";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/expo";
import LogoAnimation from "@/components/IntroAnimation";

const navigationIntegration = new Sentry.ReactNavigationInstrumentation({
  enableTimeToInitialDisplay: true,
});

// Prevent splash screen from auto hiding
// will be shown after checking current session state
SplashScreen.preventAutoHideAsync();

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

const IntroScreen = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = usePrivy();

  if (!isReady) {
    return <LogoAnimation />;
  }
  return children;

}
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
        <IntroScreen>
          <StatusBar />
          <MainNavigation />
        </IntroScreen>
      </Providers>
    </NavigationContainer>
  );
};

export default Sentry.wrap(AppIndex);