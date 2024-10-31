import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const KYCSuccess = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const goHome = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("kycSuccess.title")}</Text>
        <Text style={styles.subtitle}>{t("kycSuccess.subtitle")}</Text>
        <Text style={styles.wait}>{t("kycSuccess.wait")}</Text>
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={goHome}>
        <Text style={styles.buttonText}>{t("kycSuccess.doneButton")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A10EF",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    fontFamily: "Manrope_700Bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Manrope_500Medium",
  },
  message: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Manrope_300Light",
  },
  wait: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
  },
  loaderContainer: {
    paddingBottom: 40,
  },
  buttonContainer: {
    padding: 16,
  },
  doneButton: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 16,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default KYCSuccess;
