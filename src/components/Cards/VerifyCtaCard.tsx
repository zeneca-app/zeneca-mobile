import { useEffect, useCallback } from "react";
import VerifyIcon from "@/assets/id-card.svg";
import Card from "@/components/Card";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { usersGetKycStatusOptions } from "@/client/@tanstack/react-query.gen";
import Config from "@/config";
import SkeletonLoadingView, {
  SkeletonView,
} from "@/components/Loading/SkeletonLoadingView";
import { useKYCStatusStore, useUserStore } from "@/storage/";
import { OnboardingStatus } from "@/client";
import * as Sentry from '@sentry/react-native';


const VerifyCTACard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, isLoading: isUserLoading } = useUserStore();

  const { kycStatus, obStatus, isVerifying, isVerified, setKycStatus, setObStatus } = useKYCStatusStore(
    useCallback(state => ({
      kycStatus: state.kycStatus,
      obStatus: state.obStatus,
      isVerifying: state.isVerifying,
      isVerified: state.isVerified,
      setKycStatus: state.setKycStatus,
      setObStatus: state.setObStatus,
    }), [])
  );

  const { data: OBKYCStatus, isPending: isKycPending, error } = useQuery({
    ...usersGetKycStatusOptions(),
    staleTime: 0,
    gcTime: 0,
    onError: (err) => {
      Sentry.captureException(err, {
        tags: { component: 'VerifyCtaCard', action: 'fetchKYCStatus' },
        extra: { kycStatus, obStatus }
      });
    }
  });

  const isLoading = isKycPending || isUserLoading;

  const goToOnboarding = () => {
    if (!obStatus || !user?.account) {
      navigation.navigate("KYCPreview");
      return;
    }

    switch (obStatus) {
      case "NAMES_STEP":
      case "COUNTRY_STEP":
        navigation.navigate("OnBoarding");
        break;
      case "ADDRESS_STEP":
        navigation.navigate("KYCProvider", {
          country_code: user?.account?.country,
        });
        break;
      default:
        navigation.navigate("KYCPreview");
    }
  };

  useEffect(() => {
    let cleanup = false;

    const handleStatusUpdate = () => {
      if (!cleanup && OBKYCStatus) {
        setKycStatus(OBKYCStatus.kyc_status.status);
        setObStatus(OBKYCStatus.ob_status);
      }
    };

    handleStatusUpdate();

    return () => { cleanup = true; };
  }, [OBKYCStatus, setKycStatus, setObStatus, error]);


  if (isVerified) return null;


  if (isVerifying) {
    return (
      <Card>
        <View className="flex-row items-center">
          <VerifyIcon className="h-10 w-10" />
          <View className="flex-col items-stretch justify-start pl-4">
            <Text className="caption-xl text-gray-50">
              {t("accountVerified.title")}
            </Text>
            <Text className="caption-xl text-gray-50 pb-2">
              {t("accountVerified.subtitle")}
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <View className="flex-row items-center">
          <VerifyIcon className="h-10 w-10" />
          <View className="flex-col items-stretch justify-start pl-4">
            <SkeletonView className="w-46 h-4 mb-3" />
            <SkeletonView className="w-20 h-4" />
          </View>
        </View>
      </Card>
    );
  }


  if (obStatus === "NOT_STARTED") {
    return (
      <Card>
        <View className="flex-row items-center">
          <VerifyIcon className="h-10 w-10" />
          <View className="flex-col items-stretch justify-start pl-4">
            <Text className="caption-xl text-gray-50">
              {t("accountNotVerified.title")}
            </Text>
            <Text className="caption-xl text-gray-50 pb-2">
              {t("accountNotVerified.subtitle")}
            </Text>
            <TouchableOpacity onPress={goToOnboarding}>
              <View className="flex-row items-center">
                <Text className="text-button-s text-white pr-2">
                  {t("accountIncomplete.action")}
                </Text>
                <AntDesign name="arrowright" size={14} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View className="flex-row items-center">
        <VerifyIcon className="h-10 w-10" />
        <View className="flex-col items-stretch justify-start pl-4">
          <Text className="caption-xl text-gray-50">
            {t("accountIncomplete.title")}
          </Text>
          <Text className="caption-xl text-gray-50 pb-2">
            {t("accountIncomplete.subtitle")}
          </Text>
          <TouchableOpacity onPress={goToOnboarding}>
            <View className="flex-row items-center">
              <Text className="text-button-s text-white pr-2">
                {t("accountIncomplete.action")}
              </Text>
              <AntDesign name="arrowright" size={14} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

};

VerifyCTACard.displayName = "VerifyCTACard";

export default VerifyCTACard;

