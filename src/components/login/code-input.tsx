import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { OtpInput } from "react-native-otp-entry";
import useAuthStore from "@/storage/authStore";
import { useLoginWithEmail } from '@privy-io/expo';
import { LoginStatus } from '@/lib/types/login';


type SendCode = (args: { email: string }) => Promise<any>;
type LoginWithCode = (args: {
    code: string;
    email?: string | undefined;
}) => Promise<any | undefined>;

type CodeInputProps = {
    code: `${number | ""}`;
    email: string;
    setCode: (code: `${number | ""}`) => void;
    setIsLoading: (isLoading: boolean) => void;
    setLoadingMessage: (message: string) => void;
    setLoginStatus: (status: LoginStatus) => void;
    sendCode: SendCode;
    loginWithCode: LoginWithCode;
};


function CodeInput({
    code,
    email,
    setCode,
    setIsLoading,
    setLoadingMessage,
    setLoginStatus,
    sendCode,
    loginWithCode,
}: CodeInputProps) {

    const { t } = useTranslation();

    const isCodeFilled = code.length === 6;
    const navigation = useNavigation();

    const handleOtpFilled = (otp: string) => {
        setCode(otp as `${number | ""}`);
    };

    const handleConfirmCode = async () => {
        try {
            console.log("Logging in with code", code);
            setIsLoading(true);
            setLoadingMessage(t("loginWithEmail.verifyingCode"));
            await loginWithCode({
                code: code,
                email,
            });
            //setLoginStatus(LoginStatus.CODE_SUCCESS);
        } catch (error) {
            setLoadingMessage("");
            setIsLoading(false);
            setLoginStatus(LoginStatus.CODE_ERROR);
            console.error("Error confirming code", error);
        }
    };

    const dismissScreen = () => {
        setLoginStatus(LoginStatus.INITIAL)
    }

    return (
        <>
            <View style={styles.topContent}>
                <TouchableOpacity onPress={dismissScreen} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{t("emailOtpValidation.title")}</Text>
                <Text style={styles.subtitle}>{t("emailOtpValidation.subtitle")} {email}</Text>
                <View style={styles.codeInputContainer}>
                    <OtpInput
                        numberOfDigits={6}
                        focusColor="#5A10EF"
                        focusStickBlinkingDuration={500}
                        onTextChange={(text) => setCode(text as `${number | ""}`)}
                        onFilled={handleOtpFilled}
                        theme={{
                            containerStyle: styles.otpContainer,
                            inputsContainerStyle: styles.otpInputsContainer,
                            pinCodeContainerStyle: styles.otpPinCodeContainer,
                            pinCodeTextStyle: styles.otpPinCodeText,
                            focusStickStyle: styles.otpFocusStick,
                            focusedPinCodeContainerStyle: styles.otpActivePinCodeContainer,
                        }}
                    />
                </View>
            </View>
            <View style={styles.bottomContent}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !isCodeFilled && styles.continueButtonDisabled
                    ]}
                    disabled={!isCodeFilled}
                    onPress={handleConfirmCode}>
                    <Text style={[
                        styles.continueButtonText,
                        !isCodeFilled && styles.continueButtonTextDisabled
                    ]}>{t("emailOtpValidation.continueButton")}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
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
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        fontFamily: "Manrope_500Medium",
    },
    subtitle: {
        fontSize: 16,
        color: '#95929F',
        marginBottom: 30,
        fontFamily: "Manrope_400Regular",
    },
    codeInputContainer: {
        marginBottom: 30,
    },
    otpContainer: {
        width: '100%',
    },
    otpInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otpPinCodeContainer: {
        width: 40,
        height: 50,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#313036',
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    otpPinCodeText: {
        color: '#fff',
        fontSize: 24,
    },
    otpFocusStick: {
        display: 'none', // Hide the focus stick
    },
    otpActivePinCodeContainer: {
        borderBottomColor: '#5A10EF',
        borderBottomWidth: 2
    },
    bottomContent: {
        padding: 20,
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
    footer: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 30,
    },
});

export default CodeInput;
