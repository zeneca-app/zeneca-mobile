import { NavigationContainer } from "@react-navigation/native";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./screens/Login/Login";
import SignUp from "./screens/SignUp";
import "./i18n";
import { PrivyProvider } from "@privy-io/expo";

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? "";
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? "";
const Stack = createNativeStackNavigator();

const AppIndex = () => {
  const [loaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // TODO: Implement Splash Screen while loading fonts
  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<></>}>
      <SafeAreaProvider>
        <NavigationContainer>
          <PrivyProvider appId={APP_ID} clientId={CLIENT_ID}>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                options={{ headerShown: false }}
                name="Login"
                component={Login}
              />
              <Stack.Screen
                options={{ headerShown: false }}
                name="SignUp"
                component={SignUp}
              />
            </Stack.Navigator>
          </PrivyProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
};

export default AppIndex;
