import "./i18n";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { PrivyProvider } from "@privy-io/expo";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
import TransactionReceiptScreen from "./screens/TransactionReceipt";
import InvestmentComingSoonScreen from "./screens/InvestmentComingSoon";
import SendSuccessScreen from "./screens/SendSuccess";

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID ?? "";
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID ?? "";
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type CustomTabBarProps = BottomTabBarProps & {
  state: TabNavigationState<ParamListBase>;
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') {
          iconName = 'wallet';
        } else if (route.name === 'InvestmentComingSoon') {
          iconName = 'cash';
        } else {
          iconName = 'help-circle'; // Default icon
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


const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="InvestmentComingSoon" component={InvestmentComingSoonScreen} />
    </Tab.Navigator>
  );
};

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
              <Stack.Navigator initialRouteName={logged ? "MainTabs" : "Login"}>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Login"
                  component={Login}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="MainTabs"
                  component={MainTabs}
                />
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
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="TransactionReceipt"
                  component={TransactionReceiptScreen}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="SendSuccess"
                  component={SendSuccessScreen}
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    height: 95,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    justifyContent: 'space-around',
    alignItems: 'center',

  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});