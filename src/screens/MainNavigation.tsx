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
import { useUserStore } from "@/storage/";
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

  const backButton = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={22} color="white" />
    </TouchableOpacity>
  );

  // Common header options
  const defaultScreenOptions = {
    title: '',
    headerBackTitle: '',
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
      headerLeft: () => <ProfileButton />
    },
    modalScreen: { headerShown: false, presentation: "modal" as const },
    profileScreen: {
      headerShown: false,
      presentation: 'card' as const,
      animation: 'slide_from_left' as const,
    }
  };

  return (
    <Stack.Navigator initialRouteName={!user ? "Login" : "Home"}>
      {/* Home Screens */}
      <Stack.Screen name="Home" component={HomeScreen} options={screenConfigs.homeHeader} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={screenConfigs.profileScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} options={screenConfigs.modalScreen} />

      {/* Login Screens */}
      <Stack.Group>
        <Stack.Screen name="Login" component={Login} options={screenConfigs.noHeader} />
        <Stack.Screen name="EmailOtpValidation" component={LoginOtpVerification} options={screenConfigs.defaultHeader} />
        <Stack.Screen name="LoginWithEmail" component={LoginWithEmail} options={screenConfigs.defaultHeader} />
        <Stack.Screen name="LoginOptions" component={LoginOptions} options={screenConfigs.defaultHeader} />
      </Stack.Group>


      {/* Deposit Screens */}
      <Stack.Screen name="DepositCrypto" component={DepositCrypto} options={screenConfigs.defaultHeader} />
      <Stack.Screen name="DepositWithBank" component={DepositWithBank} options={screenConfigs.defaultHeader} />

      {/* ETF Screens */}
      <Stack.Screen name="ExploreETFs" component={ExploreETFs} options={screenConfigs.defaultHeader} />
      <Stack.Screen name="ETFDetail" component={ETFDetail} options={screenConfigs.defaultHeader} />
      <Stack.Screen name="ETFPurchase" component={ETFPurchase} options={screenConfigs.defaultHeader} />
      <Stack.Screen name="ETFPurchaseConfirmation" component={ETFPurchaseConfirmation} options={screenConfigs.defaultHeader} />
      <Stack.Screen name="ETFPurchaseSuccess" component={ETFPurchaseSuccess} options={screenConfigs.noHeader} />

      {/* Other Screens */}

      {/* KYC and Onboarding Screens */}
      <Stack.Screen name="OnBoarding" component={OnBoarding} options={screenConfigs.noHeader} />
      <Stack.Screen name="KYCPreview" component={KYCPreview} options={screenConfigs.noHeader} />
      <Stack.Screen name="KYCProvider" component={KYCProvider} options={screenConfigs.noHeader} />
      <Stack.Screen name="KYCSuccess" component={KYCSuccess} options={screenConfigs.noHeader} />
    </Stack.Navigator>
  );
};

MainNavigation.displayName = "MainNavigation";

export default MainNavigation;
