import BottomSheet, {
    BottomSheetButton,
    BottomSheetModal,
    BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import COLORS from "@/constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MarketHours = () => {
    const navigation = useNavigation();

    const { t } = useTranslation();

    const insets = useSafeAreaInsets();

    const { height } = Dimensions.get('window');
    const dynamicPaddingTop = Math.max(height * 0.05, 30); // 5% of screen height or minimum 30px
    const bottomPadding = Math.max(insets.bottom, 16); // Use safe area or minimum padding

    return (
        <>
            <View className="flex absolute bottom-0 h-bottom-actions w-full">
                <LinearGradient
                    style={{
                        flex: 1,
                        paddingTop: dynamicPaddingTop
                    }}
                    colors={["#0D0C0E00", "#0D0C0E", "#0D0C0E"]}
                >
                    <View
                        style={{ paddingBottom: bottomPadding }}
                        className="flex flex-1 items-center justify-between px-layout w-full gap-2 pb-6">
                        <Feather name="clock" size={25} color={COLORS.gray[50]} />
                        <Text className="caption-l text-gray-50">
                            {t("marketClosed")}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        </>
    );
};

MarketHours.displayName = "MarketHours";

export default MarketHours;
