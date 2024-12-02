import { useEffect } from "react";
import { RootStackParamList } from "@/navigation/types";
import DepositCrypto from "@/screens/Deposit/DepositCrypto";
import DepositWithBank from "@/screens/Deposit/DepositWithBank";
import ETFDetail from "@/screens/ETF/ETFDetail";
import ETFPurchase from "@/screens/ETF/ETFPurchase";
import ETFPurchaseConfirmation from "@/screens/ETF/ETFPurchaseConfirmation";
import ETFPurchaseSuccess from "@/screens/ETF/ETFPurchaseSuccess";
import ExploreETFs from "@/screens/Explore/ExploreEtfs";
import HomeScreen from "@/screens/HomeScreen";
import KYCPreview from "@/screens/KYCVerification/KYCPreview";
import KYCProvider from "@/screens/KYCVerification/KYCProvider";
import KYCSuccess from "@/screens/KYCVerification/KYCSuccess";
import Login from "@/screens/Login/Login";
import LoginOptions from "@/screens/Login/LoginOptions";
import LoginOtpVerification from "@/screens/Login/LoginOtpVerification";
import LoginWithEmail from "@/screens/Login/LoginWithEmail";
import OrderHistory from "@/screens/OrderHistory";
import OnBoarding from "@/screens/Onboarding/OnBoarding";
import ProfileScreen from "@/screens/ProfileScreen";
import { useUserStore } from "@/storage/userStore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCheckUpdate } from "@/hooks/useCheckUpdate";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProfileButton from "@/components/ProfileButton";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const { checkUpdate } = useCheckUpdate();

  useEffect(() => {
    if (__DEV__) return;
    checkUpdate();
  }, []);

  return (
    <Stack.Navigator initialRouteName={!user ? "Login" : "Home"}>
      <Stack.Group>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{
            title: '',
            headerBackTitle: '',
            headerStyle: { backgroundColor: Colors.basicBlack },
            headerShadowVisible: false,
            headerTransparent: true,
            //headerShown: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={22} color="white" />
              </TouchableOpacity>
            ),
          }}
          name="EmailOtpValidation"
          component={LoginOtpVerification}
        />
        <Stack.Screen
          options={{
            title: '',
            headerBackTitle: '',
            headerStyle: { backgroundColor: Colors.basicBlack },
            headerShadowVisible: false,
            headerTransparent: true,
            //headerShown: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={22} color="white" />
              </TouchableOpacity>
            ),
          }}
          name="LoginWithEmail"
          component={LoginWithEmail}
        />
        <Stack.Screen
          options={{
            title: '',
            headerBackTitle: '',
            headerStyle: { backgroundColor: Colors.basicBlack },
            headerShadowVisible: false,
            headerTransparent: true,
            //headerShown: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={22} color="white" />
              </TouchableOpacity>
            ),
          }}
          name="LoginOptions"
          component={LoginOptions}
        />
      </Stack.Group>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          headerLeft: () => <ProfileButton />
        }}
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          //headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="DepositCrypto"
        component={DepositCrypto}
      />
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          //headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="DepositWithBank"
        component={DepositWithBank}
      />

      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          //headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="ExploreETFs"
        component={ExploreETFs}
      />

      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          //headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="ETFDetail"
        component={ETFDetail}
      />

      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          //headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="ETFPurchase"
        component={ETFPurchase}
      />

      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: '',
          headerStyle: { backgroundColor: Colors.basicBlack },
          headerShadowVisible: false,
          headerTransparent: true,
          //headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="ETFPurchaseConfirmation"
        component={ETFPurchaseConfirmation}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="ETFPurchaseSuccess"
        component={ETFPurchaseSuccess}
      />

      <Stack.Screen
        options={{ headerShown: false, presentation: "modal" }}
        name="OrderHistory"
        component={OrderHistory}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="OnBoarding"
        component={OnBoarding}
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
    </Stack.Navigator>
  );
};

MainNavigation.displayName = "MainNavigation";

export default MainNavigation;
