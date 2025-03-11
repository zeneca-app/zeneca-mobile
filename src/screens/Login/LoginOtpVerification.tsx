import { usersMe } from "@/client";
import { loginLoginOrCreate } from "@/client/";
import StatusModal, { ModalState } from "@/components/status-modal";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { LoginStatus } from "@/lib/types/login";
import { useChainStore } from "@/storage/chainStore";
import { DBUser } from "@/storage/interfaces";
import { useLoginStore } from "@/storage/loginStore";
import { useUserStore } from "@/storage/";
import {
  getUserEmbeddedEthereumWallet,
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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import LoggedLayout from "@/components/LoggedLayout";
import Button from "@/components/Button";


const LoginOtpScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setUser } = useUserStore((state) => ({
    setUser: state.setUser
  }));
  const { email } = useLoginStore((state) => ({
    email: state.email,
  }));

  const [code, setCode] = useState<`${number | ""}`>("");

  const [modalState, setModalState] = useState<ModalState>("dismissed");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const { loginStatus, setLoginStatus } = useLoginStore((state) => ({
    loginStatus: state.loginStatus,
    setLoginStatus: state.setLoginStatus,
  }));

  const { logout, user, isReady, getAccessToken } = usePrivy();

  const { state, loginWithCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setModalState("error");
      setLoginStatus(LoginStatus.CODE_ERROR);
      setErrorMessage(error.message);
    },
    onLoginSuccess: async (user) => {
      console.log("user", user);
      console.log("Logged in", user);
      const accessToken = await getAccessToken();
      console.log("accessToken", accessToken);
      const account = user?.linked_accounts.find(
        (account) => account.type === "email",
      );
      if (!account) {
        return;
      }
      console.log("account", account);

      await loginLoginOrCreate({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          email: account.address
        },
      });

      const userData = await fetchUserData(accessToken!);

      setUser({ ...userData, token: accessToken! } as DBUser);
      navigation.navigate("Home");
    },
  });

  const fetchUserData = async (token: string) => {
    const userData = await usersMe({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.data);
    return userData;
  };


  const isCodeFilled = code.length === 6;

  const handleOtpFilled = (otp: string) => {
    setCode(otp as `${number | ""}`);
  };

  const handleConfirmCode = async () => {
    try {
      console.log("Logging in with code", code);
      setLoadingMessage(t("loginWithEmail.verifyingCode"));
      await loginWithCode({
        code: code,
        email,
      });
      setLoginStatus(LoginStatus.CODE_SUCCESS);
    } catch (error) {
      console.error("Error confirming code", error);
      setLoadingMessage("");
      setLoginStatus(LoginStatus.CODE_ERROR);
      setModalState("error");
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-basic-black"
    >
      <LoggedLayout>
        <SafeAreaView className="flex-1">
          <View className="p-layout">
            <Text className="heading-s text-dark-content-white mb-layout-s">
              {t("emailOtpValidation.title")}
            </Text>
            <Text className="caption-xl text-gray-50 mb-[30px]">
              {t("emailOtpValidation.subtitle")} {email}
            </Text>
            <View className="mb-[30px]">
              <OtpInput
                numberOfDigits={6}
                focusColor="#5A10EF"
                focusStickBlinkingDuration={500}
                onTextChange={(text) => setCode(text as `${number | ""}`)}
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
          <View className="p-layout mt-auto">
            <Button
              disabled={!isCodeFilled}
              onPress={handleConfirmCode}
            >
              <Text
                className={`text-[18px] font-Manrope_500Medium ${!isCodeFilled ? "text-dark-content-30" : "text-black"
                  }`}
              >
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
      </LoggedLayout>
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

export default LoginOtpScreen;
