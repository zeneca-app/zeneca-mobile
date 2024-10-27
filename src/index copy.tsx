import "@/i18n";
import { Providers } from "@/components/Providers";
import { RootStackParamList } from "@/navigation/types";
import DepositCrypto from "@/screens/Deposit/DepositCrypto";
import HomeScreen from "@/screens/HomeScreen";
import KYCPreview from "@/screens/KYCVerification/KYCPreview";
import KYCProvider from "@/screens/KYCVerification/KYCProvider";
import KYCSuccess from "@/screens/KYCVerification/KYCSuccess";
import EmailOtpValidationScreen from "@/screens/Login/EmailOtpValidation";
import Login from "@/screens/Login/Login";
import LoginOptions from "@/screens/Login/LoginOptions";
import LoginOtpVerification from "@/screens/Login/LoginOtpVerification";
import LoginWithEmail from "@/screens/Login/LoginWithEmail";
import QuoteScreen from "@/screens/Quote";
import QuoteConfirmationScreen from "@/screens/QuoteConfirmation";
import RecipientsScreen from "@/screens/Recipients";
import Send from "@/screens/Send";
import SendConfirmation from "@/screens/SendConfirmation";
import SendSuccessScreen from "@/screens/SendSuccess";
import TransactionReceiptScreen from "@/screens/TransactionReceipt";
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Sentry from "@sentry/react-native";
import { QueryClient } from "@tanstack/react-query";
import { isRunningInExpoGo } from "expo";
import { Suspense, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./styles/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  integrations: [
    navigationIntegration,
    Sentry.reactNativeTracingIntegration({}),
  ],
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type CustomTabBarProps = BottomTabBarProps & {
  state: TabNavigationState<ParamListBase>;
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === "Home") {
          iconName = "wallet";
        } else {
          iconName = "help-circle"; // Default icon
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons name={iconName} size={28} color="white" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AppIndex = () => {
  const [loaded] = useFonts({
    Manrope_300Light,
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
          <Providers>
            <View className="flex-1 text-white font-sans">
              <Stack.Navigator initialRouteName={logged ? "Home" : "Login"}>
                <Stack.Group>
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name="Login"
                    component={Login}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: false,
                      presentation: "transparentModal",
                    }}
                    name="LoginOptions"
                    component={LoginOptions}
                  />
                </Stack.Group>

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Home"
                  component={HomeScreen}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Recipients"
                  component={RecipientsScreen}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Quote"
                  component={QuoteScreen}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="QuoteConfirmation"
                  component={QuoteConfirmationScreen}
                />
                <Stack.Group screenOptions={{ presentation: "modal" }}>
                  <Stack.Screen
                    name="TransactionReceipt"
                    options={{ headerShown: false }}
                    component={TransactionReceiptScreen}
                  />
                </Stack.Group>

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="LoginWithEmail"
                  component={LoginWithEmail}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="EmailOtpValidation"
                  component={EmailOtpValidationScreen}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="DepositCrypto"
                  component={DepositCrypto}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="KYCPreview"
                  component={KYCPreview}
                />

                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="KYCProvider"
                  component={KYCProvider}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="KYCSuccess"
                  component={KYCSuccess}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Send"
                  component={Send}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="SendSuccess"
                  component={SendSuccessScreen}
                />

                <Stack.Screen
                  options={{ headerShown: false }}
                  name="SendConfirmation"
                  component={SendConfirmation}
                />
              </Stack.Navigator>
            </View>
          </Providers>
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
  );
};

export default Sentry.wrap(AppIndex);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#000",
    height: 95,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
