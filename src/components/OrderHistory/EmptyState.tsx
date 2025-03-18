import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '@/components/Text';
import ChartArrowUp from "@/assets/chart-arrow-up.svg";

export const EmptyState = () => {
    const { t } = useTranslation();

    return (
        <View className="flex-1 justify-center items-center">
            <View className="pb-6">
                <ChartArrowUp className="h-40 w-40" />
            </View>
            <Text className="text-center caption-xl text-gray-50">
                {t("orderHistory.title")}
            </Text>
            <Text className="text-center caption-xl text-gray-50 mt-2">
                {t("orderHistory.empty_transactions")}
            </Text>
        </View>
    );
}; 