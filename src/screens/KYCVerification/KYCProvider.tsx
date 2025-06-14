import {
  onboardingOnboardingKycStepMutation,
  usersGetKycStatusOptions,
} from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { currentEnv } from "@/config/by_stage";
import { useCamera } from "@/hooks/useCamera";
import { useKYCStatusStore, useUserStore } from "@/storage/";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiPriseFrame } from "aiprise-react-native-sdk";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, SafeAreaView, View } from "react-native";

const AI_PRISE_THEME = {
  background: "dark",
  layout_border_radius: "0px",
  font_name: "Manrope",
  button_padding: "12px",
  button_font_size: "14px",
  color_page: "#000000",
  button_border_radius: "60px",
} as const;

type KYCProviderProps = {
  route: {
    params: {
      country_code: string;
    };
  };
};

const KYCProvider = ({ route }: KYCProviderProps) => {
  const { permission, getPermission, isRequesting } = useCamera();
  const { t } = useTranslation();
  const { country_code } = route.params;
  const navigation = useNavigation();
  const { height, width } = Dimensions.get("window");
  const { setObStatus } = useKYCStatusStore((state) => ({
    setObStatus: state.setObStatus,
  }));

  const queryClient = useQueryClient();

  const { mutate: updateKycStep } = useMutation({
    ...onboardingOnboardingKycStepMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersGetKycStatusOptions().queryKey,
      });
      setObStatus("KYC_PROVIDER_STEP");
      navigation.navigate("KYCSuccess");
    },
  });

  const handleOnComplete = () => {
    updateKycStep({
      client: client,
    });
  };

  const { user } = useUserStore();

  const country = country_code || user?.account?.country;

  // Show loading or permission request UI if permission isn't granted
  if (isRequesting) {
    return (
      <View className="flex-1 justify-center items-center bg-dark-background-100">
        <Text>{t("kycProvider.requestingPermission")}</Text>
      </View>
    );
  }

  if (!permission?.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-dark-background-100">
        <Text className="text-white text-center mb-4">
          {t("kycProvider.cameraPermissionRequired")}
        </Text>
        <Text className="text-gray-400 text-center mb-8 px-4">
          {t("kycProvider.cameraPermissionExplanation")}
        </Text>
        <Button onPress={getPermission}>
          {t("kycProvider.grantPermissionButton")}
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-background-100 pb-4">
      <View className="w-full px-4 py-1">
        <View className="flex-row justify-end"></View>
      </View>
      <AiPriseFrame
        style={{
          width: width,
          height: height * 0.89,
        }}
        mode={currentEnv.AI_PRISE_MODE}
        clientReferenceID={user?.account?.id}
        templateID={currentEnv.AIPRISE_TEMPLATE_ID}
        uiOptions={{
          id_verification_module: {
            allowed_country_code: country,
          },
        }}
        onStart={(sessionID) => {
          console.log("Session started with ID: " + sessionID);
          // Save the session ID in this step. Give it back to the component when you want to resume
        }}
        onResume={(sessionID) => {
          console.log("Session resumed with ID: " + sessionID);
        }}
        /* userData={{
          address: full_address,
        }} */
        theme={AI_PRISE_THEME}
        onSuccess={handleOnComplete}
        onComplete={handleOnComplete}
        onError={(errorCode) => {
          //alert("Error: " + errorCode);
          console.log("Error: " + errorCode);
          Sentry.captureException(errorCode, {
            tags: {
              component: "KYCProvider",
              action: "onError",
            },
          });
        }}
      />
    </SafeAreaView>
  );
};

export default KYCProvider;
