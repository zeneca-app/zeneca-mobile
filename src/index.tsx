import "./i18n";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { PrivyProvider } from "@privy-io/expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackParamList } from "./navigation/types";
import HomeScreen from "./screens/HomeScreen";
import Login from "./screens/Login/Login";
import useAuthStore from "./storage/authStore";

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? "";
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? "";
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppIndex = () => {
  const [loaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const queryClient = new QueryClient();

  const { logged } = useAuthStore((state) => ({ logged: state.logged }));

  // TODO: Implement Splash Screen while loading fonts
  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<></>}>
      <SafeAreaProvider>
        <NavigationContainer>
          <PrivyProvider appId={APP_ID} clientId={CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
              <Stack.Navigator initialRouteName={logged ? "Home" : "Login"}>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Login"
                  component={Login}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Home"
                  component={HomeScreen}
                />
              </Stack.Navigator>
            </QueryClientProvider>
          </PrivyProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
};

export default AppIndex;
