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
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import "./i18n";

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
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
};

export default AppIndex;
