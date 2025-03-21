import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { Order, OrderStatus } from '@/client/';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import AssetLogo from '@/components/AssetLogo';



type OrderHistoryDetailScreenProps = {
    route: {
        params: {
            order: Order;
        };
    };
};

interface OrderDetails {
    amount: number;
    price: number;
    fee: number;
    totalCost: number;
    reference: string;
    status: string;
    shares: number;
    symbol: string;
    pricePerShare: number;
}

const DetailRow: React.FC<{
    label: string;
    value: string;
    valueClassName?: string;
}> = ({ label, value, valueClassName }) => (
    <View className="flex-row justify-between items-center py-3 border-b border-[#1C1C1E]">
        <Text className="text-gray-400 text-base">{label}</Text>
        <Text className={`text-white text-base ${valueClassName || ''}`}>
            {value}
        </Text>
    </View>
);

const OrderDetailsScreen: React.FC<OrderHistoryDetailScreenProps> = ({ route }) => {
    const order = route.params.order;
    const { t } = useTranslation();
    const navigation = useNavigation();
    const amount = Number(order.payment_token_filled);
    const fees = Number(order.fee)
    const shares = Number(order.asset_token_filled)

    const averagePrice = Number((amount / shares).toFixed(2))
    const shortenReference = (ref: string) => {
        return `${ref.substring(0, 4)}...${ref.substring(ref.length - 4)}`;
    };

    const orderDetails: OrderDetails = {
        amount: amount,
        price: averagePrice,
        fee: fees,
        totalCost: amount,
        reference: shortenReference(order.external_id),
        status: order.status,
        shares: shares,
        symbol: order.symbol,
        pricePerShare: averagePrice
    };

    const getStatusColor = (status: OrderStatus): string => {
        switch (status.toUpperCase()) {
            case 'FILLED':
                return 'bg-green-500';
            case 'PENDING':
            case 'PENDING_CANCEL':
            case 'PENDING_ESCROW':
            case 'PENDING_FILL':
            case 'PENDING_SUBMIT':
            case 'ESCROWED':
                return 'bg-gray-500';
            case 'SUBMITTED':
                return 'bg-yellow-500';
            case 'CANCELLED':
            case 'ERROR':
            case 'REJECTED':
            case 'REQUIRING_CONTACT':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusTextColor = (status: OrderStatus): string => {
        switch (status.toUpperCase()) {
            case 'FILLED':
                return 'text-green-500';
            case 'PENDING':
            case 'PENDING_CANCEL':
            case 'PENDING_ESCROW':
            case 'PENDING_FILL':
            case 'PENDING_SUBMIT':
            case 'ESCROWED':
                return 'text-gray-500';
            case 'SUBMITTED':
                return 'text-yellow-500';
            case 'CANCELLED':
            case 'ERROR':
            case 'REJECTED':
            case 'REQUIRING_CONTACT':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const sharesWithSymbol = `${orderDetails.shares.toString()} ${order.symbol}`

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="p-6 flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View className="w-12 h-12 bg-[#1C1C1E] rounded-full justify-center items-center">
                        <AssetLogo symbol={order.symbol} size="md" />
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2"
                    >
                        <Ionicons name="close" size={24} color="#808080" />
                    </TouchableOpacity>
                </View>

                {/* Order Amount */}
                <View className="mb-8">
                    <Text className="text-gray-400 text-base mb-2">
                        {t(order.order_side === "BUY" ? t("orderHistory.buy") : t("orderHistory.sell"))} {order.symbol}
                    </Text>
                    <Text className="text-white text-4xl font-semibold">
                        ${orderDetails.amount}
                    </Text>

                </View>

                {/* Details Section */}
                <View className="space-y-1">
                    <DetailRow
                        label={t("orderHistoryDetail.price")}
                        value={`$${orderDetails.price}`}
                    />
                    <DetailRow
                        label={t("orderHistoryDetail.shares")}
                        value={sharesWithSymbol}
                    />
                    <DetailRow
                        label={t("orderHistoryDetail.fee")}
                        value={`$${orderDetails.fee}`}
                    />
                    <DetailRow
                        label={t("orderHistoryDetail.amount")}
                        value={`$${orderDetails.totalCost}`}
                    />
                    <DetailRow
                        label={t("orderHistoryDetail.reference")}
                        value={orderDetails.reference}
                    />

                    <View className="flex-row justify-between items-center py-3 border-b border-[#1C1C1E]">
                        <Text className="text-gray-400 text-base">{t("orderHistoryDetail.status")}</Text>
                        <View className="flex-row items-center gap-2">
                            <View className={`w-2 h-2 rounded-full ${getStatusColor(orderDetails.status as OrderStatus)}`} />
                            <Text className={`${getStatusTextColor(orderDetails.status as OrderStatus)} text-base`}>
                                {orderDetails.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/*  
                <Text className="text-gray-400 text-sm leading-5 mt-8">
                    {`realizaste una orden de compra de ${orderDetails.shares} acciones de ${orderDetails.symbol} por $${orderDetails.amount} a $${orderDetails.pricePerShare} por acción.`}
                </Text> 
                */}
            </View>
        </SafeAreaView>
    );
};

export default OrderDetailsScreen;