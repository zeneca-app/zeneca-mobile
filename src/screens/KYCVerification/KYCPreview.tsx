
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


const TEMPLATE_ID = process.env.EXPO_PUBLIC_AIPRISE_TEMPLATE_ID ?? "";
console.log(TEMPLATE_ID);

const KYCVerificationScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const launchKYCModal = () => {
        navigation.navigate("KYCModal");
    };

    return (<SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            {/* Remove the title from here */}
        </View>

        <View style={styles.content}>
            <Ionicons name="camera-outline" size={48} color="white" />
            <Text style={styles.title}>¡Ya casi!</Text>
            <Text style={styles.subtitle}>
                Para terminar, tenemos que verificar tu identidad. Solo te tomará unos minutos.
            </Text>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={launchKYCModal}>
                <Text style={styles.buttonText}>Comenzar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {/* Handle later */ }}>
                <Text style={styles.laterText}>Hacerlo más tarde</Text>
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
        textAlign: 'center',
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
