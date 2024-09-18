

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


const DetailRow = ({ label, value, secondaryValue, valueStyle, bold }:
    { label: string, value: string, secondaryValue: string, valueStyle: any, bold: boolean }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <View>
            <Text style={[styles.detailValue, valueStyle, bold && styles.boldText]}>{value}</Text>
            {secondaryValue && <Text style={styles.secondaryValue}>{secondaryValue}</Text>}
        </View>
    </View>
);

const SentReceiptScreen = ({ route }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const capitalizeFirstLetter = (string: string) => {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    // Assume these values are passed through route.params or fetched from an API
    const { amount_out, amount_in, recipient, date, bankAccount, reference, status, fee, total } = route.params;
    const currency = "USDC"
    const fee_cop = amount_out * 4183.13

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{t("sentReceipt.headerText")}</Text>
            <Text style={styles.amountText}>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(route.params.amount_out)} COP
            </Text>
            <Text style={styles.recipient}>
                {t("sentReceipt.recipient_label")} <Text style={styles.recipientName}>{capitalizeFirstLetter(route.params.recipient.name)}</Text>
            </Text>

            <View style={styles.detailsContainer}>
                <DetailRow label={date} value={date} />
                <DetailRow label={bankAccount} value={bankAccount} />
                <DetailRow label={reference} value={reference} />
                <DetailRow label={status} value={status} valueStyle={styles.statusText} />
            </View>

            <View style={styles.summaryContainer}>
                <DetailRow label={`USDC → COP`} value={`${amount_in} ${currency}`} secondaryValue={`${amount_out} COP`} />
                <DetailRow label={t("sentReceipt.fee")} value={`${fee} ${currency}`} secondaryValue={`${fee_cop} COP`} />
                <DetailRow label={t("sentReceipt.totalCost")} value={`${total} ${currency}`} bold />
            </View>
        </SafeAreaView>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 60,
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
    amountText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 10,
    },
    recipientText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 5,
    },
    detailsContainer: {
        marginTop: 30,
    },
    summaryContainer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailLabel: {
        color: '#888',
        fontSize: 16,
    },
    detailValue: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'right',
    },
    secondaryValue: {
        color: '#888',
        fontSize: 14,
        textAlign: 'right',
    },
    statusText: {
        color: '#4CAF50',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default SentReceiptScreen;
