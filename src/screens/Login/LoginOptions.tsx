import { loginLoginOrCreate, usersMe } from "@/client/";
import LoginButton from "@/components/login/button";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { LoginStatus } from "@/lib/types/login";
import { useChainStore } from "@/storage/chainStore";
import { DBUser } from "@/storage/interfaces";
import { useUserStore } from "@/storage/";
import {
  getUserEmbeddedEthereumWallet,
  isNotCreated,
  useEmbeddedWallet,
  useLoginWithOAuth,
  usePrivy,
} from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  View,
} from "react-native";
import LoggedLayout from "@/components/LoggedLayout";


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
    <LoggedLayout>
      <SafeAreaView className="flex-1 ">
        <View className="flex-1 px-layout pb-layout">
          {/* Header Section */}
          <View className="pt-12">
            <Text className="heading-s text-dark-content-white mb-layout-s">
              {t("loginOptions.title")}
            </Text>
          </View>

          {/* Main Content */}
          <View className="flex-1">
            <View className="space-y-4">
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

          {/* Footer Section */}
          <View className="pb-safe mb-6">
            <Text className="text-dark-content-white caption-l text-center">
              {t("loginOptions.terms")}{" "}
              <Text className="text-dark-content-white caption-l font-medium underline">
                {t("loginOptions.termsLink")}
              </Text>
              .
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LoggedLayout>
  );
};

export default LoginOptions;
