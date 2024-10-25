import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { baseSepolia } from "viem/chains";
import { toast } from "burnt";
import { usePrivy, useEmbeddedWallet, isNotCreated, getUserEmbeddedWallet, useLoginWithOAuth } from "@privy-io/expo";
import { useWalletStore } from "@/storage/walletStore";
import { useChainStore } from "@/storage/chainStore";
import { colors } from "@/styles/colors";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import LoginButton from "@/components/login/button";
import { LoginStatus } from "@/lib/types/login";
import ErrorModal from "@/components/error-modal";
import { loginLoginOrCreate } from "@/client/";
import * as SecureStore from "expo-secure-store";


const LoginOptions: React.FC<{
    visible: boolean,
    loginStatus: LoginStatus,
    setVisible: (visible: boolean) => void,
    setLoginStatus: (status: LoginStatus) => void,

}> = ({ visible, loginStatus, setLoginStatus, setVisible }) => {
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

    const { t } = useTranslation();
    const navigation = useNavigation();
    const { logout, user, getAccessToken } = usePrivy();
    type PrivyUser = typeof user;
    const wallet = useEmbeddedWallet();

    const setAddress = useWalletStore((state) => state.setAddress);
    const chain = useChainStore((state) => state.chain);
    const setChain = useChainStore((state) => state.setChain);

    const hideModal = () => {
        setVisible(false);
    }

    const goToNextScreen = () => {
        hideModal();
        navigation.navigate("Home");
    };

    const { login, state } = useLoginWithOAuth({
        onError: (error) => {
            console.error("ERRRORRRR", error);
            setIsGoogleLoading(false);
            setLoginStatus(LoginStatus.CODE_ERROR);
        },
        onSuccess: (user, isNewUser) => {
            console.log("onSuccess");
        },
    });


    const handleConnection = useCallback(
        async (user: PrivyUser): Promise<void> => {
            const accessToken = await getAccessToken();
            const userAddress = getUserEmbeddedWallet(user)?.address;

            if (isNotCreated(wallet)) {
                console.log("Creating wallet...");
                await wallet.create!();
                console.log("Wallet created, waiting for address...");
            }

            if (!userAddress) {
                return;
            }

            const smartAccount = await getPimlicoSmartAccountClient(
                userAddress as `0x${string}`,
                chain,
                wallet
            );

            if (!smartAccount || !smartAccount.account) {
                throw new Error("Cannot create wallet");
            }

            setAddress(smartAccount?.account?.address as `0x${string}`);
            setChain(baseSepolia);

            const account = user?.linked_accounts.find(account => account.type === 'google_oauth');
            if (!account) {
                return;
            }

            // create user on the backend
            loginLoginOrCreate({
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    email: account.email,
                    has_third_party_auth: true,
                    wallet: {
                        address: userAddress as `0x${string}`,
                        smart_account_address: smartAccount?.account?.address as `0x${string}`,
                    }
                }
            });

            await SecureStore.setItemAsync(`token-${userAddress}`, accessToken!);
        },
        [user, wallet]
    );

    const successLogin = () => {
        goToNextScreen();
    };

    useEffect(() => {
        if (state.status === "done" && user) {
            try {
                setIsGoogleLoading(true);
                handleConnection(user)
                    .then(() => {
                        setIsGoogleLoading(false);
                        console.log("success");
                        successLogin();
                    })
                    .catch((e) => {
                        console.error("Error Handling Connection", e);
                        setIsGoogleLoading(false);
                        throw new Error(e);
                    });
            } catch (e) {
                console.log("Error Connecting Stuffs", e);
                hideModal();
                showErrorToast();
                throw new Error(e as any);
            }
            showErrorToast();
        } else if (state.status === "initial") {
            setLoginStatus(LoginStatus.INITIAL);
        }


    }, [state, user]);

    const loginWithGmail = async () => {
        await login({ provider: "google" });
    };

    const showErrorToast = () => {
        // Show toast if an error occurs
        if (state.status === "error" || loginStatus === LoginStatus.CODE_ERROR) {
            toast({
                title: "An error has occurred",
                haptic: "error",
                preset: "done",
                message: "Please try again",
            });
        }
    }

    const loginWithEmail = () => {
        hideModal();
        navigation.navigate("LoginWithEmail");
    };



    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <Pressable
                style={styles.overlay}
                onPress={hideModal}
            />
            <View style={styles.modalContent}>
                <View style={styles.buttonsContainer}>
                    <LoginButton
                        icon="mail"
                        text={t("loginOptions.emailOption")}
                        onPress={loginWithEmail}
                        isPrimary={true}
                        isLoading={isEmailLoading}
                        disabled={isGoogleLoading}
                    />
                    <LoginButton
                        icon="logo-google"
                        text={t("loginOptions.googleOption")}
                        onPress={loginWithGmail}
                        isPrimary={false}
                        isLoading={isGoogleLoading}
                        disabled={isEmailLoading}
                    />
                    <Text style={styles.termsText}>
                        {t("loginOptions.terms")} <Text style={styles.termsTextLink}>{t("loginOptions.termsLink")}</Text>.
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        height: '45%',
        backgroundColor: '#19181B',
        borderRadius: 50,
        alignItems: 'center',
    },
    handleBar: {
        marginTop: 10,
        width: 50,
        height: 4,
        backgroundColor: '#312F36',
        borderRadius: 2,
    },
    buttonsContainer: {
        width: '100%',
        paddingVertical: 60,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: "center",
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    commonButtonPrimary: {
        flexDirection: 'row',
        width: '100%',
        height: 55,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        marginBottom: 25,
    },
    commonButtonSecondary: {
        flexDirection: 'row',
        width: '100%',
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
    textContainer: {
        marginLeft: 15,
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