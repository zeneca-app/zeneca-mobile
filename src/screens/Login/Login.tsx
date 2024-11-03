import GradientCircle from "@/assets/zeneca-gradient-circle.svg";
import Logo from "@/assets/zeneca-logo-bright.svg";
import LogoLetter from "@/assets/zeneca-logo-letters.svg";
import { usersMe } from "@/client";
import { DBUser } from "@/storage/interfaces";
import { useUserStore } from "@/storage/userStore";
import { usersMeQueryKey } from "@/client/@tanstack/react-query.gen";
import { colors } from "@/styles/colors";
import { getUserEmbeddedWallet, usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { isReady, user, logout } = usePrivy();
  const address = getUserEmbeddedWallet(user)?.address;
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

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.backgroundContainer}>
          <GradientCircle style={styles.gradientCircle} />
          <View style={styles.logoOverlay}>
            <Logo width={60} height={60} />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <LogoLetter style={styles.logoLetters} />
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                {t("login.description_line_1")}
              </Text>
              <Text style={styles.description}>
                {t("login.description_line_2")}
              </Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <Pressable style={styles.signUpButton} onPress={loginWithOptions}>
              <Text style={styles.signUpButtonText}>
                {t("login.signUpButton")}
              </Text>
            </Pressable>
            {/* <Pressable style={styles.signInButton} onPress={loginOptions}>
              <Text style={styles.signInButtonText}>
                {t("login.signInButton")}
              </Text>
            </Pressable> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingMessage: {
    color: "white",
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0B0D", // Assuming you want the same background color as the main container
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#0D0B0D",
  },
  container: {
    flex: 1,
    backgroundColor: "#0D0B0D",
  },
  backgroundContainer: {
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientCircle: {
    position: "absolute",
  },
  logoOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    marginTop: "60%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoLetters: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
    color: "white",
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Manrope_500Medium",
    color: "white",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButton: {
    marginBottom: 20,
    flexDirection: "row",
    width: "100%",
    padding: 16,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  signUpButtonText: {
    color: colors.darkHighlight,
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
  },
  signInButton: {
    flexDirection: "row",
    width: "100%",
    padding: 16,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252328",
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
});

export default Login;
