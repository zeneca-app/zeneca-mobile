import { usersMe } from "@/client";
import { loginLoginOrCreate } from "@/client/";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import StatusModal, { ModalState } from "@/components/status-modal";
import Text from "@/components/Text";
import TopNavBar from "@/components/TopNavBar";
import COLORS from "@/constants/colors";
import useUserServices from "@/hooks/useUserServices";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { LoginStatus } from "@/lib/types/login";
import { useChainStore } from "@/storage/chainStore";
import { DBUser } from "@/storage/interfaces";
import { useLoginStore } from "@/storage/loginStore";
import {
  isNotCreated,
  useEmbeddedWallet,
  useLoginWithEmail,
  usePrivy,
} from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

const LoginOtpScreen = ({ route }) => {
  const email = route?.params?.email || "";

  const { t } = useTranslation();
  const navigation = useNavigation();

  const [code, setCode] = useState<`${number | ""}`>("");

  const [modalState, setModalState] = useState<ModalState>("dismissed");
  const [errorMessage, setErrorMessage] = useState("");

  const { getAccessToken } = usePrivy();
  type PrivyUser = typeof user;

  const { loginWithCode, loginWithEmailState } = useUserServices();

  /* › */

  const goToNextScreen = () => {
    navigation.navigate("Home");
  };

  const isCodeFilled = code.length === 6;

  const handleOtpFilled = (otp: string) => {
    setCode(otp as `${number | ""}`);
  };

  const handleConfirmCode = async () => {
    try {
      await loginWithCode({ code, email });
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error confirming code", error);
    }
  };

  const dismissScreen = () => {
    navigation.navigate("LoginWithEmail");
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
                {t("emailOtpValidation.title")}
              </Text>
              <Text className="text-body-s text-gray-50">
                {t("emailOtpValidation.subtitle")} {email}
              </Text>
              <View className="pb-8">
                <OtpInput
                  numberOfDigits={6}
                  autoFocus
                  focusColor={COLORS.electric[50]}
                  focusStickBlinkingDuration={500}
                  onTextChange={(text) => setCode(text as `${number | ""}`)}
                  onFilled={handleOtpFilled}
                  theme={{
                    containerStyle: styles.otpContainer,
                    inputsContainerStyle: styles.otpInputsContainer,
                    pinCodeContainerStyle: styles.otpPinCodeContainer,
                    pinCodeTextStyle: styles.otpPinCodeText,
                    focusStickStyle: styles.otpFocusStick,
                    focusedPinCodeContainerStyle:
                      styles.otpActivePinCodeContainer,
                  }}
                />
              </View>
            </View>
          </View>
          <View className="px-layout flex gap-buttons">
            <Button disabled={!isCodeFilled} onPress={handleConfirmCode}>
              <Text className="text-buttom-m">
                {t("emailOtpValidation.continueButton")}
              </Text>
            </Button>
          </View>

          <StatusModal
            modalState={modalState}
            text={
              modalState === "loading"
                ? loadingMessage
                : t("loginWithEmail.errorCodeText")
            }
            onClose={() => {
              setModalState("dismissed");
              setCode("");
              navigation.navigate("LoginWithEmail");
            }}
            actionButtonText={t("loginWithEmail.errorCodeTryAgain")}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
      <FullScreenLoader visible={false} />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#0D0B0D",
  },
  safeAreaContainer: {
    flex: 1,
  },
  topContent: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 20,
    fontFamily: "Manrope_500Medium",
  },
  subtitle: {
    fontSize: 16,
    color: "#95929F",
    marginBottom: 30,
    fontFamily: "Manrope_400Regular",
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLineError: {
    borderColor: "red",
  },
  label: {
    color: "#95929F",
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "Manrope_300Light",
  },
  codeInputContainer: {
    marginBottom: 30,
  },
  input: {
    color: "#fff",
    fontSize: 16,
    paddingVertical: 8,
  },
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Manrope_300Light",
  },
  inputLine: {
    height: 1,
    backgroundColor: "#333",
    marginTop: 8,
  },
  bottomContent: {
    padding: 20,
    marginTop: "auto",
  },
  continueButton: {
    borderRadius: 35,
    backgroundColor: "white",
    padding: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "rgba(215, 191, 250, 0.17)",
  },
  continueButtonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Manrope_500Medium",
  },
  continueButtonTextDisabled: {
    color: "rgba(233, 220, 251, 0.45)",
    fontSize: 18,
    fontFamily: "Manrope_500Medium",
  },
});

export default LoginOtpScreen;
