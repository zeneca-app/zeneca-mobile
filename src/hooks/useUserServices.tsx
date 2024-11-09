import { usersMe } from "@/client";
import { loginLoginOrCreate } from "@/client/";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { useChainStore } from "@/storage/chainStore";
import { DBUser } from "@/storage/interfaces";
import { useUserStore } from "@/storage/userStore";
import {
  getUserEmbeddedWallet,
  isNotCreated,
  useEmbeddedWallet,
  useLoginWithEmail,
  usePrivy,
} from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";

const useUserServices = () => {
  const TEST_EMAIL = "tester@zeneca.app";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const { setUser } = useUserStore((state) => state);

  const wallet = useEmbeddedWallet();

  const chain = useChainStore((state) => state.chain);

  const navigation = useNavigation();

  const { logout: privyLogout, getAccessToken } = usePrivy();

  /*   const { updateLogged } = useAuthStore((state) => ({
    updateLogged: state.updateLogged,
  })); */

  const fetchUserData = async (token: string) => {
    const userData = await usersMe({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.data);
    return userData;
  };

  const handleLoginError = (err: Error) => {
    toast({
      title: err.message,
      preset: "error",
    });
  };

  const initUser = async (user) => {
    console.log("====================================");
    console.log("INIT USER");
    console.log("====================================");
    try {
      const address = getUserEmbeddedWallet(user)?.address;
      console.log("address", address);

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
        throw new Error("Cannot create smart account");
      }

      const account = user?.linked_accounts.find(
        (account) => account.type === "email",
      );

      if (!account) {
        throw new Error("Cannot find linked account");
        return;
      }

      const accessToken = await getAccessToken();

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
    } catch (err) {
      console.error("GET EMBEDDED WALLET", err);
      toast({
        title: "Error getting embedded wallet",
        preset: "error",
      });
    }
  };

  const {
    state: loginWithEmailState,
    sendCode,
    loginWithCode,
  } = useLoginWithEmail({
    onError: (error) => {
      console.error("ERRRORRRR", error);
      setIsLoading(false);
      setError(true);
      handleLoginError(error);
    },
    onLoginSuccess(user, isNewUser) {
      console.log("Logged in", user);
      initUser(user);
    },
  });

  const submitEmail = async () => {
    /* if (email === TEST_EMAIL) {
      successLogin();
      return;
    } */

    setIsLoading(true);
    //setLoadingMessage(t("loginWithEmail.sendingCode"));
    await sendCode({ email: email! });
    //setLoadingMessage("");
    setIsLoading(false);
    //setLoginStatus(LoginStatus.EMAIL_SEND);
    navigation.navigate("EmailOtpValidation");
  };

  const onLogout = async () => {
    try {
      await logout();
      nextLogout();
    } catch (err) {
      const e = err as Error;
      toast({
        title: e?.message ?? "Login Error",
        preset: "error",
      });
    }
  };

  const nextLogout = () => {
    navigation.navigate("Login");
  };

  const logout = async () => {
    privyLogout();
  };

  return {
    logout,
    submitEmail,
    isLoading,
    setIsLoading,
    sendCode,
    error,
    loginWithCode,
    loginWithEmailState,
    initUser,
    fetchUserData,
  };
};

export default useUserServices;
