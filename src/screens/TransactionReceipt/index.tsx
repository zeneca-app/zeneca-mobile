import React from "react";
import { useTranslation } from "react-i18next";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    Dimensions,
    View,
} from "react-native";
import { formatCurrency, CURRENCY_BY_COUNTRY, CurrencyCode } from "../../utils/currencyUtils";
import { Country } from "../../client";
import { Feather } from '@expo/vector-icons';
import useTransferStore from "../../storage/transferStore";
import { capitalizeFirstLetter } from "../../utils/string_utils";
import { formatQuoteToNumber } from "../../utils/quote";

const DetailRow = ({ label, value, valueStyle }: { label: string, value: string, valueStyle?: any }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
    </View>
);

const SummaryRow = ({ label, value, secondaryValue }: { label: string, value: string, secondaryValue?: string }) => (
    <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <View>
            <Text style={styles.summaryValue}>{value}</Text>
            {secondaryValue && <Text style={styles.secondaryValue}>{secondaryValue}</Text>}
        </View>
    </View>
);

const { height } = Dimensions.get('window');

const TransactionReceiptScreen = () => {
    const { t } = useTranslation();

    const { transfer } = useTransferStore((state) => ({ transfer: state.transfer }));

    const recipient = transfer.recipient;
    const quote = formatQuoteToNumber(transfer.quote!);

    const currency = CURRENCY_BY_COUNTRY[recipient?.country as Country].toUpperCase() as CurrencyCode;

    const truncateId = (id: string) => {
        if (id.length <= 8) return id;
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.handleBar} />
                    <View style={styles.iconContainer}>
                        <Feather name="arrow-up-right" size={24} color="white" />
                    </View>
                    <Text style={styles.headerText}>{t("sentReceipt.headerText")}</Text>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>
                            ${formatCurrency(quote.amount_out, currency)}
                        </Text>
                        <Text style={styles.currencySymbol}>{currency}</Text>
                    </View>
                    <Text style={styles.recipient}>
                        {t("sentReceipt.recipient_label")} <Text style={styles.recipientName}>{capitalizeFirstLetter(recipient?.name ?? "")}</Text>
                    </Text>

                    <View style={styles.detailsContainer}>
                        <DetailRow label={t("sentReceipt.date")} value={transfer.created_at} />
                        {/* <DetailRow label={t("sentReceipt.accountNumber")} value={recipient?.external_account?.account_number ?? ""} /> */}
                        <DetailRow label={t("sentReceipt.reference")} value={truncateId(transfer.id)} />
                        <DetailRow label={t("sentReceipt.status")} value={transfer.status} valueStyle={styles.statusText} />
                    </View>

                    <View style={styles.summaryContainer}>
                        {/*  <SummaryRow
                            //label={`${transaction.source} → ${currency}`}
                            //value={`${transaction.amount_in} ${transaction.source}`}
                            secondaryValue={formatCurrency(transaction.amount_out, currency)}
                        /> */}

                        {/* <SummaryRow
                            label={t("sentReceipt.fee")}
                            value={`${transaction.fee} ${transaction.source}`}
                            secondaryValue={formatCurrency(Number(quote.fee) * Number(quote.amount_out) / Number(quote.amount_in), currency)}
                        />
                        <SummaryRow
                            label={t("sentReceipt.total")}
                            value={`${Number(quote.amount_in) + Number(quote.fee)} ${quote.source}`}
                        /> */}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // Semi-transparent background
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#18171A',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        minHeight: height * 0.85, // Set minimum height to 75% of screen height
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(136, 136, 136, 0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#000', // Adjust the color as needed
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24, // Position the icon to overlap the top of the modal
        marginBottom: 16,
    },
    headerText: {
        color: '#888',
        fontSize: 14,
        marginTop: 12,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    amountText: {
        color: '#fff',
        fontSize: 38,
        fontWeight: 'bold',
        marginTop: 10,
        fontFamily: "Manrope_600SemiBold",
    },
    currencySymbol: {
        color: '#888',
        fontSize: 16,
        marginLeft: 12,
    },
    recipient: {
        color: '#888',
        fontSize: 22,
        marginTop: 5,
    },
    recipientName: {
        color: '#fff',
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: 55,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailLabel: {
        color: '#888',
        fontSize: 14,
    },
    detailValue: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'right',
    },
    statusText: {
        color: '#4CAF50',
    },
    summaryContainer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    summaryLabel: {
        color: '#888',
        fontSize: 14,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'right',
    },
    secondaryValue: {
        color: '#888',
        fontSize: 14,
        textAlign: 'right',
    },
});

export default TransactionReceiptScreen;