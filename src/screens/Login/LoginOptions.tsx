import React, { useCallback, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { baseSepolia } from "viem/chains";
import { toast } from "burnt";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePrivy, useEmbeddedWallet, isNotCreated, getUserEmbeddedWallet, useLoginWithOAuth } from "@privy-io/expo";
import { useWalletStore } from "../../storage/walletStore";
import { useChainStore } from "../../storage/chainStore";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";
import { getPimlicoSmartAccountClient } from "../../lib/pimlico";



const LoginOptions: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { logout, user } = usePrivy();
    const wallet = useEmbeddedWallet();

    const setAddress = useWalletStore((state) => state.setAddress);
    const chain = useChainStore((state) => state.chain);
    const setChain = useChainStore((state) => state.setChain);

    const goToNextScreen = () => {
        navigation.goBack(); // Dismiss the modal
        navigation.navigate("MainTabs");
    };

    type PrivyUser = typeof user;

    const { login, state } = useLoginWithOAuth({
        onSuccess: (user, isNewUser) => {
            console.log("onSuccess");
        },
        onError: (error) => {
            console.log("error", error);
            logout();
        },
    });

    const handleConnection = useCallback(
        async (user: PrivyUser): Promise<void> => {
            if (isNotCreated(wallet)) {
                await wallet.create!();
            }

            const address = getUserEmbeddedWallet(user)?.address;

            const smartAccount = await getPimlicoSmartAccountClient(
                address as `0x${string}`,
                chain,
                wallet
            );

            // Store addresses in AsyncStorage
            await AsyncStorage.setItem('userAddress', address || '');
            await AsyncStorage.setItem('smartAccountAddress', smartAccount?.account?.address as `0x${string}`);

            setAddress(smartAccount?.account?.address as `0x${string}`);
            setChain(baseSepolia);
        },
        [user]
    );

    const successLogin = () => {
        updateLogged(true);
        goToNextScreen();
    };

    useEffect(() => {
        if (state.status === "done" && user) {
            try {
                handleConnection(user)
                    .then(() => {

                        console.log("success");
                        successLogin();
                    })
                    .catch((e) => {
                        console.error("Error Handling Connection", e);

                        throw new Error(e);
                    });
            } catch (e) {
                console.log("Error Connecting Stuffs", e);
                throw new Error(e as any);
            }
        } else if (state.status === "initial") {
            //setLoginStatus(LoginStatus.INITIAL);
        }
    }, [state, user]);

    const { updateLogged } = useAuthStore((state) => ({
        updateLogged: state.updateLogged,
    }));

    const loginWithGmail = async () => {
        await login({ provider: "google" });
    };

    const loginWithEmail = () => {
        navigation.goBack(); // Dismiss the modal
        navigation.navigate("LoginWithEmail");
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
        >
            <Pressable
                style={styles.overlay}
                onPress={navigation.goBack}
            />
            <View style={styles.modalContent}>
                <View style={styles.buttonsContainer}>
                    <Pressable style={styles.commonButtonPrimary} onPress={loginWithEmail}>
                        <Ionicons
                            name="mail"
                            size={24}
                            color={colors.darkHighlight}
                            style={styles.buttonIcon}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.commonButtonPrimaryText}>
                                {t("loginOptions.emailOption")}
                            </Text>
                        </View>
                    </Pressable>
                    <Pressable style={styles.commonButtonSecondary} onPress={loginWithGmail}>
                        <Ionicons
                            name="logo-google"
                            size={24}
                            color="white"
                            style={styles.buttonIcon}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.commonButtonSecondaryText}>
                                {t("loginOptions.googleOption")}
                            </Text>
                        </View>
                    </Pressable>
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