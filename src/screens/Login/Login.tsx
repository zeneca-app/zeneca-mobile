import GradientCircle from "@/assets/zeneca-gradient-circle.svg";
import Logo from "@/assets/zeneca-logo-bright.svg";
import LogoLetter from "@/assets/zeneca-logo-letters.svg";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import config from "@/config";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLoginWithOAuth } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { cssInterop } from "nativewind";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, Text, View } from "react-native";

const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { login: loginWithOAuth, state } = useLoginWithOAuth();

  const loginOptionsRef = useRef<BottomSheetModal>(null);

  console.log(state);

  const loginWithOptions = () => {
    loginOptionsRef.current?.present();
  };

  const showSignUp = config.SHOW_SIGN_UP;

  const loginWithEmail = () => {
    navigation.navigate("LoginWithEmail");
    loginOptionsRef.current?.dismiss();
  };

  const loginWithGmail = async () => {
    await loginWithOAuth({ provider: "google" });
    loginOptionsRef.current?.dismiss();
  };

  cssInterop(LogoLetter, { className: "style" });

  return (
    <SafeAreaView className="flex-1 justify-start items-stretch bg-basic-black">
      <View className="flex flex-1 justify-between items-stretch px-layout">
        <View className="relative flex justify-center items-center w-full">
          <GradientCircle className="relative" />
          <View className="absolute flex justify-center items-center">
            <Logo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12" />
          </View>
        </View>
        <View className="flex-1 flex justify-between">
          <View className="flex flex-1 justify-center items-center gap-6">
            <LogoLetter className="h-8 w-full" />
            <View>
              <Text className="text-caption-xl text-gray-50 text-center">
                {t("login.description_line_1")}
              </Text>
              <Text className="text-caption-xl text-gray-50 text-center">
                {t("login.description_line_2")}
              </Text>
            </View>
          </View>
          <View className="flex items-stretch justify-start gap-buttons">
            <Button onPress={loginWithOptions} className="w-full">
              <Text className="text-button-m">{t("login.signUpButton")}</Text>
            </Button>
            {showSignUp && (
              <Button
                onPress={loginWithOptions}
                className="w-full"
                variant="link"
              >
                <Text className="text-button-m text-white">
                  {t("login.signInButton")}
                </Text>
              </Button>
            )}
          </View>
        </View>
      </View>
      <BottomSheet ref={loginOptionsRef}>
        <BottomSheetView className="px-layout items-stretch rounded-card m-2 flex gap-buttons pb-14">
          <Button onPress={loginWithEmail}>
            <Ionicons name="mail" size={24} color="black" />
            <Text className="text-button-m">
              {t("loginOptions.emailOption")}
            </Text>
          </Button>
          <Button onPress={loginWithGmail}>
            <AntDesign name="google" size={24} color="black" />
            <Text className="text-button-m">
              {t("loginOptions.googleOption")}
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Login;
