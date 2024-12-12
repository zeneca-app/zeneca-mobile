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
import { useUserStore } from "@/storage/";


const VerifyCTACard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, fetchUser, isLoading: isUserLoading } = useUserStore();

  const { isPending: isKycPending, error: kycError, data: OBKYCStatus } = useQuery({
    ...usersGetKycStatusOptions(),
    refetchInterval: Config.REFETCH_INTERVAL,
    staleTime: 0, // Consider data stale immediately
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    const needToRefetchUser = OBKYCStatus?.ob_status === "ADDRESS_STEP" && !user?.account
    if (needToRefetchUser) {
      fetchUser();
    }
  }, [OBKYCStatus]);

  const isLoading = isKycPending || isUserLoading;

  const obStatus = OBKYCStatus?.ob_status;
  const kycStatus = OBKYCStatus?.kyc_status;

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

  if (kycStatus?.status === "APPROVED") return null;

  const isVerifying = obStatus === "KYC_PROVIDER_STEP";

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
          {!isLoading ? (
            <TouchableOpacity onPress={goToOnboarding}>
              <View className="flex-row items-center">
                <Text className="text-button-s text-white pr-2">
                  {t("accountNotVerified.action")}
                </Text>
                <AntDesign name="arrowright" size={14} color="white" />
              </View>
            </TouchableOpacity>
          ) : (
            <SkeletonView className="w-20 h-4" />
          )}
        </View>
      </View>
    </Card>
  );
};

VerifyCTACard.displayName = "VerifyCTACard";

export default VerifyCTACard;
