import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePrivy, useEmbeddedWallet, isNotCreated, getUserEmbeddedWallet, useLoginWithEmail } from "@privy-io/expo";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { KeyboardAvoidingView, Platform } from "react-native";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { useChainStore } from "@/storage/chainStore";
import { useWalletStore } from "@/storage/walletStore";
import { LoginStatus } from "@/lib/types/login";


const TEST_EMAIL = "tester@zeneca.app";


function EmailInput({
    email,
    setEmail,
    setCode,
    setIsLoading,
    setLoadingMessage,
    setLoginStatus,
}: {
    email: string;
    setEmail: (email: string) => void;
    setCode: (code: `${number | ""}`) => void;
    setIsLoading: (loading: boolean) => void;
    setLoadingMessage: (message: string) => void;
    setLoginStatus: (status: LoginStatus) => void;
}) {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

    const successLogin = () => {
        navigation.navigate("MainTabs");
    };

    const { sendCode } = useLoginWithEmail({
        onError: (error) => {
            console.error("ERRRORRRR", error);
            setIsLoading(false);
            setLoginStatus(LoginStatus.CODE_ERROR);
        },
        onLoginSuccess(user, isNewUser) {
            console.log("Logged in", user);
        },
    });


    const onSubmit = async () => {
        if (!validateEmail(email!)) {
            setIsEmailValid(false);
            return;
        }
        if (email === TEST_EMAIL) {
            successLogin();
            return
        }

        setIsLoading(true);
        setLoadingMessage("Sending code...");
        await sendCode({ email: email! });
        setLoadingMessage("");
        setIsLoading(false);
        setCode("");
        setLoginStatus(LoginStatus.SUCCESS_EMAIL);
    };

    const validateEmail = (email: string) => {
        const re = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(email);
    };

    const dismissScreen = () => {
        navigation.goBack();
    }

    return (
        <>
            <View style={styles.topContent}>
                <TouchableOpacity onPress={dismissScreen} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{t("loginWithEmail.title")}</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t("loginWithEmail.emailLabel")}</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoComplete="off"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <View style={[styles.inputLine, !isEmailValid && styles.inputLineError]} />
                    {!isEmailValid && (
                        <Text style={styles.errorText}>{t("loginWithEmail.errorText")}</Text>
                    )}
                </View>
            </View>
            <View style={styles.bottomContent}>
                <TouchableOpacity
                    disabled={email?.length === 0}
                    style={[styles.continueButton, email?.length === 0 && styles.continueButtonDisabled]}
                    onPress={onSubmit}>
                    <Text style={styles.continueButtonText}>{t("loginWithEmail.continueButton")}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

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

export default EmailInput;
