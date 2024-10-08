
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


const KYCVerificationScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const launchKYCModal = () => {
        navigation.navigate("KYCModal");
    };

    const goHome = () => {
        navigation.navigate("MainTabs");
    };

    return (<SafeAreaView style={styles.container}>


        <View style={styles.content}>
            <VerifyIcon width={40} height={40} />
            <Text style={styles.title}>{t("kycPreview.title")}</Text>
            <Text style={styles.subtitle}>
                {t("kycPreview.subtitle")}
            </Text>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={launchKYCModal}>
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
    title: {
        fontSize: 28,
        fontFamily: "Manrope_500Medium",
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
