import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import Text from "@/components/Text";
import TopNavBar from "@/components/TopNavBar";
import useUserServices from "@/hooks/useUserServices";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  View,
} from "react-native";

const LoginWithEmail = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [email, setEmail] = useState<string | undefined>("");

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

  const { sendCode, isLoading, error } = useUserServices();

  const [submitted, setSubmitted] = useState<boolean>(false);

  const isSubmitDisabled = !email || (submitted && !isEmailValid);
  const displayError = submitted && !isEmailValid;

  const handleEmailChange = (email: string) => {
    setIsEmailValid(validateEmail(email));
    setEmail(email);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!email || !validateEmail(email!)) {
      setIsEmailValid(false);
      return;
    }
    try {
      await sendCode({ email: email! });
      navigation.navigate("EmailOtpValidation", { email: email });
    } catch (error) {
      console.error("ERRRORRRR", error);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex flex-1 bg-basic-black"
      >
        <SafeAreaView className="flex flex-1">
          <View className="flex flex-1 ">
            <TopNavBar />
            <View className="flex flex-1 justify-start items-stretch gap px-layout">
              <Text className="text-heading-s text-gray-10">
                {t("loginWithEmail.title")}
              </Text>
              <View className="mt-12">
                <Text className="text-gray-50 text-body-s">
                  {t("loginWithEmail.emailLabel")}
                </Text>
                <TextInput
                  className="text-white text-body-m py-4"
                  autoFocus
                  value={email}
                  onChangeText={handleEmailChange}
                  autoComplete="off"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View
                  className={`transition-colors duration-500 h-px rounded-full ${displayError ? "bg-semantic-danger" : "bg-gray-70"}`}
                />
                <View className="h-8 w-full">
                  {displayError && (
                    <Text className="text-semantic-danger text-body-s">
                      {!email && t("loginWithEmail.errorText")}
                      {email && !isEmailValid && t("loginWithEmail.errorText")}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View className="px-layout">
            <Button disabled={isSubmitDisabled} onPress={handleSubmit}>
              <Text className="text-inherit text-button-m">
                {t("loginWithEmail.continueButton")}
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <FullScreenLoader visible={isLoading} />
    </>
  );
};

LoginWithEmail.displayName = "LoginWithEmail";

export default LoginWithEmail;
