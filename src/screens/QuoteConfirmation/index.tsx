import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import React, { useCallback, useMemo, useState } from "react";
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

import useTransactionStore from "../../storage/transactionStore";

const QuoteConfirmationScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const capitalizeFirstLetter = (string: string) => {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const handleContinue = () => {
        navigation.navigate("SentReceipt", {
            amount_in: route.params.amount_in,
            amount_out: route.params.amount_out,
            recipient: route.params.recipient,
            fee: route.params.fee,
            total: total,
        });
    };

    const total = parseFloat(route.params.amount_in) + parseFloat(route.params.fee)


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>{t("quoteConfirmation.title")}</Text>
                    <Text style={styles.amount}>
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(route.params.amount_out)} COP
                    </Text>
                    <Text style={styles.recipient}>
                        a <Text style={styles.recipientName}>{capitalizeFirstLetter(route.params.recipient.name)}</Text>
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.exchangeRate")}</Text>
                        <Text style={styles.detailValue}>{route.params.amount_in} USDC</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.fee")}</Text>
                        <Text style={styles.detailValue}>{route.params.fee} USDC</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.totalCost")}</Text>
                        <Text style={styles.detailValue}>{total} USDC</Text>
                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.timer}>Tasa se actualizara en {30}seg</Text>
                    <Text style={styles.warning}>{t("quoteConfirmation.disclaimer")}</Text>
                    <TouchableOpacity
                        onPress={handleContinue}
                        style={styles.confirmButton}>
                        <Ionicons name="scan-outline" size={24} color="black" style={styles.scanIcon} />
                        <Text
                            style={styles.confirmButtonText}

                        >{t("quoteConfirmation.confirm")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        padding: 16,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    amount: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#8E8EFF",
        marginBottom: 4,
    },
    recipient: {
        fontSize: 24,
        color: "white",
        marginBottom: 16,
    },
    recipientName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
    },
    detailsContainer: {
        backgroundColor: "#1C1C1E",
        borderRadius: 8,
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        color: "#666",
    },
    detailValue: {
        color: "white",
    },
    bottomSection: {
        alignItems: 'center',
    },
    timer: {
        color: "#666",
        marginBottom: 16,
    },
    warning: {
        color: "#666",
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    confirmButton: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    scanIcon: {
        marginRight: 8,
    },
    confirmButtonText: {
        color: "black",
        fontWeight: "bold",
    },
});


export default QuoteConfirmationScreen;
