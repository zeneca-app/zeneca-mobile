import { usersMe } from "@/client";
import { loginLoginOrCreate } from "@/client/";
import StatusModal, { ModalState } from "@/components/status-modal";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { LoginStatus } from "@/lib/types/login";
import { useChainStore } from "@/storage/chainStore";
import { DBUser } from "@/storage/interfaces";
import { useLoginStore } from "@/storage/loginStore";
import { useUserStore } from "@/storage/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
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

const LoginOtpScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setUser } = useUserStore((state) => state);
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
  type PrivyUser = typeof user;

  const wallet = useEmbeddedWallet();

  const chain = useChainStore((state) => state.chain);

  const { state, loginWithCode } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setModalState("error");
      setLoginStatus(LoginStatus.CODE_ERROR);
      setErrorMessage(error.message);
    },
    onLoginSuccess(user) {
      console.log("Logged in", user);
    },
  });

  const handleConnection = useCallback(
    async (user: PrivyUser): Promise<void> => {
      setModalState("loading");
      let address = getUserEmbeddedEthereumWallet(user)?.address;
      const accessToken = await getAccessToken();

      if (isNotCreated(wallet)) {
        console.log("Creating wallet...");
        await wallet.create!();
      }

      if (!address) {
        return;
      }

      const smartAccount = await getPimlicoSmartAccountClient(
        address as `0x${string}`,
        chain,
        wallet,
      );

      if (!smartAccount || !smartAccount.account) {
        throw new Error("Cannot create wallet");
      }

      const account = user?.linked_accounts.find(
        (account) => account.type === "email",
      );
      if (!account) {
        return;
      }

      await loginLoginOrCreate({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          email: account.address,
          has_third_party_auth: false,
          wallet: {
            address: address as `0x${string}`,
            smart_account_address: smartAccount?.account
              ?.address as `0x${string}`,
          },
        },
      });

      const userData = await fetchUserData(accessToken!);
      setUser({ ...userData, token: accessToken! } as DBUser);

      await SecureStore.setItemAsync(`token-${address}`, accessToken!);
      setModalState("dismissed");
      goToNextScreen();
    },
    [user, wallet],
  );

  const fetchUserData = async (token: string) => {
    const userData = await usersMe({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.data);
    return userData;
  };

  const goToNextScreen = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    if (state.status === "done" && user) {
      try {
        setModalState("loading");
        handleConnection(user)
          .then(() => {
            setModalState("dismissed");
            console.log("success");
            goToNextScreen();
          })
          .catch((e) => {
            console.error("Error Handling Connection", e);
            setLoginStatus(LoginStatus.CODE_ERROR);
            navigation.navigate("Login");
          });
      } catch (e) {
        setModalState("error");
        console.log("Error Connecting Stuffs", e);
        navigation.navigate("Login");
      }
    } else if (state.status === "initial") {
      setLoginStatus(LoginStatus.INITIAL);
    }
  }, [state, user]);

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

  const dismissScreen = () => {
    navigation.navigate("LoginWithEmail");
  };

  return (
    <LoggedLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
      >
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.topContent}>
            <Text style={styles.title}>{t("emailOtpValidation.title")}</Text>
            <Text style={styles.subtitle}>
              {t("emailOtpValidation.subtitle")} {email}
            </Text>
            <View style={styles.codeInputContainer}>
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
          <View style={styles.bottomContent}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isCodeFilled && styles.continueButtonDisabled,
              ]}
              disabled={!isCodeFilled}
              onPress={handleConfirmCode}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  !isCodeFilled && styles.continueButtonTextDisabled,
                ]}
              >
                {t("emailOtpValidation.continueButton")}
              </Text>
            </TouchableOpacity>
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
    </LoggedLayout>
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
