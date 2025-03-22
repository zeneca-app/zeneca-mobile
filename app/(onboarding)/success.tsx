import { queryClient } from "@/storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const KYCSuccess = () => {
  const { t } = useTranslation();

  const goHome = async () => {
    router.replace("/(main)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-electric-70 justify-between">
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-[36px] font-bold text-white mb-5 font-['Manrope_700Bold']">
          {t("kycSuccess.title")}
        </Text>
        <Text className="text-[24px] text-white text-center mb-2.5 font-['Manrope_500Medium']">
          {t("kycSuccess.subtitle")}
        </Text>
        <Text className="text-base text-white text-center absolute bottom-[100px] left-5 right-5">
          {t("kycSuccess.wait")}
        </Text>
      </View>
      <TouchableOpacity
        className="bg-white rounded-[25px] py-4 mx-5 items-center mb-4"
        onPress={goHome}
      >
        <Text className="text-black text-base">
          {t("kycSuccess.doneButton")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


export default KYCSuccess;
