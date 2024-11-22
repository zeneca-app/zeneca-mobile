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
import QuoteScreen from "@/screens/Quote";
import QuoteConfirmationScreen from "@/screens/QuoteConfirmation";
import RecipientsScreen from "@/screens/Recipients";
import OrderHistory from "@/screens/OrderHistory";
import OnBoarding from "@/screens/Onboarding/OnBoarding";
import Send from "@/screens/Send";
import SendConfirmation from "@/screens/SendConfirmation";
import SendSuccessScreen from "@/screens/SendSuccess";
import TransactionReceiptScreen from "@/screens/TransactionReceipt";
import ProfileScreen from "@/screens/ProfileScreen";
import { useUserStore } from "@/storage/userStore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCheckUpdate } from "@/hooks/useCheckUpdate";


const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
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
          options={{ headerShown: false, presentation: "modal" }}
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EmailOtpValidation"
          component={LoginOtpVerification}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginWithEmail"
          component={LoginWithEmail}
        />
        <Stack.Screen
          options={{ headerShown: false }}
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
        name="DepositCrypto"
        component={DepositCrypto}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="DepositWithBank"
        component={DepositWithBank}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="ExploreETFs"
        component={ExploreETFs}
      />

      <Stack.Screen
        options={{ headerShown: false }}
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
        name="ETFDetail"
        component={ETFDetail}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="ETFPurchase"
        component={ETFPurchase}
      />

      <Stack.Screen
        options={{ headerShown: false, presentation: "modal" }}
        name="ETFPurchaseConfirmation"
        component={ETFPurchaseConfirmation}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="ETFPurchaseSuccess"
        component={ETFPurchaseSuccess}
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
  );
};

MainNavigation.displayName = "MainNavigation";

export default MainNavigation;
