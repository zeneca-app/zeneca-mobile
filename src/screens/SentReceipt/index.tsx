

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
import useQuoteStore from "../../storage/quoteStore";
import { formatCurrency, CURRENCY_BY_COUNTRY, CurrencyCode } from "../../utils/currencyUtils";
import useRecipientStore from "../../storage/recipientStore";
import { Country } from "../../client";


const DetailRow = ({ label, value, secondaryValue, valueStyle, bold }:
    { label: string, value: string, secondaryValue: string | null, valueStyle: any, bold: boolean }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <View>
            <Text style={[styles.detailValue, valueStyle, bold && styles.boldText]}>{value}</Text>
            {secondaryValue && <Text style={styles.secondaryValue}>{secondaryValue}</Text>}
        </View>
    </View>
);

const SentReceiptScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { quote } = useQuoteStore((state) => ({
        quote: state.quote,
    }));

    const { recipient } = useRecipientStore((state) => ({
        recipient: state.recipient,
    }));

    const truncateId = (id: string) => {
        if (id.length <= 8) return id;
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const currency = CURRENCY_BY_COUNTRY[recipient.country as Country].toUpperCase() as CurrencyCode

    const handleDone = () => {
        navigation.navigate("MainTabs");
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{t("sentReceipt.headerText")}</Text>
            <Text style={styles.amountText}>
                {formatCurrency(quote.amount_out, currency)}
            </Text>
            <Text style={styles.recipient}>
                {t("sentReceipt.recipient_label")} <Text style={styles.recipientName}>{capitalizeFirstLetter(recipient.name)}</Text>
            </Text>

            <View style={styles.detailsContainer}>
                <DetailRow label={t("sentReceipt.date")} value={quote.expires_at} />
                <DetailRow label={t("sentReceipt.accountNumber")} value={recipient.external_account.account_number ?? ""} />
                <DetailRow label={t("sentReceipt.reference")} value={truncateId(quote.id)} />
                <DetailRow label={t("sentReceipt.status")} value={"PENDING"} valueStyle={styles.statusText} />
            </View>

            <View style={styles.summaryContainer}>
                <DetailRow label={t("sentReceipt.fee")} value={`${quote.fee} USDC`} secondaryValue={`${quote.fee} USDC`} />
                <DetailRow label={t("sentReceipt.totalCost")} value={`${quote.amount_in} ${quote.source}`} bold />
            </View>
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    onPress={handleDone}
                    style={styles.doneButton}>

                    <Text
                        style={styles.doneButtonText}

                    >{t("sentReceipt.doneButtonText")}</Text>
                </TouchableOpacity>
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
    bottomSection: {
        alignItems: 'center',
    },
    warning: {
        color: "#666",
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    doneButton: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    doneButtonText: {
        marginLeft: 8, // Add left margin to create space between icon and text
        color: "black",
        fontWeight: "bold",
    },
});

export default SentReceiptScreen;
