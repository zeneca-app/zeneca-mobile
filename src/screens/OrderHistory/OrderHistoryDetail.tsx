import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { Order } from '@/client/';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


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
    const amount = order.order_side === "BUY" ?
        Number(order.payment_token_spent) :
        Number(order.payment_token_filled);
    const fees = Number(order.fee_wei)
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

    const getStatusColor = (status: string): string => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
            case 'FILLED':
                return 'bg-green-500';
            case 'PENDING':
            case 'OPEN':
                return 'bg-yellow-500';
            case 'CANCELLED':
            case 'FAILED':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="p-6 flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View className="w-12 h-12 bg-[#1C1C1E] rounded-full justify-center items-center">
                        <Ionicons name="logo-apple" size={24} color="white" />
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
                        Orden de compra
                    </Text>
                    <Text className="text-white text-4xl font-semibold">
                        ${orderDetails.amount}
                    </Text>
                </View>

                {/* Details Section */}
                <View className="space-y-1">
                    <DetailRow
                        label="Precio"
                        value={`$${orderDetails.price}`}
                    />
                    <DetailRow
                        label="Comisión"
                        value={`$${orderDetails.fee}`}
                    />
                    <DetailRow
                        label="Costo total"
                        value={`$${orderDetails.totalCost}`}
                    />
                    <DetailRow
                        label="Referencia"
                        value={orderDetails.reference}
                    />
                    <View className="flex-row justify-between items-center py-3 border-b border-[#1C1C1E]">
                        <Text className="text-gray-400 text-base">Status</Text>
                        <View className="flex-row items-center gap-2">
                            <View className={`w-2 h-2 rounded-full ${getStatusColor(orderDetails.status)}`} />
                            <Text className="text-white text-base">
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