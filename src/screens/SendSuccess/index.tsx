import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { toast } from "burnt";
import * as Linking from "expo-linking";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useTransferStore from "../../storage/transferStore";

const SendSuccessScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { txHash } = useTransferStore((state) => ({
    txHash: state.txHash,
  }));

  const goHome = () => {
    navigation.navigate("MainTabs");
  };

  const showReceipt = async () => {
    const url = `https://sepolia.basescan.org/tx/${txHash}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URI: " + url);
      toast({
        title: t("sendSuccess.errorText"),
        preset: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainer}>
          <Feather name="check" size={30} color="#04AE91" />
        </View>

        <Text style={styles.title}>{t("sendSuccess.title")}</Text>
        <Text style={styles.subtitle}>{t("sendSuccess.subtitle")}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={goHome}>
          <Text style={styles.primaryButtonText}>
            {t("sendSuccess.doneButton")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={showReceipt}>
          <Text style={styles.secondaryButtonText}>
            {t("sendSuccess.viewReceiptButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  content: {
    marginTop: 100,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#04AE91",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontFamily: "Manrope_500Medium",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#95929F",
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
  secondaryButton: {
    padding: 15,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
});

export default SendSuccessScreen;
