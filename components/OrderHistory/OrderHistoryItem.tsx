import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '@/components/Text';
import { Order } from '@/client';
import { getSmartDate } from '@/utils/date/formatters';
import { getStatusColor } from '@/utils/orders/status';

interface OrderHistoryItemProps {
    order: Order;
    onPress?: (order: Order) => void;
}

export const OrderHistoryItem = ({ order, onPress }: OrderHistoryItemProps) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity
            className="flex-row justify-between items-center py-4 border-b border-[#1C1C1E]"
            onPress={() => onPress?.(order)}
        >
            <View>
                {order.order_side === "BUY" && (
                    <Text className="text-white text-base font-medium">
                        {t("orderHistory.buy")} {order.symbol}
                    </Text>
                )}
                {order.order_side === "SELL" && (
                    <Text className="text-white text-base font-medium">
                        {t("orderHistory.sell")} {order.symbol}
                    </Text>
                )}
                <Text className="text-gray-400 text-sm">
                    {getSmartDate(order.created_at)}
                </Text>
            </View>

            <View className="items-end">
                <Text className="text-base text-white">
                    ${order.payment_token_filled}
                </Text>
                <Text className="text-base text-gray-400">
                    {order.asset_token_filled} {order.symbol}
                </Text>
                <Text className="text-base text-gray-400">
                    {order.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
}; 