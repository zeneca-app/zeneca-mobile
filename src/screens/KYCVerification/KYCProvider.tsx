import { useNavigation } from "@react-navigation/native";
import { AiPriseFrame } from "aiprise-react-native-sdk";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
} from "react-native";
import { TEMPLATE_ID, MODE } from "@/constants/kyc";
import { useUserStore } from "@/storage/";


const AI_PRISE_THEME = {
  background: "dark",
  layout_border_radius: "0px",
  font_name: "Manrope",
  button_padding: "12px",
  button_font_size: "14px",
  color_page: "#000000",
  button_border_radius: "60px",
} as const;


const KYCProvider = ({ route }) => {
  const { country_code } = route.params;
  const navigation = useNavigation();
  const { height, width } = Dimensions.get("window");

  const handleOnComplete = () => {
    navigation.goBack(); // Dismiss the modal
    navigation.navigate("KYCSuccess");
  };

  const { user } = useUserStore();
  const country = country_code || user?.account?.country;

  return (
    <SafeAreaView className="flex-1 bg-dark-background-100 pb-4">
      <View className="w-full px-4 py-1">
        <View className="flex-row justify-end">
        </View>
      </View>
      <AiPriseFrame
        style={{
          width: width,
          height: height * 0.89,
        }}
        mode={MODE}
        clientReferenceID={user?.account?.id}
        templateID={TEMPLATE_ID}
        uiOptions={{
          id_verification_module: {
            allowed_country_code: country,
          }
        }}
        /* userData={{
          address: full_address,
        }} */
        theme={AI_PRISE_THEME}
        onSuccess={handleOnComplete}
        onComplete={handleOnComplete}
        onError={(errorCode) => {
          alert("Error: " + errorCode);
        }}
      />
    </SafeAreaView>
  );
};

export default KYCProvider;
