
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
    Dimensions,
} from "react-native";
import { useCamera } from "../../hooks/useCamera";
import { AiPriseButton, AiPriseFrame } from "aiprise-react-native-sdk";


const TEMPLATE_ID = process.env.EXPO_PUBLIC_AIPRISE_TEMPLATE_ID ?? "";
console.log(TEMPLATE_ID);

const KYCModal = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { permission, getPermission } = useCamera();

    useEffect(() => {
        getPermission();
    }, []);

    const { height, width } = Dimensions.get('window');


    return (<SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        <AiPriseFrame
            style={{
                width: width, 
                height: height * 0.89,

            }}

            mode="SANDBOX"
            templateID={TEMPLATE_ID ?? ""}
            theme={{
                background: "dark",
                layout_border_radius: "0px",
                font_name: "Manrope",
                button_padding: "12px",
                button_font_size: "14px",
                color_page: "#000000",
                button_border_radius: "60px"
            }}
        />
    </SafeAreaView>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202020',
        paddingBottom: 16
    },
    header: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
        fontWeight: 'bold',
    },
    laterText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    closeButton: {
        padding: 10,  // Add some padding for a larger touch area
    },
});

export default KYCModal;
