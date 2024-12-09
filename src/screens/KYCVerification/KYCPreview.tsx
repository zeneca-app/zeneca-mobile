import VerifyIlustration from "@/assets/verify-ilustration.svg";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const KYCVerificationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const launchKYCProvider = () => {
    navigation.navigate("OnBoarding");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-background-100">
      <View className="flex-1 justify-center items-start px-layout-l">
        <View className="w-full items-center mb-6">
          <VerifyIlustration width={200} height={200} />
        </View>
        <Text className="heading-s text-dark-content-white mt-4 mb-2 text-left self-start">
          {t("kycPreview.title")}
        </Text>
        <Text className="body-s text-gray-60 text-left self-start mb-4">
          {t("kycPreview.subtitle")}
        </Text>
        <Text className="body-s text-gray-60 text-left self-start mb-6">
          {t("kycPreview.terms")}
        </Text>
      </View>
      <View className="p-layout">
        <TouchableOpacity
          className="bg-dark-content-white rounded-full py-4 items-center mb-4"
          onPress={launchKYCProvider}
        >
          <Text className="text-dark-content-dark body-s">
            {t("kycPreview.startButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default KYCVerificationScreen;
