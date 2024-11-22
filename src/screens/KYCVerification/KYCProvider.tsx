import { useCamera } from "@/hooks/useCamera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AiPriseFrame } from "aiprise-react-native-sdk";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const TEMPLATE_ID = process.env.EXPO_PUBLIC_AIPRISE_TEMPLATE_ID ?? ""; // TODO: Add this api call to the backend
const MODE = "SANDBOX"; // TODO: Add this api call to the backend


const KYCProvider = ({ route }) => {
  const { country_code, full_address } = route.params;
  const navigation = useNavigation();
  const { height, width } = Dimensions.get("window");

  const handleOnComplete = () => {
    navigation.goBack(); // Dismiss the modal
    navigation.navigate("KYCSuccess");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
        </View>
      </View>

      <AiPriseFrame
        style={{
          width: width,
          height: height * 0.89,
        }}
        mode={MODE}
        templateID={TEMPLATE_ID}
        uiOptions={{
          id_verification_module: {
            allowed_country_code: country_code, // 2-Letter Country Code. Disables all other countries.
          }
        }}
        userData={{
          address: full_address,
        }}
        theme={{
          background: "dark",
          layout_border_radius: "0px",
          font_name: "Manrope",
          button_padding: "12px",
          button_font_size: "14px",
          color_page: "#000000",
          button_border_radius: "60px",
        }}
        onSuccess={handleOnComplete}
        onComplete={handleOnComplete}
        onError={(errorCode) => {
          alert("Error: " + errorCode);
          // SESSION_FAILED is fired when session creation fails (due to incorrect values, internet or server issues, etc)
          // SESSION_EXPIRED happens when you try to resume a session but the session ID has expired
          // SESSION_COMPLETED happens when you try to resume a session but the session has already been completed by the user
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    paddingBottom: 16,
  },
  header: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  buttonContainer: {
    padding: 16,
  },
  startButton: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  laterText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    padding: 10, // Add some padding for a larger touch area
  },
});

export default KYCProvider;
