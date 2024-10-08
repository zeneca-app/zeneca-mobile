import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLoginWithOAuth } from "@privy-io/expo";
import { toast } from "burnt";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";


const LoginOptions: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const goToNextScreen = () => {
        navigation.goBack(); // Dismiss the modal
        navigation.navigate("KYCPreview");
    };

    const { login, state } = useLoginWithOAuth({
        onSuccess: (user, isNewUser) => {
            console.log("user", user);
            updateLogged(true);
            goToNextScreen();
            if (isNewUser) {
                toast({
                    title: t("login.welcome_zeneca"),
                    preset: "done",
                });
            }
        },
        onError: (error) => {
            console.log("error", error);
        },
    });
    console.log("state", state);

    const { updateLogged } = useAuthStore((state) => ({
        updateLogged: state.updateLogged,
    }));

    const loginWithGmail = async () => {
        try {
            await login({ provider: "google" });
        } catch (error) {
            const e = error as Error;
            console.log("error", e);
            toast({
                title: e?.message ?? "Login Error",
                preset: "error",
            });
        }
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
                    {/* TODO: Enable email login without SSO */}
                    <Pressable style={styles.commonButtonPrimary} onPress={loginWithEmail}>
                        <Ionicons
                            name="mail"
                            size={24}
                            color={colors.darkHighlight}
                            style={styles.buttonIcon}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.commonButtonPrimaryText}>
                                Continue with Email
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
                                {t("login.continue_with_google")}
                            </Text>
                        </View>
                    </Pressable>
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
        backgroundColor: '#18171A',
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
});

export default LoginOptions;