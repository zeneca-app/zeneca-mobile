import VerifyIcon from "@/assets/id-card.svg";
import Card from "@/components/Card";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  usersMeOptions
} from "@/client/@tanstack/react-query.gen";

const VerifyCTACard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    data: user,
    isPending: isUserPending,
    error,
  } = useQuery({
    ...usersMeOptions(),
  });

  const goToOnboarding = () => {
    switch (user?.account?.ob_status) {
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
        navigation.navigate("OnBoarding");
    }
  };

  const obStatus = user?.account?.ob_status;
  const accountStatus = user?.account?.status;

  const isVerifying = obStatus === "KYC_PROVIDER_STEP";

  if (accountStatus === "ACTIVE") return null;

  if (isVerifying) {
    return (
      <Card>
        <View className="flex-row items-center">
          <VerifyIcon className="h-10 w-10" />
          <View className="flex-col items-stretch justify-start pl-4">
            <Text className="text-caption-xl text-gray-50">
              {t("accountVerified.title")}
            </Text>
            <Text className="text-caption-xl text-gray-50 pb-2">
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
          <Text className="text-caption-xl text-gray-50">
            {t("accountNotVerified.title")}
          </Text>
          <Text className="text-caption-xl text-gray-50 pb-2">
            {t("accountNotVerified.subtitle")}
          </Text>
          <TouchableOpacity onPress={goToOnboarding}>
            <View className="flex-row items-center">
              <Text className="text-button-s text-white pr-2">
                {t("accountNotVerified.action")}
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
