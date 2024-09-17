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
import QuoteScreen from "./screens/Quote";
import RecipientsScreen from "./screens/Recipients";
import QuoteConfirmationScreen from "./screens/QuoteConfirmation";
import useAuthStore from "./storage/authStore";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import StockDetailScreen from "./screens/StockDetail";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? "";
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? "";
const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

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

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 0,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'StockDetail') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="StockDetail" component={StockDetailScreen} options={{ headerShown: false }} />

    </Tab.Navigator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                  component={TabNavigator}
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
              </Stack.Navigator>
            </QueryClientProvider>
          </PrivyProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Suspense>
    </GestureHandlerRootView>
  );
};

export default AppIndex;
