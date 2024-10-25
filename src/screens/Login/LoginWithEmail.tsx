
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import {
    useLoginWithEmail
} from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoginStatus } from "@/lib/types/login";
import ErrorModal from "@/components/error-modal";
import LoadingScreen from "@/components/Loading";
import { useLoginStore } from "@/storage/loginStore";


const LoginWithEmail = () => {
    const TEST_EMAIL = "tester@zeneca.app";
    const { t } = useTranslation();
    const navigation = useNavigation();

    const { email, setEmail } = useLoginStore((state) => ({
        email: state.email,
        setEmail: state.setEmail,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const { loginStatus, setLoginStatus } = useLoginStore((state) => ({
        loginStatus: state.loginStatus,
        setLoginStatus: state.setLoginStatus,
    }));

    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const [hasError, setHasError] = useState(false);

    const { state, sendCode } = useLoginWithEmail({
        onError: (error) => {
            console.error("ERRRORRRR", error);
            setIsLoading(false);
            setHasError(true);
            setLoginStatus(LoginStatus.CODE_ERROR);
        },
        onLoginSuccess(user, isNewUser) {
            console.log("Logged in", user);
        },
    });

    const successLogin = () => {
        navigation.navigate("Home");
    }

    const dismissScreen = () => {
        navigation.goBack();
    }

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
        setLoadingMessage(t("loginWithEmail.sendingCode"));
        await sendCode({ email: email! });
        setLoadingMessage("");
        setIsLoading(false);
        setLoginStatus(LoginStatus.EMAIL_SEND);
        navigation.navigate("EmailOtpValidation");
    };

    const validateEmail = (email: string) => {
        const re = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(email);
    };


    return (<KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
    >
        <SafeAreaView style={styles.safeAreaContainer}>
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
            <LoadingScreen
                isVisible={isLoading}
                text={loadingMessage}
            />

            {state.status === "error" && (
                <ErrorModal
                    isVisible={hasError}
                    onClose={() => {
                        setHasError(false);
                        setEmail("");
                        setLoginStatus(LoginStatus.INITIAL);
                    }}
                    title={t("loginWithEmail.errorCodeText")}
                    actionButtonText={t("loginWithEmail.errorCodeTryAgain")}
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