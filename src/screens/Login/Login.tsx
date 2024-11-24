import GradientCircle from "@/assets/zeneca-gradient-circle.svg";
import Logo from "@/assets/zeneca-logo-bright.svg";
import LogoLetter from "@/assets/zeneca-logo-letters.svg";
import { usersMe } from "@/client";
import Button from "@/components/Button";
import ZenecaSafeAreaView from "@/components/ZenecaSafeAreaView";
import { DBUser } from "@/storage/interfaces";
import { useUserStore } from "@/storage/userStore";
import { getUserEmbeddedEthereumWallet, usePrivy } from "@privy-io/expo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { cssInterop } from "nativewind";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { isReady, user, logout } = usePrivy();
  const address = getUserEmbeddedEthereumWallet(user)?.address;
  const { user: storedUser, setUser } = useUserStore((state) => state);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const token = SecureStore.getItem(`token-${address}`);

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      setLoadingMessage("Logging in...");
      getToken()
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          SecureStore.deleteItemAsync(`token-${address}`).then(() => logout());
          setIsLoading(false);
        });
    }
  }, [address]);

  const getToken = async () => {
    try {
      if (token) {
        const userData = await fetchUserData(token);
        setUser({ ...userData, token } as DBUser);
        setIsFetchingUser(false);
        navigation.navigate("Home");
        return token;
      }
    } catch (error) {
      console.error(error as any);
      throw new Error(error as any);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      setIsFetchingUser(true);

      const response = await usersMe({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        throw new Error("Authentication failed. Please log in again.");
      }

      setIsFetchingUser(false);

      return response.data;
    } catch (error) {
      console.log("Error fetching user data", { error });
      setIsLoading(false);
      setIsFetchingUser(false);

      throw new Error(error as any);
    }
  };

  /* if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Logo width={60} height={60} />
        <ActivityIndicator animating={true} color={"#fff"} />
      </SafeAreaView>
    );
  } */

  const loginWithOptions = () => {
    navigation.navigate("LoginOptions");
  };

  cssInterop(LogoLetter, { className: "style" });

  return (
    <ZenecaSafeAreaView className="flex-1 justify-start items-stretch bg-basic-black">
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
              <Text className="caption-xl text-gray-50 text-center">
                {t("login.description_line_1")}
              </Text>
              <Text className="caption-xl text-gray-50 text-center">
                {t("login.description_line_2")}
              </Text>
            </View>
          </View>
          <View className="flex items-stretch justify-start gap-buttons">
            <Button onPress={loginWithOptions} className="w-full">
              <Text className="button-m text-content-dark-content">
                {t("login.signUpButton")}
              </Text>
            </Button>
            {/* {showSignUp && (
              <Button
                onPress={loginWithOptions}
                className="w-full"
                variant="link"
              >
                <Text className="button-m text-white">
                  {t("login.signInButton")}
                </Text>
              </Button>
            )} */}
          </View>
        </View>
      </View>
      {/* <BottomSheet ref={loginOptionsRef}>
        <BottomSheetView className="px-layout items-stretch rounded-card m-2 flex gap-buttons pb-14">
          <Button onPress={loginWithEmail}>
            <Ionicons name="mail" size={20} color="black" />
            <Text className="button-m">
              {t("loginOptions.emailOption")}
            </Text>
          </Button>
          <Button onPress={loginWithGmail}>
            <AntDesign name="google" size={20} color="black" />
            <Text className="button-m">
              {t("loginOptions.googleOption")}
            </Text>
          </Button>
        </BottomSheetView>
      </BottomSheet> */}
    </ZenecaSafeAreaView>
  );
};

export default Login;
