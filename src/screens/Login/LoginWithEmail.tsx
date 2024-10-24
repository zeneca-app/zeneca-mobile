
import { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import {
    usePrivy,
    useEmbeddedWallet,
    isNotCreated,
    getUserEmbeddedWallet,
    useLoginWithEmail
} from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWalletStore } from "@/storage/walletStore";
import { useChainStore } from "@/storage/chainStore";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { LoginStatus } from "@/lib/types/login";
import EmailInput from "@/components/login/email-input";
import CodeInput from "@/components/login/code-input";
import { loginLoginOrCreate } from "@/client/";


const LoginWithEmail = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    // const { address } = usePrivyWagmiProvider();
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<`${number | ""}`>("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [loginStatus, setLoginStatus] = useState<LoginStatus>(
        LoginStatus.SUCCESS_EMAIL
    );

    const { logout, user, isReady, getAccessToken } = usePrivy();
    type PrivyUser = typeof user;

    const wallet = useEmbeddedWallet();
    const userAddress = getUserEmbeddedWallet(user)?.address;

    const chain = useChainStore((state) => state.chain);
    const setAddress = useWalletStore((state) => state.setAddress);

    const { state, sendCode, loginWithCode } = useLoginWithEmail({
        onError: (error) => {
            console.error("ERRRORRRR", error);
            setIsLoading(false);
            setLoginStatus(LoginStatus.CODE_ERROR);
        },
        onLoginSuccess(user, isNewUser) {
            console.log("Logged in", user);
        },
    });

    const handleConnection = useCallback(
        async (user: PrivyUser): Promise<void> => {
            const accessToken = await getAccessToken();

            if (!userAddress && isNotCreated(wallet)) {
                await wallet.create(); // Create the wallet
            }

            const smartAccount = await getPimlicoSmartAccountClient(
                userAddress as `0x${string}`,
                chain,
                wallet
            );

            setAddress(smartAccount?.account?.address as `0x${string}`);

            const account = user?.linked_accounts.find(account => account.type === 'email');
            if (account) {
                loginLoginOrCreate({
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: {
                        email: account.address,
                        has_third_party_auth: true,
                        wallet: {
                            address: userAddress as `0x${string}`,
                        }
                    }
                });
            }

            await SecureStore.setItemAsync(`token-${userAddress}`, accessToken!);
        },
        [user]
    );

    const goToNextScreen = () => {
        navigation.navigate("Home");
    };

    useEffect(() => {
        if (state.status === "done" && user) {
            try {
                handleConnection(user)
                    .then(() => {
                        console.log("success");
                        goToNextScreen();
                    })
                    .catch((e) => {
                        console.error("Error Handling Connection", e);
                        setIsLoading(false);
                        setLoginStatus(LoginStatus.CODE_ERROR);
                        navigation.navigate("Login");
                        throw new Error(e);
                    });
            } catch (e) {
                console.log("Error Connecting Stuffs", e);
                navigation.navigate("Login");
                throw new Error(e as any);
            }
        } else if (state.status === "initial") {
            setLoginStatus(LoginStatus.INITIAL);
        }
    }, [state, user]);

    return (<KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
    >
        <SafeAreaView style={styles.safeAreaContainer}>
            {loginStatus === LoginStatus.INITIAL && (
                <EmailInput
                    email={email}
                    setEmail={setEmail}
                    setCode={setCode}
                    setIsLoading={setIsLoading}
                    setLoadingMessage={setLoadingMessage}
                    setLoginStatus={setLoginStatus}

                />
            )}

            {loginStatus === LoginStatus.SUCCESS_EMAIL && (
                <CodeInput
                    code={code}
                    email={email!}
                    setCode={setCode}
                    setIsLoading={setIsLoading}
                    setLoginStatus={setLoginStatus}
                    setLoadingMessage={setLoadingMessage}
                    sendCode={sendCode}
                    loginWithCode={loginWithCode}
                />
            )}
        </SafeAreaView>
    </KeyboardAvoidingView>)
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#0D0B0D',
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
        color: '#fff',
        marginBottom: 20,
        fontFamily: "Manrope_500Medium",
    },
    inputContainer: {
        marginTop: 20,
    },
    inputLineError: {
        borderColor: 'red',
    },
    label: {
        color: '#95929F',
        fontSize: 14,
        marginBottom: 4,
        fontFamily: "Manrope_300Light",
    },
    input: {
        color: '#fff',
        fontSize: 16,
        paddingVertical: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        fontFamily: "Manrope_300Light",
    },
    inputLine: {
        height: 1,
        backgroundColor: '#333',
        marginTop: 8,
    },
    bottomContent: {
        padding: 20,
        marginTop: 'auto',
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

export default LoginWithEmail;