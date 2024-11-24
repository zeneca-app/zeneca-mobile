import { loginLoginOrCreate, usersMe } from "@/client/";
import LoadingScreen from "@/components/Loading";
import LoginButton from "@/components/login/button";
import ZenecaSafeAreaView from "@/components/ZenecaSafeAreaView";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { LoginStatus } from "@/lib/types/login";
import { useChainStore } from "@/storage/chainStore";
import { DBUser } from "@/storage/interfaces";
import { useUserStore } from "@/storage/userStore";
import { colors } from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getUserEmbeddedEthereumWallet,
  isNotCreated,
  useEmbeddedWallet,
  useLoginWithOAuth,
  usePrivy,
} from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LoginOptions = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { setUser } = useUserStore((state) => state);
  const { logout, user, getAccessToken } = usePrivy();
  type PrivyUser = typeof user;
  const wallet = useEmbeddedWallet();

  const chain = useChainStore((state) => state.chain);
  const setChain = useChainStore((state) => state.setChain);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.INITIAL,
  );

  const { login, state } = useLoginWithOAuth({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setIsLoading(false);
      setLoginStatus(LoginStatus.CODE_ERROR);
      logout();
    },
    onSuccess: (user, isNewUser) => {
      console.log("onSuccess");
    },
  });

  const handleConnection = useCallback(
    async (user: PrivyUser): Promise<void> => {
      setIsLoading(true);
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      const userAddress = getUserEmbeddedEthereumWallet(user)?.address;

      if (isNotCreated(wallet)) {
        await wallet.create!();
      }

      if (!userAddress) {
        return;
      }

      const smartAccount = await getPimlicoSmartAccountClient(
        userAddress as `0x${string}`,
        chain,
        wallet,
      );

      if (!smartAccount || !smartAccount.account) {
        throw new Error("Cannot create wallet");
      }

      const account = user?.linked_accounts.find(
        (account) => account.type === "google_oauth",
      );

      if (!account) {
        return;
      }

      // create user on the backend
      await loginLoginOrCreate({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          email: account.email,
          has_third_party_auth: true,
          wallet: {
            address: userAddress as `0x${string}`,
            smart_account_address: smartAccount?.account
              ?.address as `0x${string}`,
          },
        },
      });

      const userData = await fetchUserData(accessToken!);

      setUser({ ...userData, token: accessToken! } as DBUser);

      await SecureStore.setItemAsync(`token-${userAddress}`, accessToken!);
      setIsLoading(false);
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

  useEffect(() => {
    if (state.status === "done" && user) {
      try {
        setIsLoading(true);
        handleConnection(user)
          .then(() => {
            setIsLoading(false);
            console.log("success");
            navigation.navigate("Home");
          })
          .catch((e) => {
            console.error("Error Handling Connection", e);
            setIsLoading(false);
            throw new Error(e);
          });
      } catch (e) {
        console.log("Error Connecting Stuffs", e);
        throw new Error(e as any);
      }
    } else if (state.status === "initial") {
      setLoginStatus(LoginStatus.INITIAL);
    }
  }, [state, user]);

  const loginWithGmail = async () => {
    await login({ provider: "google" });
  };

  const loginWithEmail = () => {
    navigation.navigate("LoginWithEmail");
  };

  return (
    <ZenecaSafeAreaView style={styles.safeArea}>
      <View style={styles.modalOverlay}>
        <View style={styles.topContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{t("loginOptions.title")}</Text>
          <View style={styles.modalContent}>
            <View style={styles.buttonsContainer}>
              <LoginButton
                icon="mail"
                text={t("loginOptions.emailOption")}
                onPress={loginWithEmail}
                isPrimary={true}
                disabled={isLoading}
              />
              <LoginButton
                icon="logo-google"
                text={t("loginOptions.googleOption")}
                onPress={loginWithGmail}
                isPrimary={false}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            {t("loginOptions.terms")}{" "}
            <Text style={styles.termsTextLink}>
              {t("loginOptions.termsLink")}
            </Text>
            .
          </Text>
        </View>
      </View>

      <LoadingScreen isVisible={isLoading} text={loadingMessage} />
    </ZenecaSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#19181B", // Semi-transparent background
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topContent: {
    flex: 1,
  },
  title: {
    marginLeft: 25,
    fontSize: 32,
    color: "white",
    marginBottom: 20,
    fontFamily: "Manrope_500Medium",
  },
  backButton: {
    marginLeft: 20,
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#19181B",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  handleBar: {
    marginTop: 10,
    width: 50,
    height: 4,
    backgroundColor: "#312F36",
    borderRadius: 2,
  },
  buttonsContainer: {
    width: "100%",
    paddingVertical: 60,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  commonButtonPrimary: {
    flexDirection: "row",
    width: "100%",
    height: 55,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 25,
  },
  commonButtonSecondary: {
    flexDirection: "row",
    width: "100%",
    height: 55,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252328",
    marginBottom: 25,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonEmailContainer: {
    marginTop: 30,
  },
  commonButtonPrimaryText: {
    color: colors.darkHighlight,
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
  commonButtonSecondaryText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
  termsContainer: {
    width: "100%",
    paddingHorizontal: 30,
    paddingBottom: 20,
    alignItems: "center",
  },
  termsText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    marginTop: 40,
  },
  termsTextLink: {
    color: "white",
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    textDecorationLine: "underline",
  },
});

export default LoginOptions;
