import VerifyIcon from "@/assets/id-card.svg";
import Card from "@/components/Card";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useUserStore } from "@/storage/userStore";

const VerifyCTACard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useUserStore();

  const obStatus = user?.account?.ob_status;
  const accountStatus = user?.account?.status;

  const goToOnboarding = () => {
    if (!obStatus) {
      navigation.navigate("KYCPreview");
      return;
    }
    switch (obStatus) {
      case "NAMES_STEP":
      case "COUNTRY_STEP":
        navigation.navigate("KYCPreview");
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

  if (accountStatus === "ACTIVE") return null;

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
