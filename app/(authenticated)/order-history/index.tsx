import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Trans } from "react-i18next";
import { useState } from 'react';
import Text from '@/components/Text';
import LoggedLayout from "@/components/LoggedLayout";
import { Order } from '@/client/';
import { TabButton } from '@/components/OrderHistory/TabButton';
import { OrderHistoryItem } from '@/components/OrderHistory/OrderHistoryItem';
import { EmptyState } from '@/components/OrderHistory/EmptyState';
import { LoadingState } from '@/components/OrderHistory/LoadingState';
import { useOrders } from '@/hooks/useOrders';

const OrderHistory = () => {
    const [selectedTab, setSelectedTab] = useState<'todo' | 'orders' | 'transfers'>('todo');
    const { t } = useTranslation();
    const { isPending, orders, hasOrders, refetch } = useOrders();

    const renderItem = ({ item: order }: { item: Order }) => {
        if (!order) return null;
        return (
            <OrderHistoryItem
                order={order}
                
            />
        );
    }

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
                    title={t("orderHistory.all")}
                    active={selectedTab === 'todo'}
                    onPress={() => setSelectedTab('todo')}
                />
                <TabButton
                    title={t("orderHistory.orders")}
                    active={selectedTab === 'orders'}
                    onPress={() => setSelectedTab('orders')}
                />
                <TabButton
                    title={t("orderHistory.transfers")}
                    active={selectedTab === 'transfers'}
                    onPress={() => setSelectedTab('transfers')}
                />
            </View>

            <View className="flex-1 px-layout">
                {isPending ? (
                    <LoadingState />
                ) : !hasOrders ? (
                    <EmptyState />
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