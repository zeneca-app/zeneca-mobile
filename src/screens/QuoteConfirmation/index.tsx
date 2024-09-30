import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
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

import useRecipientStore from "../../storage/recipientStore";
import useQuoteStore from "../../storage/quoteStore";
import * as LocalAuthentication from 'expo-local-authentication';
import FaceIdIcon from "../../../assets/face-id.svg";
import { formatCurrency, CURRENCY_BY_COUNTRY, CurrencyCode } from "../../utils/currencyUtils";
import { Country } from "../../client";
import { quotesCreateQuote, transfersCreateTransfer, customersGetCustomer, TransferRead, QuoteRead } from "../../client";
import { formatQuoteToNumber } from "../../utils/quote";
import LoadingScreen from "../LoadingScreen";
import useTransferStore from "../../storage/transferStore";
import { capitalizeFirstLetter } from "../../utils/string_utils";



const QuoteConfirmationScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { recipient } = useRecipientStore((state) => ({
        recipient: state.recipient,
    }));

    const { quote, setQuote } = useQuoteStore((state) => ({
        quote: state.quote,
        setQuote: state.setQuote,
    }));

    const { setTransfer } = useTransferStore((state) => ({
        transfer: state.transfer,
        setTransfer: state.setTransfer,
    }));

    const { data: customer } = useQuery({
        queryKey: ["customer"],
        queryFn: customersGetCustomer,
    });

    const customerId = "0191ddc1-5791-7383-8647-e8b068c8af65" // TODO: get from customer

    const calculateTimeLeft = () => {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeLeft = quote.expires_at - now;
        return timeLeft > 0 ? timeLeft : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    const currency = CURRENCY_BY_COUNTRY[recipient.country as Country].toUpperCase() as CurrencyCode

    const { mutate: createTransaction, isPending: isTransactionPending } = useMutation({
        mutationFn: () =>
            transfersCreateTransfer({
                body: {
                    quote_id: quote.id,
                    customer_id: customerId,
                    recipient_id: recipient.id,
                },
            }),
        onSuccess: async (data) => {
            console.log("transaction created", data.data)
            setTransfer(data.data as TransferRead);

            await new Promise(resolve => setTimeout(resolve, 20000));
            navigation.navigate("SendSuccess")

        },
        onError: (error) => {
            console.log("error quote", error)
        },
    });

    const { mutate: createQuote, isPending: isQuotePending } = useMutation({
        mutationFn: () =>
            quotesCreateQuote({
                body: {
                    source: "usdc.polygon",
                    destination: currency,
                    amount_in: quote.amount_in,
                    recipient_id: recipient.id,
                    payment_rail: "ach",
                },
            }),
        onSuccess: (data) => {
            console.log("quote updated", data.data)
            const quoteRaw = formatQuoteToNumber(data.data as QuoteRead);
            setQuote(quoteRaw);
            setTimeLeft(quoteRaw.expires_at - Math.floor(Date.now() / 1000));
        },
        onError: (error) => {
            console.log("error quote", error)
        },
    });

    const handleCreateTransaction = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t("faceId.prompt"),
                fallbackLabel: t("faceId.fallback"),
            });

            if (result.success) {
                createTransaction();
                //navigation.navigate("TransactionReceipt");
            } else {
                // Handle authentication failure
                console.log("Authentication failed");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            // Fetch new quote when timer reaches zero
            createQuote();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, createQuote]);

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
                        {formatCurrency(quote.amount_out, currency as CurrencyCode, true)}
                    </Text>
                    <Text style={styles.recipient}>
                        {t("quoteConfirmation.to")} <Text style={styles.recipientName}>{capitalizeFirstLetter(recipient.name)}</Text>
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.accountNumber")}</Text>
                        <Text style={styles.detailValue}>{recipient.external_account.account_number ?? ""}</Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.amount")}</Text>
                        <Text style={styles.detailValue}>{quote.amount_in} USDC</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.fee")}</Text>
                        <Text style={styles.detailValue}>{quote.fee} USDC</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t("quoteConfirmation.total")}</Text>
                        <Text style={styles.detailValue}>{formatCurrency(quote.amount_out, currency as CurrencyCode)} {currency} </Text>
                    </View>
                </View>

                <View style={styles.timerContainer}>
                    {!isTransactionPending && (
                        <Text style={styles.timer}>{t("quoteConfirmation.timerDescription")} {formatTime(timeLeft)}</Text>
                    )}
                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.warning}>{t("quoteConfirmation.disclaimer")}</Text>
                    {!isTransactionPending && (
                        <TouchableOpacity
                            disabled={isTransactionPending || isQuotePending}
                            onPress={handleCreateTransaction}
                            style={styles.confirmButton}>
                            <FaceIdIcon width={24} height={24} />
                            <Text
                                style={styles.confirmButtonText}

                            >{t("quoteConfirmation.confirm")}</Text>
                        </TouchableOpacity>)}
                </View>
            </View>
            <LoadingScreen isVisible={isTransactionPending} text={t("quoteConfirmation.pending")} />
        </SafeAreaView >
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
        fontSize: 22,
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
        marginBottom: 20,
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
    timerContainer: {
        alignItems: 'center',
        marginBottom: 20, // Add some bottom margin
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
        marginLeft: 8, // Add left margin to create space between icon and text
        color: "black",
        fontWeight: "bold",
    },
});


export default QuoteConfirmationScreen;
