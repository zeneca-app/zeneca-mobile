import { View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ordersGetOrdersOptions } from '@/client/@tanstack/react-query.gen';
import { format } from 'date-fns';
import { Order } from '@/client/';
import SkeletonLoadingView, {
    SkeletonOrderListItem,
} from "@/components/Loading/SkeletonLoadingView";
import LoggedLayout from "@/components/LoggedLayout";
import { Trans } from "react-i18next";
import { useState } from 'react';


type OrderHistoryItemProps = {
    order: Order;
    onPress?: (order: Order) => void;
};


const OrderHistoryItem = ({ order, onPress }: OrderHistoryItemProps) => {

    const getSmartDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        /* // If less than 24 hours ago, show relative time
        if (diffInHours < 24) {
            return formatDistanceToNow(date, { addSuffix: true });
        } */
        // Otherwise show formatted date
        return format(date, "MMM d, h:mm a");
    };

    const statusColor = {
        FILLED: 'green-500',
        PENDING: 'yellow-500',
        CANCELLED: 'red-500',
        ERROR: 'red-500',
        REJECTED: 'red-500',
        REQUIRING_CONTACT: 'red-500',
        ESCROWED: 'gray-500',
        SUBMITTED: 'gray-500',
        PENDING_CANCEL: 'gray-500',
        PENDING_ESCROW: 'gray-500',
        PENDING_FILL: 'gray-500',
        PENDING_SUBMIT: 'gray-500',
    }[order.status];


    return (
        <TouchableOpacity
            className="flex-row justify-between items-center py-4 border-b border-[#1C1C1E]"
            onPress={() => onPress?.(order)}
        >
            <View>
                {order.order_side === "BUY" && <Text className="text-white text-base font-medium">
                    Compra de {order.symbol}
                </Text>}
                {order.order_side === "SELL" && <Text className="text-white text-base font-medium">
                    Venta de {order.symbol}
                </Text>}
                <Text className="text-gray-400 text-sm">
                    {getSmartDate(order.created_at)}
                </Text>
            </View>

            <View className="items-end">
                {order.order_side === "BUY" && <Text className="text-lg text-gray-400">
                    ${order.payment_token_spent}
                </Text>}
                {order.order_side === "SELL" && <Text className="text-lg text-gray-400">
                    ${order.payment_token_filled}
                </Text>}

                <Text className={`text-sm text-${statusColor}`}>
                    {order.status}
                </Text>

                <Text className="text-lg text-gray-400">
                    {order.asset_token_filled}
                </Text>

            </View>
        </TouchableOpacity>
    );
};


const TabButton = ({ title, active, onPress }: { title: string, active: boolean, onPress: () => void }) => (
    <TouchableOpacity
        className={`py-2 mx-1.5 px-3 rounded-full flex-1 items-center ${active ? 'bg-[#2C2C2E] border border-[#2C2C2E]' : 'bg-transparent border border-[#2C2C2E]'
            }`}
        onPress={onPress}
    >
        <Text className={`text-sm text-white`}>
            {title}
        </Text>
    </TouchableOpacity>
);

const OrderHistory = () => {
    const [selectedTab, setSelectedTab] = useState<'todo' | 'orders' | 'transfers'>('todo');

    const navigation = useNavigation();
    const { t } = useTranslation();

    const { isPending, error, data: orders, refetch } = useQuery({
        ...ordersGetOrdersOptions(),
    });

    const renderItem = ({ item: order }: { item: Order }) => {
        if (!order) return null;
        return (
            <OrderHistoryItem
                order={order}
                onPress={(order) => {
                    navigation.navigate('OrderHistoryDetail', { order });
                }}
            />
        );
    }
    const LoadingOrders = () => (
        <SkeletonLoadingView className="flex-1 flex">
            <SkeletonOrderListItem />
            <SkeletonOrderListItem />
            <SkeletonOrderListItem />
            <SkeletonOrderListItem />
            <SkeletonOrderListItem />
            <SkeletonOrderListItem />
            <SkeletonOrderListItem />
        </SkeletonLoadingView>
    )

    /*  const filteredData = transactions?.filter(item => {
         if (selectedTab === 'transactions') return item.type === 'trade';
         if (selectedTab === 'orders') return item.type === 'order';
         return item.type === 'deposit' || item.type === 'withdrawal';
       });
      */

    return (
        <LoggedLayout>
            <Text className="heading-s text-gray-10 px-layout pt-layout-s pb-layout-l">
                <Trans
                    i18nKey="orderHistory.title"
                    components={[]}
                />
            </Text>

            <View className="flex-row justify-between mb-4">
                <TabButton
                    title={"Todo"}
                    active={selectedTab === 'todo'}
                    onPress={() => setSelectedTab('todo')}
                />
                <TabButton
                    title={"Orders"}
                    active={selectedTab === 'orders'}
                    onPress={() => setSelectedTab('orders')}
                />
                <TabButton
                    title={"Transfers"}
                    active={selectedTab === 'transfers'}
                    onPress={() => setSelectedTab('transfers')}
                />
            </View>


            <View className="flex-1 px-layout">
                {isPending && !orders ? (
                    <LoadingOrders />
                ) : (
                    <FlatList
                        data={orders}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.external_id}
                        onRefresh={refetch}
                        refreshing={isPending}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </LoggedLayout>
    );
};

OrderHistory.displayName = "OrderHistory";
export default OrderHistory;