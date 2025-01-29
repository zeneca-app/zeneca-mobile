import { useEffect } from "react";
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



const VerifyCTACard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, isLoading: isUserLoading } = useUserStore();

  const {
    kycStatus,
    obStatus,
    isVerifying,
    isVerified,
    setKycStatus,
    setObStatus
  } = useKYCStatusStore(state => ({
    kycStatus: state.kycStatus,
    obStatus: state.obStatus,
    isVerifying: state.isVerifying,
    isVerified: state.isVerified,
    setKycStatus: state.setKycStatus,
    setObStatus: state.setObStatus,
  }));

  const { data: OBKYCStatus, isPending: isKycPending, error } = useQuery({
    ...usersGetKycStatusOptions(),
    staleTime: 0,
    gcTime: 0,
  });

  const isLoading = isKycPending || isUserLoading;


  const goToOnboarding = () => {
    if (!obStatus) {
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
        } as any);
        break;
      default:
        navigation.navigate("KYCPreview");
    }
  };

  useEffect(() => {
    if (OBKYCStatus) {
      setKycStatus(OBKYCStatus.kyc_status.status);
      setObStatus(OBKYCStatus.ob_status);
    }
  }, [OBKYCStatus]); // Runs whenever OBKYCStatus changes

  if (error) {
    return (
      <Card>
        <View className="flex-row items-center">
          <VerifyIcon className="h-10 w-10" />
          <View className="flex-col items-stretch justify-start pl-4">
            <Text className="caption-xl text-gray-50">
              Te ha ocurrido un error, por favor mas tarde
            </Text>
          </View>
        </View>
      </Card>
    );
  }

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
            Termina de verificar tu cuenta
          </Text>
          <TouchableOpacity onPress={goToOnboarding}>
            <View className="flex-row items-center">
              <Text className="text-button-s text-white pr-2">
                Verificar ahora
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

