import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Modal,
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
      <View className="flex-1 justify-end items-center bg-black/50 pb-[30px]">
        <View className="mx-5 bg-[#18171A] py-[60px] px-[40px] rounded-[40px] items-center" style={{ width: width - 40 }}>
          {modalState === "error" ? (
            <Feather name="alert-circle" size={40} color="white" />
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Feather name="clock" size={40} color="white" />
            </Animated.View>
          )}
          <Text className="text-white mt-[10px] text-2xl font-bold">{text}</Text>
          {modalState === "error" && onClose && (
            <TouchableOpacity 
              className="mt-5 bg-[#252328] p-3 rounded-[20px]" 
              onPress={onClose}
            >
              <Text className="text-white text-base font-bold">{actionButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
