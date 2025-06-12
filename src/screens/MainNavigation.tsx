import ProfileButton from "@/components/ProfileButton";
import { useCheckUpdate } from "@/hooks/useCheckUpdate";
import { RootStackParamList } from "@/navigation/types";
import DepositCrypto from "@/screens/Deposit/DepositCrypto";
import DepositWithBank from "@/screens/Deposit/DepositWithBank";
import ETFDetail from "@/screens/ETF/ETFDetail";
import ETFPurchase from "@/screens/ETF/ETFPurchase";
import ETFPurchaseConfirmation from "@/screens/ETF/ETFPurchaseConfirmation";
import ETFPurchaseSuccess from "@/screens/ETF/ETFPurchaseSuccess";
import ETFSell from "@/screens/ETF/ETFSell";
import ETFSellConfirmation from "@/screens/ETF/ETFSellConfirmation";
import ETFSellSuccess from "@/screens/ETF/ETFSellSuccess";
import ExploreAssets from "@/screens/Explore/ExploreAssets";
import HomeScreen from "@/screens/HomeScreen";
import KYCPreview from "@/screens/KYCVerification/KYCPreview";
import KYCProvider from "@/screens/KYCVerification/KYCProvider";
import KYCSuccess from "@/screens/KYCVerification/KYCSuccess";
import LoginOptions from "@/screens/Login/LoginOptions";
import LoginOtpVerification from "@/screens/Login/LoginOtpVerification";
import LoginWithEmail from "@/screens/Login/LoginWithEmail";
import WelcomeScreen from "@/screens/Login/Welcome";
import OnBoarding from "@/screens/Onboarding/OnBoarding";
import OrderHistory from "@/screens/OrderHistory/OrderHistory";
import OrderHistoryDetail from "@/screens/OrderHistory/OrderHistoryDetail";
import ProfileScreen from "@/screens/ProfileScreen";
import { useUserStore } from "@/storage/";
import { Ionicons } from "@expo/vector-icons";
import { usePrivy } from "@privy-io/expo";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onlineManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  const { user: privyUser } = usePrivy();

  const navigation = useNavigation();
  const { user } = useUserStore();
  const { checkUpdate } = useCheckUpdate();

  useEffect(() => {
    if (__DEV__) return;
    checkUpdate();
  }, []);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status = !!state.isConnected;
      onlineManager.setOnline(status);
    });
  }, []);

  const backButton = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={22} color="white" />
    </TouchableOpacity>
  );

  // Common header options
  const defaultScreenOptions = {
    title: "",
    headerBackTitle: "",
    headerStyle: { backgroundColor: Colors.basicBlack },
    headerShadowVisible: false,
    headerTransparent: true,
    headerLeft: backButton,
  };

  // Screen configurations
  const screenConfigs = {
    noHeader: { headerShown: false },
    defaultHeader: defaultScreenOptions,
    homeHeader: {
      ...defaultScreenOptions,
      headerLeft: () => <ProfileButton />,
    },
    modalScreen: { headerShown: false, presentation: "modal" as const },
    profileScreen: {
      headerShown: false,
      presentation: "card" as const,
      animation: "slide_from_left" as const,
    },
  };

  return (
    <Stack.Navigator initialRouteName={!privyUser ? "Welcome" : "Home"}>
      {/* Home Screens */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={screenConfigs.homeHeader}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={screenConfigs.profileScreen}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={screenConfigs.modalScreen}
      />
      <Stack.Screen
        name="OrderHistoryDetail"
        component={OrderHistoryDetail}
        options={screenConfigs.modalScreen}
      />

      {/* Login Screens */}
      <Stack.Group>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={screenConfigs.noHeader}
        />
        <Stack.Screen
          name="EmailOtpValidation"
          component={LoginOtpVerification}
          options={screenConfigs.defaultHeader}
        />
        <Stack.Screen
          name="LoginWithEmail"
          component={LoginWithEmail}
          options={screenConfigs.defaultHeader}
        />
        <Stack.Screen
          name="LoginOptions"
          component={LoginOptions}
          options={screenConfigs.defaultHeader}
        />
      </Stack.Group>

      {/* Deposit Screens */}
      <Stack.Screen
        name="DepositCrypto"
        component={DepositCrypto}
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="DepositWithBank"
        component={DepositWithBank}
        options={screenConfigs.defaultHeader}
      />

      {/* ETF Screens Explore and Detail */}
      <Stack.Screen
        name="ExploreAssets"
        component={ExploreAssets}
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="ETFDetail"
        component={ETFDetail}
        options={screenConfigs.defaultHeader}
      />

      {/* ETF Purchase Screens */}
      <Stack.Screen
        name="ETFPurchase"
        component={ETFPurchase}
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="ETFPurchaseConfirmation"
        component={ETFPurchaseConfirmation}
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="ETFPurchaseSuccess"
        component={ETFPurchaseSuccess}
        options={screenConfigs.noHeader}
      />

      {/* ETF Sell Screens */}
      <Stack.Screen
        name="ETFSell"
        component={ETFSell}
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="ETFSellConfirmation"
        component={ETFSellConfirmation}
        options={screenConfigs.defaultHeader}
      />
      <Stack.Screen
        name="ETFSellSuccess"
        component={ETFSellSuccess}
        options={screenConfigs.noHeader}
      />

      {/* Other Screens */}

      {/* KYC and Onboarding Screens */}
      <Stack.Screen
        name="OnBoarding"
        component={OnBoarding}
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="KYCPreview"
        component={KYCPreview}
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="KYCProvider"
        component={KYCProvider}
        options={screenConfigs.noHeader}
      />
      <Stack.Screen
        name="KYCSuccess"
        component={KYCSuccess}
        options={screenConfigs.noHeader}
      />
    </Stack.Navigator>
  );
};

MainNavigation.displayName = "MainNavigation";

export default MainNavigation;
