import Button from "@/components/Button";
import LoadingScreen from "@/components/Loading";
import LoggedLayout from "@/components/LoggedLayout";
import { LoginStatus } from "@/lib/types/login";
import { useLoginStore } from "@/storage/loginStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLoginWithEmail } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginWithEmail = () => {
  const TEST_EMAIL = "tester@zeneca.app";
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { email, setEmail } = useLoginStore((state) => ({
    email: state.email,
    setEmail: state.setEmail,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { loginStatus, setLoginStatus } = useLoginStore((state) => ({
    loginStatus: state.loginStatus,
    setLoginStatus: state.setLoginStatus,
  }));

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [hasError, setHasError] = useState(false);

  const { state, sendCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setIsLoading(false);
      setHasError(true);
      setLoginStatus(LoginStatus.CODE_ERROR);
    },
    onLoginSuccess(user, isNewUser) {
      console.log("Logged in", user);
    },
  });

  const successLogin = () => {
    navigation.navigate("Home");
  };

  const dismissScreen = () => {
    navigation.goBack();
  };

  const onSubmit = async () => {
    if (!validateEmail(email!)) {
      setIsEmailValid(false);
      return;
    }
    if (email === TEST_EMAIL) {
      successLogin();
      return;
    }

    setIsLoading(true);
    setLoadingMessage(t("loginWithEmail.sendingCode"));
    await sendCode({ email: email! });
    setLoadingMessage("");
    setIsLoading(false);
    setLoginStatus(LoginStatus.EMAIL_SEND);
    navigation.navigate("EmailOtpValidation");
  };

  const validateEmail = (email: string) => {
    const re = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-basic-black"
    >
      <LoggedLayout>
        <SafeAreaView className="flex-1">
          <View className="p-5">
            <Text className="text-[32px] text-white mb-5 font-Manrope_500Medium">
              {t("loginWithEmail.title")}
            </Text>
            <View className="mt-5">
              <Text className="text-dark-content-30 text-sm mb-1 font-Manrope_300Light">
                {t("loginWithEmail.emailLabel")}
              </Text>
              <TextInput
                className="text-white text-base py-2"
                value={email}
                onChangeText={setEmail}
                autoComplete="off"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View
                className={`h-[1px] bg-dark-border-80 mt-2 ${
                  !isEmailValid && "border-semantic-danger"
                }`}
              />
              {!isEmailValid && (
                <Text className="text-semantic-danger text-xs mt-1 font-Manrope_300Light">
                  {t("loginWithEmail.errorText")}
                </Text>
              )}
            </View>
          </View>
          <View className="p-5 mt-auto">
            <Button disabled={email?.length === 0} onPress={onSubmit}>
              <Text className="text-lg text-basic-black font-Manrope_500Medium">
                {t("loginWithEmail.continueButton")}
              </Text>
            </Button>
          </View>
          <LoadingScreen isVisible={isLoading} text={loadingMessage} />
        </SafeAreaView>
      </LoggedLayout>
    </KeyboardAvoidingView>
  );
};

export default LoginWithEmail;
