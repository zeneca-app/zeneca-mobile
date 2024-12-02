import Ionicons from "@expo/vector-icons/Ionicons";
import { useLoginWithEmail } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
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
import { OtpInput } from "react-native-otp-entry";

type EmailOtpValidationScreenProps = {
  route: {
    params: {
      email: string;
    };
  };
};

const EmailOtpValidationScreen = ({ route }: EmailOtpValidationScreenProps) => {
  const { t } = useTranslation();
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState("");
  const navigation = useNavigation();


  const { loginWithCode } = useLoginWithEmail({
    onLoginSuccess(user, isNewUser) {
      console.log("onLoginSuccess user", user);
      console.log("onLoginSuccess isNewUser", isNewUser);
      navigation.navigate("Home");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const handleOtpFilled = (otp: string) => {
    setVerificationCode(otp);
  };

  const handleContinue = () => {
    loginWithCode({ code: verificationCode, email: email });
  };

  const isCodeFilled = verificationCode.length === 6;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-background-100"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-layout">

          <Text className="text-heading-s text-dark-content-white font-sans mb-2.5">
            {t("emailOtpValidation.title")}
          </Text>

          <Text className="text-caption-xl text-gray-50 font-sans mb-7.5">
            {t("emailOtpValidation.subtitle")} {email}
          </Text>
          <View className="mb-7.5">
            <OtpInput
              numberOfDigits={6}
              focusColor="#5A10EF"
              focusStickBlinkingDuration={500}
              onTextChange={(text) => setVerificationCode(text)}
              onFilled={handleOtpFilled}
              theme={{
                containerStyle: styles.otpContainer,
                inputsContainerStyle: styles.otpInputsContainer,
                pinCodeContainerStyle: styles.otpPinCodeContainer,
                pinCodeTextStyle: styles.otpPinCodeText,
                focusStickStyle: styles.otpFocusStick,
                focusedPinCodeContainerStyle: styles.otpActivePinCodeContainer,
              }}
            />
          </View>
        </View>
        <View className="p-layout">
          <TouchableOpacity
            className={`rounded-full bg-dark-content-white p-4 items-center ${!isCodeFilled ? "bg-dark-content-disabled" : ""
              }`}
            disabled={!isCodeFilled}
            onPress={handleContinue}
          >
            <Text
              className={`text-body-m font-sans ${!isCodeFilled ? "text-dark-content-30" : "text-dark-content-dark"
                }`}
            >
              {t("emailOtpValidation.continueButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    width: "100%",
  },
  otpInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpPinCodeContainer: {
    width: 40,
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#313036",
    backgroundColor: "transparent",
    borderRadius: 0,
  },
  otpPinCodeText: {
    color: "#fff",
    fontSize: 24,
  },
  otpFocusStick: {
    display: "none", // Hide the focus stick
  },
  otpActivePinCodeContainer: {
    borderBottomColor: "#5A10EF",
    borderBottomWidth: 2,
  },
});

export default EmailOtpValidationScreen;
