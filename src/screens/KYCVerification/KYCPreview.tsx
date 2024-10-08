
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
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            <Ionicons name="camera-outline" size={48} color="white" />
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
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'left',
    },
    buttonContainer: {
        padding: 16,
    },
    startButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 12,
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
