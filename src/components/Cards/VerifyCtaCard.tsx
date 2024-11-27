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

  const handlePress = () => {
    navigation.navigate("OnBoarding");
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
              Estamos validando tu cuenta
            </Text>
            <Text className="text-caption-xl text-gray-50 pb-2">
              Pronto te avisaremos
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
            {t("accountVerification.complete_to_continue")}
          </Text>
          <Text className="text-caption-xl text-gray-50 pb-2">
            {t("accountVerification.quick_and_easy")}
          </Text>
          <TouchableOpacity onPress={handlePress}>
            <View className="flex-row items-center">
              <Text className="text-button-s text-white pr-2">
                {t("accountVerification.verify_my_account")}
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
