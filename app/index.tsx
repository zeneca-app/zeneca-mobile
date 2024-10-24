import { useEffect, useState } from "react";

import { getUserEmbeddedWallet, usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
//import LoginForm from "../components/login/login-form";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Logo from "@/assets/zeneca-logo-bright.svg";
import { colors } from "@/constants/colors";
import LogoLetter from "@/assets/zeneca-logo-letters.svg";
import GradientCircle from "@/assets/zeneca-gradient-circle.svg";
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum LoginStatus {
    INITIAL = "initial",
    EMAIL_ERROR = "email-error",
    CODE_ERROR = "code-error",
    SUCCESS_EMAIL = "email-success",
    SUCCESS_CODE = "code-success",
}

const Home = () => {
    const { t } = useTranslation();
    const { isReady, user, logout } = usePrivy();
    const address = getUserEmbeddedWallet(user)?.address;

    //const { user: storedUser, setUser } = useUserStore((state) => state);
    const [isFetchingUser, setIsFetchingUser] = useState(false);
    const [userFetchingCounter, setUserFetchingCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [loginStatus, setLoginStatus] = useState<LoginStatus>(
        LoginStatus.INITIAL
    );

    useEffect(() => {
        if (address) {
            setIsLoading(true);
            setLoadingMessage("Logging in...");
            getToken()
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => {
                    AsyncStorage.removeItem(`smartAccountAddress`).then(() => logout());
                    setIsLoading(false);
                });
        }
    }, [address]);

    /*   if (!!token && storedUser && !!passcode) {
        return (
          <Biometrics
            address={address!}
            user={storedUser}
            logout={logout}
            setUser={setUser}
          />
        );
      } */
    const loginOptions = async () => {
        router.push("/app/login-options");
    }

    const getToken = async () => {
        try {
            const smartAccountAddress = await AsyncStorage.getItem("smartAccountAddress");

            if (smartAccountAddress) {

                router.push("/app/home");

                return smartAccountAddress;
            }
        } catch (error) {
            console.error(error as any);
            throw new Error(error as any);
        }
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
                            <Text style={styles.description}>{t("login.description_line_1")}</Text>
                            <Text style={styles.description}>{t("login.description_line_2")}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Pressable style={styles.signUpButton} onPress={loginOptions}>
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
    safeAreaContainer: {
        flex: 1,
        backgroundColor: "#0D0B0D",
    },
    container: {
        flex: 1,
        backgroundColor: "#0D0B0D",
    },
    backgroundContainer: {
        position: 'absolute',
        top: '25%',
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
        marginTop: '60%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        textAlign: 'center',
        fontSize: 28,
        fontFamily: "Manrope_500Medium",
        color: "white",
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: "center",
    },
    signUpButton: {
        marginBottom: 20,
        flexDirection: 'row',
        width: '100%',
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
        flexDirection: 'row',
        width: '100%',
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

export default Home;
