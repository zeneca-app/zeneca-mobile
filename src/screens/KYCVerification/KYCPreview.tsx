
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import VerifyIcon from "../../../assets/verify-icon.svg";
import VerifyIlustration from "../../../assets/verify-ilustration.svg";

const KYCVerificationScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const launchKYCProvider = () => {
        navigation.navigate("KYCProvider");
    };

    const goHome = () => {
        navigation.navigate("MainTabs");
    };

    return (<SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <View style={styles.illustrationContainer}>
                <VerifyIlustration width={200} height={200} />
            </View>
            <Text style={styles.title}>{t("kycPreview.title")}</Text>
            <Text style={styles.subtitle}>
                {t("kycPreview.subtitle")}
            </Text>
            <Text style={styles.terms} >
                {t("kycPreview.terms")}
            </Text>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={launchKYCProvider}>
                <Text style={styles.buttonText}>{t("kycPreview.startButton")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goHome}>
                <Text style={styles.laterText}>{t("kycPreview.laterButton")}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        padding: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 32,
    },
    illustrationContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontFamily: "Manrope_600SemiBold",
        color: 'white',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'left',
        alignSelf: 'flex-start',
        fontFamily: "Manrope_400Regular",
        marginBottom: 16,
    },
    terms: {
        fontSize: 16,
        color: '#888',
        fontFamily: "Manrope_400Regular",
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginBottom: 24,   // Add some space between terms and button
    },
    buttonContainer: {
        padding: 16,
    },
    startButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
    laterText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default KYCVerificationScreen;
