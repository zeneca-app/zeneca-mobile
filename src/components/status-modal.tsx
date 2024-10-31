import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type ModalState = "dismissed" | "loading" | "error";

interface StatusModalProps {
  modalState: ModalState;
  text: string;
  onClose?: () => void;
  actionButtonText?: string;
}

const { width } = Dimensions.get("window");

const StatusModal: React.FC<StatusModalProps> = ({
  modalState = "dismissed",
  text,
  onClose,
  actionButtonText,
}) => {
  const { t } = useTranslation();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalState !== "dismissed"}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {modalState === "error" ? (
            <Feather name="alert-circle" size={40} color="white" />
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Feather name="clock" size={40} color="white" />
            </Animated.View>
          )}
          <Text style={styles.text}>{text}</Text>
          {modalState === "error" && onClose && (
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.actionButtonText}>{actionButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingBottom: 30,
  },
  content: {
    marginHorizontal: 20,
    backgroundColor: "#18171A",
    paddingVertical: 60,
    paddingHorizontal: 40,
    borderRadius: 40,
    alignItems: "center",
    width: width - 40,
  },
  text: {
    color: "#fff",
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: "#252328",
    padding: 12,
    borderRadius: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StatusModal;
