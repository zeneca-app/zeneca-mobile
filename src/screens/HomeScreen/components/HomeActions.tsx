import Button from "@/components/Button";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const HomeActions = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const handleDeposit = () => {
    console.log("deposit clicked");
  };

  const handleExplore = () => {
    console.log("explore clicked");
  };

  return (
    <>
      <View className="flex absolute bottom-0 h-bottom-actions w-full">
        <LinearGradient
          style={{ flex: 1 }}
          colors={["#0D0C0E00", "#0D0C0E", "#0D0C0E"]}
        >
          <View className="flex-row flex-1 items-center justify-between px-layout w-full gap-2">
            <Button onPress={handleDeposit} className="flex-1">
              <AntDesign name="plus" size={16} color="currentColor" />
              <Text className="text-button-m">{t("homeActions.deposit")}</Text>
            </Button>
            <Button onPress={handleExplore} className="flex-1">
              <AntDesign name="search1" size={16} color="currentColor" />
              <Text className="text-button-m">{t("homeActions.explore")}</Text>
            </Button>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

HomeActions.displayName = "HomeActions";

export default HomeActions;
