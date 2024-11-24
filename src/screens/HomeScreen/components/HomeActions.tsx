import BottomSheet, {
  BottomSheetButton,
  BottomSheetModal,
  BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const HomeActions = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();

  //const { dismiss, present } = useBottomSheetModal();

  const handleDeposit = () => {
    depositBottomMenuRef.current?.present();
  };

  const handleDepositCrypto = () => {
    depositBottomMenuRef.current?.dismiss();
    navigation.navigate("DepositCrypto");
  };

  const handleDepositBank = () => {
    depositBottomMenuRef.current?.dismiss();
    navigation.navigate("DepositWithBank");
  };

  const handleExplore = () => {
    depositBottomMenuRef.current?.dismiss();
    navigation.navigate("ExploreETFs");
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const depositBottomMenuRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <View className="flex absolute bottom-0 h-bottom-actions w-full">
        <LinearGradient
          style={{ flex: 1 }}
          colors={["#0D0C0E00", "#0D0C0E", "#0D0C0E"]}
        >
          <View className="flex-row flex-1 items-center justify-between px-layout w-full gap-2">
            <Button onPress={handleDeposit} className="flex-1">
              <AntDesign name="arrowdown" size={16} color="currentColor" />
              <Text className="button-m">{t("homeActions.deposit")}</Text>
            </Button>
            <Button onPress={handleExplore} className="flex-1">
              <AntDesign name="plus" size={16} color="currentColor" />
              <Text className="button-m">{t("homeActions.explore")}</Text>
            </Button>
          </View>
        </LinearGradient>
      </View>
      <BottomSheet ref={depositBottomMenuRef}>
        <BottomSheetView className="px-layout items-stretch rounded-card m-2 flex gap-8 pb-14">
          <BottomSheetButton
            icon={
              <MaterialCommunityIcons name="bank" size={24} color="white" />
            }
            label={t("home.actions.deposit_from_bank")}
            caption={t("home.actions.deposit_from_bank_caption")}
            onPress={handleDepositBank}
          />
          <BottomSheetButton
            icon={<Ionicons name="wallet" size={24} color="white" />}
            label={t("home.actions.deposit_crypto")}
            caption={t("home.actions.deposit_crypto_caption")}
            onPress={handleDepositCrypto}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

HomeActions.displayName = "HomeActions";

export default HomeActions;
