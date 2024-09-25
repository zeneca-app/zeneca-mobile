import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
} from "react-native";
import useQuoteStore from "../../storage/quoteStore";
import { formatCurrency, CURRENCY_BY_COUNTRY, CurrencyCode } from "../../utils/currencyUtils";
import useRecipientStore from "../../storage/recipientStore";
import { Country } from "../../client";
import { Feather } from '@expo/vector-icons';


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

const SentReceiptScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { quote } = useQuoteStore((state) => ({ quote: state.quote }));
    const { recipient } = useRecipientStore((state) => ({ recipient: state.recipient }));

    const currency = CURRENCY_BY_COUNTRY[recipient.country as Country].toUpperCase() as CurrencyCode;

    const truncateId = (id: string) => {
        if (id.length <= 8) return id;
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/*  <View style={styles.handleBar} /> */}
                    <Feather name="arrow-up-right" size={20} color="white" />
                    <Text style={styles.headerText}>{t("sentReceipt.headerText")}</Text>
                    <Text style={styles.amountText}>
                        {formatCurrency(quote.amount_out, currency)}
                    </Text>
                    <Text style={styles.recipient}>
                        {t("sentReceipt.recipient_label")} <Text style={styles.recipientName}>{recipient.name}</Text>
                    </Text>

                    <View style={styles.detailsContainer}>
                        <DetailRow label={t("sentReceipt.date")} value={quote.expires_at} />
                        <DetailRow label={t("sentReceipt.accountNumber")} value={recipient.external_account.account_number ?? ""} />
                        <DetailRow label={t("sentReceipt.reference")} value={truncateId(quote.id)} />
                        <DetailRow label={t("sentReceipt.status")} value={t("sentReceipt.inProcess")} valueStyle={styles.statusText} />
                    </View>

                    <View style={styles.summaryContainer}>
                        <SummaryRow
                            label={`${quote.source} → ${currency}`}
                            value={`${quote.amount_in} ${quote.source}`}
                            secondaryValue={formatCurrency(quote.amount_out, currency)}
                        />
                        <SummaryRow
                            label={t("sentReceipt.fee")}
                            value={`${quote.fee} ${quote.source}`}
                            secondaryValue={formatCurrency(Number(quote.fee) * Number(quote.amount_out) / Number(quote.amount_in), currency)}
                        />
                        <SummaryRow
                            label={t("sentReceipt.total")}
                            value={`${Number(quote.amount_in) + Number(quote.fee)} ${quote.source}`}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)', // Semi-transparent background
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
        maxHeight: height * 0.95, // Limit the height to 90% of the screen
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(136, 136, 136, 0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 10,
    },
    headerText: {
        color: '#888',
        fontSize: 18,
        marginTop: 60,
    },
    amountText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 10,
    },
    recipient: {
        color: '#888',
        fontSize: 16,
        marginTop: 5,
    },
    recipientName: {
        color: '#fff',
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: 30,
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
        fontSize: 16,
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

export default SentReceiptScreen;