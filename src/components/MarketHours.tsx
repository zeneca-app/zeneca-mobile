import COLORS from "@/constants/colors";
import Feather from "@expo/vector-icons/build/Feather";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MarketHours = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16); // Use safe area or minimum padding

  return (
    <>
      <View
        style={{ paddingBottom: bottomPadding }}
        className="flex flex-1 items-center justify-between px-layout w-full gap-2 pb-6"
      >
        <Feather name="clock" size={25} color={COLORS.gray[50]} />
        <Text className="caption-l text-gray-50">{t("marketClosed")}</Text>
      </View>
    </>
  );
};

MarketHours.displayName = "MarketHours";

export default MarketHours;
