import { View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ordersGetOrdersOptions } from '@/client/@tanstack/react-query.gen';
import { currencyFormatter, formatNumber } from "@/utils/currencyUtils";
import { format, formatDistanceToNow } from 'date-fns';
import SkeletonLoadingView, {
    SkeletonOrderListItem,
} from "@/components/Loading/SkeletonLoadingView";

type OrderHistoryItemProps = {
    order: any; // Replace 'any' with your order type
    onPress?: (order: any) => void;
};


const OrderHistoryItem = ({ order, onPress }: OrderHistoryItemProps) => {
    console.log("order", order);

    // Option 1: Using date-fns formatDistanceToNow (e.g., "2 hours ago")
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    // Option 2: Using date-fns format (e.g., "Mar 15, 2:30 PM")
    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "MMM d, h:mm a");
    };

    // Option 3: Using Intl.DateTimeFormat (e.g., "3/15/24, 2:30 PM")
    const getLocalizedDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

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

    return (
        <TouchableOpacity
            className="flex-row justify-between items-center py-4 border-b border-[#1C1C1E]"
            onPress={() => onPress?.(order)}
        >
            <View>
                <Text className="text-[#95929F] text-sm mb-1">
                    {order.status}
                </Text>
                <Text className="text-white text-base font-medium">
                    {order.symbol}
                </Text>
            </View>
            <View className="items-end">
                <Text className="text-white text-base font-medium">
                    {currencyFormatter(order.payment_quantity, 2, 6)}
                </Text>
                <Text className="text-[#95929F] text-sm">
                    {order.order_type}
                </Text>
                <Text className="text-[#95929F] text-sm">
                    {getSmartDate(order.created_at)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const OrderHistory = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { isPending, error, data: orders, refetch } = useQuery({
        ...ordersGetOrdersOptions(),
    });

    const renderItem = ({ item: order }) => (
        <OrderHistoryItem
            order={order}
            onPress={(order) => {
                // Handle order press
                console.log('Order pressed:', order);
            }}
        />
    );

    const ListHeader = () => (
        <>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mb-4"
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-basic-black">
            <View className="flex-1 px-4">
                {isPending && !orders ? (
                    <SkeletonLoadingView className="flex-1 flex">
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                        <SkeletonOrderListItem />
                    </SkeletonLoadingView>
                ) : (
                    <FlatList
                        data={orders}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeader}
                        onRefresh={refetch}
                        refreshing={isPending}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: 16 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default OrderHistory;