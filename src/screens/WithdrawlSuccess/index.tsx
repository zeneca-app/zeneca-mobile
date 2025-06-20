import useTransferStore from "@/storage/transferStore";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import * as Linking from "expo-linking";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const WithdrawlSuccessScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { txHash } = useTransferStore((state) => ({
    txHash: state.txHash,
  }));

  const goHome = () => {
    navigation.navigate("Home");
  };

  const showReceipt = async () => {
    const url = `https://basescan.org/tx/${txHash}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URI: " + url);
      toast({
        title: t("sendSuccess.errorText"),
        preset: "error",
      });
    }
  };

  return (
    <View className="flex-1 bg-black p-5">
      <View className="mt-25 flex-1 justify-start items-start">
        <View className="w-15 h-15 rounded-full border-2 border-[#04AE91] justify-center items-center mb-5">
          <Feather name="check" size={30} color="#04AE91" />
        </View>

        <Text className="text-[34px] font-medium text-white mb-2.5">{t("sendSuccess.title")}</Text>
        <Text className="text-base text-[#95929F] text-left">{t("sendSuccess.subtitle")}</Text>
      </View>

      <View className="mt-auto">
        <TouchableOpacity className="bg-white p-4 rounded-3xl items-center mb-2.5" onPress={goHome}>
          <Text className="text-black text-base font-medium">
            {t("sendSuccess.doneButton")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 items-center" onPress={showReceipt}>
          <Text className="text-white text-base font-medium">
            {t("sendSuccess.viewReceiptButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WithdrawlSuccessScreen;
