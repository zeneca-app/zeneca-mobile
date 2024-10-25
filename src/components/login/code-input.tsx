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

  
    return (
        <>
            
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
